
Class("wipeout.change.arrayChangeCompiler", function () {
    
    function changedValues (finalArrayOrBasedOn) {
        
        this.removedValues = [];
        this.addedValues = [];
        
        if(finalArrayOrBasedOn instanceof changedValues) {
            enumerateArr(finalArrayOrBasedOn.removedValues, function (val) {
                this.removedValues.push(val);
            }, this);
            
            enumerateArr(finalArrayOrBasedOn.addedValues, function (val) {
                this.addedValues.push(val);
            }, this);
            
            this.finalArray = finalArrayOrBasedOn.finalArray;
        } else {            
            this.finalArray = wipeout.utils.obj.copyArray(finalArrayOrBasedOn);
        }
    }
    
    //TODO: unit test
    //TODO: a very complex scenario test
    changedValues.prototype.finalizeXXX = function (oldArray) {
        if (this.moved)
            return;
        
        var tmp, tmp2;
        
        var movedFrom = [],         // an item which was moved
            movedFromIndex = [],    // it's index
            movedTo = [],           // an item which was moved, the items index within this array is the same as the current index in the original array 
            addedIndexes = [],      // indexes of added items. Corresponds to this.added
            removedIndexes = [],    // indexes of removed items. Corresponds to this.removed
            moved = [];             // moved items
                
        // populate addedIndexes and movedTo
        var added = wipeout.utils.obj.copyArray(this.addedValues);
        enumerateArr(this.finalArray, function(item, i) {
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
            if (i >= this.finalArray.length || item !== this.finalArray[i]) {                
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
        
        this.moved = {
            moved: moved,
            added: addedIndexes,
            removed: removedIndexes
        };
    };
    
    var callbackDictionary = wipeout.utils.dictionary.extend(function callbackDictionary (keys, defaultValue) {
        this._super();
        
        this.activeValues = [];
        this.unInitializedCallbacks = [];
        
        enumerateArr(keys, function(key) {
            this.add(key, defaultValue);
        }, this);
    });
    
    callbackDictionary.prototype.add = function (key, value) {
        this._super(key, value);
        
        if (this.activeValues.indexOf(value) === -1)
            this.activeValues.push(value);
        
        if (!key.changeValidator.isValid())
            this.unInitializedCallbacks.push(key);
    };
    
    callbackDictionary.prototype.finalize = function (array) {
        
        for (var i = this.__keyArray.length - 1; i >= 0; i--) {
            if (this.unInitializedCallbacks.indexOf(this.__keyArray[i]) !== -1)
                this.remove(this.__keyArray[i]);
            else                
                // TODO: only if needed
                this.__valueArray[i].finalizeXXX(array);            
        }
        
        this.unInitializedCallbacks.length = 0;
    };
    
    callbackDictionary.prototype.removeActiveValue = function (value) {        
        var tmp
        if ((tmp = this.activeValues.indexOf(value)) !== -1)
            this.activeValues.splice(tmp, 1);
        else
            throw "test"    //TODO: remove else condition
    };
    
    callbackDictionary.prototype.addItem = function (item) {
        var tmp;
        enumerateArr(this.activeValues, function(values) {
            if ((tmp = values.removedValues.indexOf(item)) !== -1)
                values.removedValues.splice(tmp, 1);
            else
                values.addedValues.push(item);
        }, this);
    };
    
    callbackDictionary.prototype.removeItem = function (item) {
        var tmp;
        enumerateArr(this.activeValues, function(values) {
            if ((tmp = values.addedValues.indexOf(item)) !== -1)
                values.addedValues.splice(tmp, 1);
            else
                values.removedValues.push(item);
        }, this);
    };
    
    callbackDictionary.prototype.execute = function () {
        if (this.__executed)
            return;
        
        this.__executed = true;
        
        for (var i = 0, ii = this.__keyArray.length; i < ii; i++) {
            this.__keyArray[i](this.__valueArray[i].removedValues, this.__valueArray[i].addedValues, this.__valueArray[i].moved);
        }
    };
    
    function arrayChangeCompiler(changes, array, callbacks) {
        
        if (!changes.length || !callbacks.length) {
            this.__executed = true;
            return;
        }            
        
        this.changes = changes;
        this.array = wipeout.utils.obj.copyArray(array);
        this.__callbacks = new callbackDictionary(callbacks, new changedValues(this.array));
        
        this.process();
    }
    
    arrayChangeCompiler.prototype.execute = function () {        
        this.__callbacks.execute();
    };
    
    //TODO: can I add merge this with processMovedItems with performance gains?
    arrayChangeCompiler.prototype.process = function () {
        
        var tmp, tmp2, change;
        for (var i = this.changes.length - 1; i >= 0; i--) {
            change = this.changes[i];
            
            if (!isNaN(tmp = parseInt(change.name))) {
                change = {
                    addedCount: 1,
                    index: tmp,
                    removed: [change.oldValue]
                };
            } else if (change.type !== "splice") {
                throw "Can only operate on splices";    //TODO
            }
            
            for (var j = 0; j < change.addedCount; j++)
                this.__callbacks.addItem(this.array[change.index + j]);
                 
            for (var j = 0, jj = change.removed.length; j < jj; j++)
                this.__callbacks.removeItem(change.removed[j]);
            
            var args = wipeout.utils.obj.copyArray(change.removed);
            args.splice(0, 0, change.index, change.addedCount);
            this.array.splice.apply(this.array, args);
            
            // reset change
            change = this.changes[i];
            
            enumerateArr(this.__callbacks.keys_unsafe(), function (callback) {                
                if (callback.changeValidator.shouldDispose(change)) {
                    this.__callbacks.add(callback, new changedValues(this.array));
                    callback.changeValidator.dispose();
                }
                
                if ((tmp = this.__callbacks.unInitializedCallbacks.indexOf(callback)) !== -1) {
                    if (callback.changeValidator.isValid({change:change})) {
                        this.__callbacks.unInitializedCallbacks.splice(tmp, 1);
                        tmp = new changedValues(this.__callbacks.value(callback));
                        this.__callbacks.add(callback, tmp);
                        
                        //TODO: only if needed
                        tmp.finalizeXXX(this.array);
                        this.__callbacks.removeActiveValue(tmp);
                    }
                }
            }, this);
        }
        
        this.__callbacks.finalize(this.array);
    };
    
    return arrayChangeCompiler;    
});