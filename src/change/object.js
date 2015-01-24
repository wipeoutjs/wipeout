
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

        enumerateArr(this.objectHandler.callbacks[this.change.name], function(callback) {
            if (callback.firstChange === this.change)
                delete callback.firstChange;
            else if (callback.firstChange)
                return;
            
            if (callback.evaluateOnEachChange)
                callback(this.oldVal, this.newVal);
            else if (next === -1)
                callback(this.originalVal || this.oldVal, this.newVal);
        }, this);

        changeHandler._go();
    };
    
    return object;
});