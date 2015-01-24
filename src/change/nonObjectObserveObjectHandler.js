
Class("wipeout.change.nonObjectObserveObjectHandler", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    var nonObjectObserveObjectHandler = wipeout.change.objectHandler.extend(function nonObjectObserveObjectHandler (forObject, usePrototype) {
        
        this._super(forObject);
        
        this.definitions = usePrototype ? Object.getPrototypeOf(forObject) : {}; 
        this.usePrototype = usePrototype;    
        this.pendingOOSubscriptions = [];
    });
    
    nonObjectObserveObjectHandler.prototype.registerChange = function (change) {
        
        enumerateArr(this.pendingOOSubscriptions, function (subscription) {
            subscription.firstChange = change;
        }, this);

        this.pendingOOSubscriptions.length = 0;
        this.oldValues = {};
        
        this._super(change);
    };
    
    function blank(){}
    
    var watchPrefix = "__wo-watch-";  
    nonObjectObserveObjectHandler.prototype._observe = function (property, callback, callbackList, sortCallback) {
        
        this.watch(property);
        
        this.pendingOOSubscriptions.push(callback);        
        callbackList.push(callback);
        sortCallback();        
        
        // cannot cancel
        return blank;
    };
    
    nonObjectObserveObjectHandler.prototype.watch = function (property) {
        
        // do not re-define properties if they exist anywhere else on the property chain
        if (this.definitions[watchPrefix + property])
            return this.definitions[watchPrefix + property];

        if(this.forObject.hasOwnProperty(property)) {
            this.oldValues[property] = this.forObject[property];
            delete this.forObject[property];
        }

        Object.defineProperty(this.usePrototype ? Object.getPrototypeOf(this.forObject) : this.forObject, property, {
            get: (function() {

                return this.oldValues[property];
            }).bind(this),
            set: (function(value) {

                var old = this.oldValues[property];
                this.oldValues[property] = value;

                if(this.callbacks[property])
                    this.registerChange({
                        name: property,
                        object: this.forObject,
                        oldValue: old,
                        type: "update"  //TODO, add?
                    });
            }).bind(this),
            enumerable: true,
            configurable: !usePrototype
        });

        if (this.usePrototype) {
            // modifications to the prototype are permanent
            return this.definitions[watchPrefix + property] = {dispose: function(){}};
        } else {
            return this.definitions[watchPrefix + property] = {
                dispose: (function() {
                    if (delete this.definitions[watchPrefix + property])
                        Object.defineProperty(this.forObject, property, {
                            value: this.forObject[property],
                            writable: true,
                            configurable: true
                        });
                }).bind(this)
            };
        }
    };
    
    nonObjectObserveObjectHandler.prototype.dispose = function() {
        
        this._super();
        
        for (var i in this.definitions) {
            this.definitions.dispose();
            delete this.definitions[i];
        }
    }
    
    return nonObjectObserveObjectHandler;
});