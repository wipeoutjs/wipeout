
Class("wipeout.change.object", function () {
    
    function object(object, property, oldVal, newVal, woBag, originalVal) {
        this.object = object;
        this.property = property;
        this.oldVal = oldVal;
        this.newVal = newVal;
        this.woBag = woBag;
        this.originalVal = originalVal;
    }
    
    object.prototype.go = function(changeHandler) {
        var next = changeHandler.lastIndexOf(this.object, this.property);
        if(next !== -1)
            changeHandler._changes[next].originalVal = this.originalVal || this.oldVal;

        enumerateArr(this.woBag.watched.callbacks[this.property], function(callback) {
            if (callback.evaluateOnEachChange)
                callback(this.oldVal, this.newVal);
            else if (next === -1)
                callback(this.originalVal || this.oldVal, this.newVal);
        }, this);

        changeHandler._go();
    };
    
    return object;
});