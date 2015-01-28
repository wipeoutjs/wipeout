
Class("wipeout.change.object", function () {
    
    function object(change, objectHandler) {
        this.change = change;
        this.objectHandler = objectHandler;
        
        this.oldVal = change.oldValue;
        this.originalVal = this.oldVal;
        this.newVal = change.object[change.name];
    }
    
    object.prototype.go = function(changeHandler) {
        
        var next = changeHandler.lastIndexOf(this.change.object, this.change.name);
        if(next !== -1)
            changeHandler._changes[next].originalVal = this.originalVal || this.oldVal;

        if (this.objectHandler.callbacks[this.change.name]) {
            enumerateArr(this.objectHandler.callbacks[this.change.name].slice(), function(callback) {
                
                var shouldDispose = callback.changeValidator.shouldDispose(this.change);
                try {
                    if (!callback.changeValidator.isValid(this))
                        return;

                    if (callback.evaluateOnEachChange) {
                        if (!shouldDispose)
                            callback(this.oldVal, this.newVal);
                    } else {
                        var originalVal = callback.changeValidator.originalValue(this.originalVal) || this.oldVal;
                        
                        if (shouldDispose)
                            callback(originalVal, this.oldVal);
                        else if (next === -1)
                            callback(originalVal, this.newVal);
                    }
                } finally {
                    if (shouldDispose)
                        callback.changeValidator.dispose();
                }
            }, this);
        }
        
        changeHandler._go();
    };
    
    return object;
});