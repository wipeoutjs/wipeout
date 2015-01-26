
Class("wipeout.change.array", function () {
        
    function array(array, change, changeHandler) {
        this.array = array;
        this.change = change;
        this.changeHandler = changeHandler;
        
        this.fullChain = [];
        if (this.change.type === "splice" || !isNaN(parseInt(this.change.name))) {
            this.fullChain.push(this.change);
        } else {
            // if this.change.name === "length" there will be a corresponding splice
            // otherwise, cannot object observe an array (right now)
        }
    }
    
    array.arrayChangeProperty = {};
    
    array.prototype.go = function(changeHandler) {
        var next = changeHandler.indexOf(this.array, array.arrayChangeProperty);
        var callbacks = this.changeHandler.callbacks[wipeout.change.objectHandler.arrayIndexProperty];
        
        // if there is another change to this array, sync the removedValues and addedValues objects
        if(next !== -1) {
            enumerateArr(changeHandler._changes[next].fullChain, function (x) {
                this.push(x);
            }, this.fullChain);
            changeHandler._changes[next].fullChain = this.fullChain;
        }
        
        //TODO: copyArray. Don't do it yet however, this code is good for catching other bugs
        enumerateArr(callbacks.complexCallbacks, function(item) {
            if (item.firstChange === this.change)
                delete item.firstChange;
            
            if (!item.firstChange)
                item(this.change);
        }, this);
        
        // if this is the last change to this array in the batch, execute the "removed, added" callbacks
        if (next === -1) {
            
            var addedRemoved = this.getAddedAndRemoved();
            var defaultVal = addedRemoved.value(null);
            
            // reset changeHandler.arrayCopy
            this.changeHandler.arrayCopy = wipeout.utils.obj.copyArray(this.array);
            
            var val;
            //TODO: copyArray. Don't do it yet however, this code is good for catching other bugs
            enumerateArr(callbacks.simpleCallbacks, function(item) {
                val = addedRemoved.value(item);
                if (val)
                    delete item.firstChange;
                else
                    val = defaultVal;
                
                if (!item.firstChange)
                    item(val.removedValues, val.addedValues, val.moved);
            }, this);            
        }

        changeHandler._go();
    };
    
    //TODO: can I add merge this with processMovedItems with performance gains?
    array.prototype.getAddedAndRemoved = function () {
                
        var defaultOutput = {
            removedValues: [],
            addedValues: []
        };
        
        var output = new wipeout.utils.dictionary();
        output.add(null, defaultOutput);
        
        var array = wipeout.utils.obj.copyArray(this.array), tmp, tmp2, change;
        
        // add references to any callbacks which were added later
        var specialCallbacks = new wipeout.utils.dictionary();
        enumerateArr(this.changeHandler.callbacks[wipeout.change.objectHandler.arrayIndexProperty].simpleCallbacks, function (callback) {
            if (callback.firstChange) {
                tmp = specialCallbacks.value(callback.firstChange);
                if (!tmp)
                    specialCallbacks.add(callback.firstChange, tmp = []);
                
                tmp.push(callback);
            }
        });
        
        for (var i = this.fullChain.length - 1; i >= 0; i--) {
            change = this.fullChain[i];
            
            if (!isNaN(tmp = parseInt(change.name))) {
                change = {
                    addedCount: 1,
                    index: tmp,
                    removed: [change.oldValue]
                };
            } else if (change.type !== "splice") {
                throw "Can only operate on splices";    //TODO
            }
            
            tmp2 = 0;
            for (var j = 0; j < change.addedCount; j++) {
                if ((tmp = defaultOutput.removedValues.indexOf(array[change.index + j])) !== -1) {
                    defaultOutput.removedValues.splice(tmp, 1);
                } else {
                    defaultOutput.addedValues.splice(tmp2, 0, array[change.index + j]);
                    tmp2++;
                }
            }
                 
            tmp2 = 0;       
            for (var j = 0, jj = change.removed.length; j < jj; j++) {
                if ((tmp = defaultOutput.addedValues.indexOf(change.removed[j])) !== -1) {
                    defaultOutput.addedValues.splice(tmp, 1);
                } else {
                    defaultOutput.removedValues.splice(tmp2, 0, change.removed[j]);
                    tmp2++;
                }
            }
            
            var args = wipeout.utils.obj.copyArray(change.removed);
            args.splice(0, 0, change.index, change.addedCount);
            array.splice.apply(array, args);
            
            // calculate added/removed/moved for any callbacks which were added later
            if (tmp = specialCallbacks.value(this.fullChain[i])) { // do not use "change" variable, it may have changed   
                enumerateArr(tmp, function (val) {
                    output.add(val, {
                        removedValues: wipeout.utils.obj.copyArray(defaultOutput.removedValues),
                        addedValues: wipeout.utils.obj.copyArray(defaultOutput.addedValues),
                        moved: this.processMovedItems(defaultOutput.removedValues, defaultOutput.addedValues, array) // TODO, only if moved is needed
                    });
                }, this);
            }            
        }
        
         //TODO: only if moved is needed
        defaultOutput.moved = this.processMovedItems(defaultOutput.removedValues, defaultOutput.addedValues, array);
        
        return output;
    }
    
    //TODO: unit test
    //TODO: a very complex scenario test
    array.prototype.processMovedItems = function (removedValues, addedValues, oldArray) {
        var tmp, tmp2;
        
        var movedFrom = [],         // an item which was moved
            movedFromIndex = [],    // it's index
            movedTo = [],           // an item which was moved, the items index within this array is the same as the current index in the original array 
            addedIndexes = [],      // indexes of added items. Corresponds to this.added
            removedIndexes = [],    // indexes of removed items. Corresponds to this.removed
            moved = [];             // moved items
                
        // populate addedIndexes and movedTo
        var added = wipeout.utils.obj.copyArray(addedValues);
        enumerateArr(this.array, function(item, i) {
            if (i >= oldArray.length || item !== oldArray[i]) {                
                if ((tmp = added.indexOf(item)) !== -1) {
                    addedIndexes.push({
                        value: item,
                        index: i
                    });
                    added.splice(tmp, 1);
                } else {
                    movedTo[i] = item;
                }              
            }
        });
        
        // populate removedIndexes and movedFrom and movedFromIndexes
        var removed = wipeout.utils.obj.copyArray(removedValues);
        enumerateArr(oldArray, function(item, i) {
            if (i >= this.array.length || item !== this.array[i]) {                
                if ((tmp = removed.indexOf(item)) !== -1) {
                    removedIndexes.push({
                        value: item,
                        index: i
                    });
                    removed.splice(tmp, 1);
                } else {
                    movedFrom.push(item);
                    movedFromIndex.push(i);
                }              
            }
        }, this);
        
        // use movedFrom, movedFromIndexes and movedTo to populate moved 
        var emptyPlaceholder = {};
        while (movedFrom.length) {
            tmp = movedFrom.shift();            
            tmp2 = movedTo.indexOf(tmp);
            movedTo[tmp2] = emptyPlaceholder;   // emptyPlaceholder stops this index from being found again by indexOf
            
            moved.push({
                value: tmp,
                from: movedFromIndex.shift(),
                to: tmp2              
            });
        }
        
        return {
            moved: moved,
            added: addedIndexes,
            removed: removedIndexes
        };
    };
    
    return array;
});