
Class("wipeout.change.nonObjectObserveObjectHandler", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    var nonObjectObserveObjectHandler = wipeout.change.objectHandler.extend(function nonObjectObserveObjectHandler (forObject, usePrototypeAndWoBag) {
        
        this._super(forObject);
        
        this.oldValues = {};
        this.definitionDisposals = usePrototypeAndWoBag ? Object.getPrototypeOf(forObject) : {}; 
        this.usePrototypeAndWoBag = usePrototypeAndWoBag;    
        this.pendingOOSubscriptions = [];
        
        // length is auto watched
        if (forObject instanceof wipeout.base.array)
            this.definitionDisposals[watchPrefix + "length"] = new wipeout.base.disposable;
    });
    
    nonObjectObserveObjectHandler.prototype.registerChange = function (change) {
        
        for (var i = this.pendingOOSubscriptions.length - 1; i >= 0; i--)
            if (change.name === this.pendingOOSubscriptions[i].property || 
                (this.pendingOOSubscriptions[i].property === wipeout.change.objectHandler.arrayIndexProperty && this.isValidArrayChange(change)))
                this.pendingOOSubscriptions.splice(i, 1)[0].firstChange = change;

        this._super(change);
    };
    
    function blank(){}
    
    var watchPrefix = "__wo-watch-";  
    nonObjectObserveObjectHandler.prototype._observe = function (property, callback, callbackList, sortCallback) {
        
        if (property !== wipeout.change.objectHandler.arrayIndexProperty)
            this.watch(property);
        
        callback.firstChange = true;
        this.pendingOOSubscriptions.push(callback);        
        callbackList.push(callback);
        sortCallback();        
        
        // cannot cancel
        return blank;
    };
    
    nonObjectObserveObjectHandler.prototype.watch = function (property) {
        
        // do not re-define properties
        if (this.definitionDisposals[watchPrefix + property])
            return this.definitionDisposals[watchPrefix + property];

        if(this.forObject.hasOwnProperty(property)) {
            this.oldValues[property] = this.forObject[property];
            delete this.forObject[property];
        }

        var getHandler = (function (forObject) {
            if (!this.usePrototypeAndWoBag)
                return this;
            
            if (forObject.__woBag)
                return forObject.__woBag.watched;
        
            return undefined;
        }).bind(this);
        
        Object.defineProperty(this.usePrototypeAndWoBag ? Object.getPrototypeOf(this.forObject) : this.forObject, property, {
            get: function() {   //TODO: make this method static

                var handler = getHandler(this);
                return handler ? handler.oldValues[property] : undefined;
            },
            set: function (value) { //TODO: make this method static
                var _this = getHandler(this);
                if (!_this) //TODO
                    throw "Invalid object. The object has not been constructoed correctly";
                    
                var old = _this.oldValues[property];
                _this.oldValues[property] = value;
                
                if(_this.callbacks[property])
                    _this.registerChange({
                        name: property,
                        object: this,
                        oldValue: old,
                        type: "update"  //TODO, add?
                    });
            },
            enumerable: true,
            configurable: !this.usePrototypeAndWoBag
        });

        if (this.usePrototypeAndWoBag) {
            // modifications to the prototype are permanent
            return this.definitionDisposals[watchPrefix + property] = new wipeout.base.disposable;
        } else {
            return this.definitionDisposals[watchPrefix + property] = new wipeout.base.disposable((function() {
                if (delete this.definitionDisposals[watchPrefix + property])
                    Object.defineProperty(this.forObject, property, {
                        value: this.forObject[property],
                        writable: true,
                        configurable: true
                    });
            }).bind(this));
        }
    };
    
    nonObjectObserveObjectHandler.prototype.dispose = function() {
        
        this._super();
        
        if (!this.usePrototypeAndWoBag)
            for (var i in this.definitionDisposals)
                this.definitionDisposals[i].dispose();
            
        this.pendingOOSubscriptions.length = 0;
    }
    
    return nonObjectObserveObjectHandler;
});