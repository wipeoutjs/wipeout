
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
        this._changes.push(new wipeout.change.object(object, property, oldVal, newVal, woBag));
        
        setTimeout((function() {
            this.go();
        }).bind(this));
    };
    
    handler.prototype.pushArray = function(array, change, woBag) {
        this._objects.push(array);
        this._properties.push(wipeout.change.array.arrayChangeProperty);
        this._changes.push(new wipeout.change.array(array, change, woBag));
        
        setTimeout((function() {
            this.go();
        }).bind(this));
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
    
    return handler;
});