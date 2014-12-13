
Class("wipeout.change.handler", function () {
    function handler() {
        this._properties = [];
        this._changes = [];        
        this._objects = [];
    };
    
    handler.allIndexesOf = function(array, item) {
        var current = -1, returnVal = [];
        
        while (true) {
            current = array.indexOf(item, current + 1);
            if(current === -1)
                return returnVal;
            
            returnVal.push(current);
        }
    };
    
    handler.prototype.indexOf = function(object, propertyName) {
        
        var objects = handler.allIndexesOf(this._objects, object);
        
        for (var i = 0, ii = objects.length; i < ii; i++)
            if (this._properties[objects[i]] === propertyName)
                return objects[i];
        
        return -1;
    };
    
    handler.prototype.lastIndexOf = function(object, propertyName) {
        
        var objects = handler.allIndexesOf(this._objects, object);
        
        for (var i = objects.length - 1; i >= 0; i--)
            if (this._properties[objects[i]] === propertyName)
                return objects[i];
        
        return -1;
    };
    
    handler.prototype.pushObj = function(object, property, woBag, oldVal, newVal) {
        this._objects.push(object);
        this._properties.push(property);
        this._changes.push(new objectChangeHandler(object, property, oldVal, newVal, woBag));
        
        setTimeout((function() {
            this.go();
        }).bind(this));
    };
    
    var arrayChangeProperty = {};
    handler.prototype.pushArray = function(array, change, woBag) {
        this._objects.push(array);
        this._properties.push(arrayChangeProperty);
        this._changes.push(new arrayChangeHandler(array, change, woBag));
        
        setTimeout((function() {
            this.go();
        }).bind(this));
    };
    
    function arrayChangeHandler(array, change, woBag) {
        this.array = array;
        this.change = change;
        this.woBag = woBag;
        
        this.addedValues = [];
        this.removedValues = [];
    }
    
    arrayChangeHandler.prototype.go = function(changeHandler) {
        
        var next = changeHandler.indexOf(this.array, arrayChangeProperty);
        
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
        
        enumerateArr(this.woBag.complexCallbacks, function(item) {
            item.callback.call(item.context, this.change);
        }, this);
        
        // if this is the last change to this array in the batch, execute the "removed, added" callbacks
        if (next === -1) 
            enumerateArr(this.woBag.simpleCallbacks, function(item) {
                item.callback.call(item.context, this.removedValues, this.addedValues);
            }, this);

        changeHandler._go();
    };
    
    handler.prototype.shift = function() {        
        if (!this._properties.length) {
            this._changes.length = 0;
            return;
        }
        
        this._properties.shift();
        this._objects.shift();        
        return this._changes.shift();
    };
    
    handler.prototype.go = function() {
        if (this.__going) return;
        this.__going = true;
        this._go();
    };
    
    handler.prototype._go = function() {

        var change = this.shift();
        if (!change) {            
            delete this.__going;
            return;
        }

        setTimeout((function() {
            change.go(this);
        }).bind(this));
    };
    
    handler.instance = new handler(); 
    
    function objectChangeHandler(object, property, oldVal, newVal, woBag, originalVal) {
        this.object = object;
        this.property = property;
        this.oldVal = oldVal;
        this.newVal = newVal;
        this.woBag = woBag;
        this.originalVal = originalVal;
    }
    
    objectChangeHandler.prototype.go = function(changeHandler) {
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
    
    return handler;
});