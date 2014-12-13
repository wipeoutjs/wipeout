
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
        } else if (this.change.name === "length") {
            // there will be a corresponding splice
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
        if (next === -1) 
            enumerateArr(this.woBag.watchedArray.simpleCallbacks, function(item) {
                item.callback.call(item.context, this.removedValues, this.addedValues);
            }, this);

        changeHandler._go();
    };
    
    return array;
});