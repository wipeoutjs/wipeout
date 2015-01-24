
Class("wipeout.change.objectObserveObjectHandler", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    var objectObserveObjectHandler = wipeout.change.objectHandler.extend(function objectObserveObjectHandler (forObject) {
        
        this._super(forObject);
        
        this.registeredChanges = [];
        this.extraCallbacks = 0;

        this.__subscription = (function(changes) {
            if (this.extraCallbacks) return;
            this.registeredChanges.length = 0;

            enumerateArr(changes, function(change) {
                this.registerChange(change);
            }, this)
        }).bind(this);
        
        Object.observe(forObject, this.__subscription);
    });
    
    objectObserveObjectHandler.prototype._observe = function (property, callback, callbackList, sortCallback) {
        
        var _this = this, tempSubscription = function (changes) {
            
            Object.unobserve(_this.forObject, tempSubscription);
            _this.extraCallbacks--;
            
            // has been disposed of, do nothing
            if (!_this) return;
            
            callbackList.push(callback);
            sortCallback();
            
            enumerateArr(changes, function(change) {                
                if (!callback.firstChange && change.name === property)
                    callback.firstChange = change;
                
                // record change so that another subscription will not act on it
                if (_this.registeredChanges.indexOf(change) !== -1) return;
                _this.registeredChanges.push(change);
                
                _this.registerChange(change);
            });
        };
            
        Object.observe(this.forObject, tempSubscription);        
        this.extraCallbacks++;
        
        return function () {
            // using _this as a flag
            _this = null;
        };
    };
    
    objectObserveObjectHandler.prototype.dispose = function() {
        
        this._super();
        
        if (this.__subscription) {
            Object.unobserve(this.forObject, this.__subscription);
            delete this.__subscription;
        }
    }
    
    return objectObserveObjectHandler;
});