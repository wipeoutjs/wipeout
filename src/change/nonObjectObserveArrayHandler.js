
Class("wipeout.change.nonObjectObserveArrayHandler", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    var nonObjectObserveArrayHandler = wipeout.change.arrayHandler.extend(function nonObjectObserveArrayHandler (forArray) {
        
        this._super(forArray);
        
        this.pendingOOSubscriptions = [];
    });
    
    nonObjectObserveArrayHandler.prototype.registerChange = function (change) {
        
        if (this.pendingOOSubscriptions.length && wipeout.change.arrayHandler.isValidArrayChange(change)) {
            enumerateArr(this.pendingOOSubscriptions, function (subscription) {
                subscription.firstChange = change;
            }, this);
            
            this.pendingOOSubscriptions.length = 0;
        }
        
        this._super(change);
    };
    
    function blank(){}
    
    nonObjectObserveArrayHandler.prototype._observe = function (callback, callbackList) {
        
        this.pendingOOSubscriptions.push(callback);        
        callbackList.push(callback);
        
        // cannot cancel
        return blank;
    };
    
    return nonObjectObserveArrayHandler;
});