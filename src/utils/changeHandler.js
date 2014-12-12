
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
        return {
            object: this._objects.shift(),
            property: this._properties.shift(),
            oldVal: changes.oldVal,
            newVal: changes.newVal,
            woBag: changes.woBag,
            originalVal: changes.originalVal
        };
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
            var next = this.lastIndexOf(change.object, change.property);
            if(next !== -1)
                this._changes[next].originalVal = change.originalVal || change.oldVal;

            enumerateArr(change.woBag.watched.callbacks[change.property], function(callback) {
                if (callback.evaluateOnEachChange)
                    callback(change.oldVal, change.newVal);
                else if (next === -1)
                    callback(change.originalVal || change.oldVal, change.newVal);
            });

            this._go();
        }).bind(this));
    };
    
    changeHandler.instance = new changeHandler();    
    
    return changeHandler;
});