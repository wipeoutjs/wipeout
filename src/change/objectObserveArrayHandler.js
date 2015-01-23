
Class("wipeout.change.objectObserveArrayHandler", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    var objectObserveArrayHandler = wipeout.change.arrayHandler.extend(function objectObserveArrayHandler (forArray) {
        
        this._super(forArray);
        
        this.registeredChanges = [];
        this.extraCallbacks = 0;

        this.__subscription = (function(changes) {
            if (this.extraCallbacks) return;
            this.registeredChanges.length = 0;

            enumerateArr(changes, function(change) {
                if (wipeout.change.arrayHandler.isValidArrayChange(change))
                    this.registerChange(change);
            }, this)
        }).bind(this);
        
        Array.observe(forArray, this.__subscription);
    });
    
    objectObserveArrayHandler.prototype.registerChange = function (change) {
        
        if (this.pendingOOSubscriptions && this.pendingOOSubscriptions.length && wipeout.change.arrayHandler.isValidArrayChange(change)) {
            enumerateArr(this.pendingOOSubscriptions, function (subscription) {
                subscription.firstChange = change;
            }, this);
            
            this.pendingOOSubscriptions.length = 0;
        }

        wipeout.change.handler.instance.pushArray(this.forArray, change, this.forArray.__woBag);
    };
    
    objectObserveArrayHandler.prototype._observe = function (callback, callbackList) {
        
        var forArray = this.forArray, _this = this, tempSubscription = function (changes) {
            
            Array.unobserve(forArray, tempSubscription);
            _this.extraCallbacks--;
            
            // has been disposed of, do nothing
            if (!_this) return;
            
            callbackList.push(callback);
            
            enumerateArr(changes, function(change) {
                if (!wipeout.change.arrayHandler.isValidArrayChange(change)) return;                                
                
                if (!callback.firstChange)
                    callback.firstChange = change;
                
                // record change so that another subscription will not act on it
                if (_this.registeredChanges.indexOf(change) !== -1) return;
                _this.registeredChanges.push(change);
                
                _this.registerChange(change);
            });
        };
            
        Array.observe(this.forArray, tempSubscription);        
        this.extraCallbacks++;
        
        return function () {
            // using _this as a flag
            _this = null;
        };
    };
    
    objectObserveArrayHandler.prototype.dispose = function() {
        
        this._super();
        
        if (this.__subscription) {
            Array.unobserve(this.forArray, this.__subscription);
            delete this.__subscription;
        }
    }
    
    return objectObserveArrayHandler;
});