
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
            new wipeout.change.arrayChangeCompiler(this.fullChain, this.array, callbacks.simpleCallbacks).execute();
        }

        changeHandler._go();
    };
    
    return array;
});