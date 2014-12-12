
Class("wipeout.utils.changeHandler", function () {
    function changeHandler() {
        this._properties = [];
        this._changes = [];        
        this._objects = [];
    };
    
    changeHandler.allIndexesOf = function(array, item) {
        var current = -1, returnVal = [];
        
        while (true) {
            current = array.indexOf(item, current + 1);
            if(current === -1)
                return returnVal;
            
            returnVal.push(current);
        }
    };
    
    changeHandler.prototype.lastIndexOf = function(object, propertyName) {
        
        var objects = changeHandler.allIndexesOf(this._objects, object);
        
        for (var i = objects.length - 1; i >= 0; i--)
            if (this._properties[objects[i]] === propertyName)
                return objects[i];
        
        return -1;
    };
    
    changeHandler.prototype.push = function(object, property, woBag, oldVal, newVal) {
        this._objects.push(object);
        this._properties.push(property);
        this._changes.push({
            oldVal: oldVal, 
            newVal: newVal,
            woBag: woBag
        });
        
        setTimeout((function() {
            this.go();
        }).bind(this));
    };
    
    changeHandler.prototype.shift = function() {        
        if (!this._properties.length) {
            this._changes.length = 0;
            return;
        }
        
        var changes = this._changes.shift(); 
        return new objectChangeHandler(
            this._objects.shift(),
            this._properties.shift(),
            changes.oldVal,
            changes.newVal,
            changes.woBag,
            changes.originalVal);
    };
    
    changeHandler.prototype.go = function() {
        if (this.__going) return;
        this.__going = true;
        this._go();
    };
    
    changeHandler.prototype._go = function() {

        var change = this.shift();
        if (!change) {            
            delete this.__going;
            return;
        }

        setTimeout((function() {
            change.go(this);
        }).bind(this));
    };
    
    changeHandler.instance = new changeHandler(); 
    
    function objectChangeHandler(object, property, oldVal, newVal, woBag, originalVal) {
        this.object = object;
        this.property = property;
        this.oldVal = oldVal;
        this.newVal = newVal;
        this.woBag = woBag;
        this.originalVal = originalVal;
    }
    
    objectChangeHandler.prototype.go = function(changeHandler) {
        var next = this.lastIndexOf(this.object, this.property);
        if(next !== -1)
            changeHandler._changes[next].originalVal = this.originalVal || this.oldVal;

        enumerateArr(this.woBag.watched.callbacks[this.property], function(callback) {
            if (callback.evaluateOnEachChange)
                callback(this.oldVal, this.newVal);
            else if (next === -1)
                callback(this.originalVal || this.oldVal, this.newVal);
        });

        changeHandler._go();
    };
    
    return changeHandler;
});