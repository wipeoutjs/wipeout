
Class("wipeout.change.arrayHandler", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    function arrayHandler (forArray) {
        if (!(forArray instanceof wipeout.base.array))
            throw "Invalid array";
                
        this.forArray = forArray;
        this.simpleCallbacks = [];    // function (removed, added) { }
        this.complexCallbacks = [];   // function (change) { }
        this.arrayCopy = wipeout.utils.obj.copyArray(array);
        
        if (useObjectObserve) {
            this.registeredChanges = [];
            this.extraCallbacks = 0;
            
            Array.observe(this, (function(changes) {
                if (this.extraCallbacks) return;
                this.registeredChanges.length = 0;
                                
                enumerateArr(changes, function(change) {
                    if (arrayHandler.isValidArrayChange(change))
                        this.registerChange(forArray, change, forArray.__woBag);
                }, this)
            }).bind(this));
        } else {
            this.pendingOOSubscriptions = [];
        }
    };
    
    arrayHandler.isValidArrayChange = function (change) {
        return change.type === "splice" || (change.type === "update" && !isNaN(parseInt(change.name)));
    };
    
    arrayHandler.prototype.registerChange = function (change) {
        
        if (this.pendingOOSubscriptions && this.pendingOOSubscriptions.length && arrayHandler.isValidArrayChange(change)) {
            enumerateArr(this.pendingOOSubscriptions, function (subscription) {
                subscription.firstChange = change;
            }, this);
            
            this.pendingOOSubscriptions.length = 0;
        }

        wipeout.change.handler.instance.pushArray(this.forArray, change, this.forArray.__woBag);
    };
    
    arrayHandler.prototype.observeWithObjectObserve = function (callback, context, complexCallback /*TODO*/) {
        
        var callbacks = complexCallback ? 
            this.complexCallbacks : 
            this.simpleCallbacks;
        
        //TODO, polyfill bind
        var cb = callback.bind(context || this);
        
        var forArray = this.forArray, _this = this, tempSubscription = function (changes) {
            Array.unobserve(forArray, tempSubscription);
            _this.extraCallbacks--;
            
            // has been disposed of, do nothing
            if (!d) return;
            
            callbacks.push(cb);
            
            enumerateArr(changes, function(change) {
                if (!arrayHandler.isValidArrayChange(change)) return;                                
                
                if (!cb.firstChange)
                    cb.firstChange = change;
                
                // record change so that another subscription will not act on it
                if (_this.registeredChanges.indexOf(change) !== -1) return;
                _this.registeredChanges.push(change);
                
                _this.registerChange(change);
            });
        };
            
        Array.observe(this.forArray, tempSubscription);        
        this.extraCallbacks++;
        
        var d = {
            dispose: function () {
                if(!d) return;
                
                d = undefined;
                
                var i = callbacks.indexOf(cb);
                if (i !== -1)
                    callbacks.splice(i, 1);
            }
        };
        
        return d;
    };
    
    arrayHandler.prototype.observeNoObjectObserve = function (callback, context, complexCallback /*TODO*/) {
                
        var callbacks = complexCallback ? 
            this.complexCallbacks : 
            this.simpleCallbacks;
        
        //TODO, polyfill bind
        var cb = callback.bind(context || this);
        
        this.pendingOOSubscriptions.push(cb);
        
        callbacks.push(cb);
        
        var d = {
            dispose: function () {
                if(!d) return;
                
                d = undefined;
                
                var i = callbacks.indexOf(cb);
                if (i !== -1)
                    callbacks.splice(i, 1);
            }
        };
        
        return d;
    };
    
    arrayHandler.prototype.observe = function (callback, context, complexCallback /*TODO*/) {
        if (useObjectObserve)
            return this.observeWithObjectObserve.apply(this, arguments);
        else
            return this.observeNoObjectObserve.apply(this, arguments);
    };
    
    return arrayHandler;
});