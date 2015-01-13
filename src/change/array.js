
Class("wipeout.change.array", function () {
        
    function array(array, change, woBag) {
        this.array = array;
        this.change = change;
        this.woBag = woBag;
        
        this.addedValues = [];
        this.removedValues = [];
    }
    
    array.arrayChangeProperty = {};
    
    array.prototype.go = function(changeHandler) {
        var next = changeHandler.indexOf(this.array, array.arrayChangeProperty);
        
        // if there is another change to this array, sync the removedValues and addedValues objects
        if(next !== -1) {
            changeHandler._changes[next].removedValues = this.removedValues;
            changeHandler._changes[next].addedValues = this.addedValues;
        }
        
        var tmp, ch;
        if (this.change.type === "splice") {
            ch = this.change;
        } else if (!isNaN(tmp = parseInt(this.change.name))) {
            ch = {
                addedCount: 1,
                index: parseInt(this.change.name),
                removed: [this.change.oldValue]
            };
        } else {
            // if this.change.name === "length" there will be a corresponding splice
            // otherwise, cannot object observe an array (right now)
            changeHandler._go();
            return;           
        }

        // splice added
        if (ch.addedCount) {
            for (var i = ch.index, ii = ch.addedCount + ch.index; i < ii; i++) {
                if ((tmp = this.removedValues.indexOf(this.array[i])) !== -1)
                    this.removedValues.splice(tmp, 1);
                else
                    this.addedValues.push(this.array[i]);
            }
        }

        // splice removed
        for (var i = 0, ii = ch.removed.length; i < ii; i++) {
            if ((tmp = this.addedValues.indexOf(ch.removed[i])) !== -1)
                this.addedValues.splice(i, 1);
            else
                this.removedValues.push(ch.removed[i]);
        }
        
        enumerateArr(this.woBag.watchedArray.complexCallbacks, function(item) {
            item.callback.call(item.context, this.change);
        }, this);
        
        // if this is the last change to this array in the batch, execute the "removed, added" callbacks
        if (next === -1) {
            
            var moved = this.processMovedItems(); //TODO: only if moved is needed
            
            enumerateArr(this.woBag.watchedArray.simpleCallbacks, function(item) {
                item.callback.call(item.context, this.removedValues, this.addedValues, moved);
            }, this);
        }

        changeHandler._go();
    };
    
    //TODO: unit test
    //TODO: a very complex scenario test
    array.prototype.processMovedItems = function() {
        var tmp, tmp2, oldArray = this.woBag.watchedArray.arrayCopy;
        
        var movedFrom = [],         // an item which was moved
            movedFromIndex = [],    // it's index
            movedTo = [],           // an item which was moved, the items index within this array is the same as the current index in the original array 
            addedIndexes = [],      // indexes of added items. Corresponds to this.added
            removedIndexes = [],    // indexes of removed items. Corresponds to this.removed
            moved = [];             // moved items
        
        // reset woBag.watchedArray.arrayCopy
        this.woBag.watchedArray.arrayCopy = wipeout.utils.obj.copyArray(this.array);
        
        // populate addedIndexes and movedTo
        var added = wipeout.utils.obj.copyArray(this.addedValues);
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
        var removed = wipeout.utils.obj.copyArray(this.removedValues);
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