
Class("wipeout.change.handler", function () {
    function handler() {
        this._properties = [];
        this._changes = [];        
        this._objects = [];
        
        this.preObserveCycles = [];
        this.apreObserveCycles = [];
    };
    
    //TODO: test
    handler.prototype.beforeObserveCycle = function(callback) {
        
        this.preObserveCycles.push(callback);
        
        return new wipeout.base.disposable((function () {
            var i;
            if ((i = this.preObserveCycles.indexOf(callback)) !== -1)
                this.preObserveCycles.splice(i, 1);
        }).bind(this));
    };
    
    //TODO: test
    handler.prototype.afterObserveCycle = function(callback) {
        
        this.apreObserveCycles.push(callback);
        
        return new wipeout.base.disposable((function () {
            var i;
            if ((i = this.apreObserveCycles.indexOf(callback)) !== -1)
                this.apreObserveCycles.splice(i, 1);
        }).bind(this));
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
    
    handler.prototype.pushObj = function(change, objectHandler) {
                
        var i = this.lastIndexOf(change.object, change.name);
        if(i !== -1)
            this._changes[i].newVal = change.oldValue; //TODO, investigate and comment
        
        this._objects.push(change.object);
        this._properties.push(change.name);
        this._changes.push(new wipeout.change.object(change, objectHandler));
        
        setTimeout(this.go.bind(this));
    };
    
    handler.prototype.pushArray = function(array, change, arrayHandler) {
        this._objects.push(array);
        this._properties.push(wipeout.change.array.arrayChangeProperty);
        this._changes.push(new wipeout.change.array(array, change, arrayHandler));
        
        setTimeout(this.go.bind(this));
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
        
        enumerateArr(wipeout.utils.obj.copyArray(this.preObserveCycles), function (x) {
            x();
        });
        
        this.__going = true;
        this._go();
    };
    
    handler.prototype._go = function() {

        var change = this.shift();
        if (!change) {
            delete this.__going;
                    
            enumerateArr(wipeout.utils.obj.copyArray(this.apreObserveCycles), function (x) {
                x();
            });
            
            return;
        }

        setTimeout((function() {
            window.ch = window.ch ||[];
            ch.push(change.change);
            change.go(this);
        }).bind(this));
    };
    
    handler.instance = new handler(); 
    
    return handler;
});