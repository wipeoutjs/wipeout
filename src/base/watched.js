// name is subject to change

Class("wipeout.base.watched", function () {
    
    var watched = wipeout.base.disposable.extend(function watched() {
        ///<summary>An object whose properties can be subscribed to</summary>
        
        this._super();
        
        this.registerDisposable(this.__woBag.watched = useObjectObserve ? 
            new wipeout.change.objectObserveObjectHandler(this) :
            new wipeout.change.nonObjectObserveObjectHandler(this, true));
    });
    
    var useObjectObserve = watched.useObjectObserve = Object.observe && wipeout.settings.useObjectObserve;
    
    watched.createObserveFunction = function (objectHandler) {
        return function (property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged) {
            
            var oh = objectHandler || this.__woBag.watched;
            return oh.observeObject.apply(oh, arguments);
        };
    };
    
    watched.createObserveArrayFunction = function (objectHandler) {
        
        return function (property, callback, context, complexCallback) {
            
            var oh = objectHandler || this.__woBag.watched;
            return oh.observeArray.apply(oh, arguments);
        }
    };
    
    watched.createComputedFunction = function (objectHandler) {
        return function(name, callback, watchVariables, callbackStringOverride) {
            ///<summary>Do "delete obj.prop" functionality</summary>
            ///<param name="property" type="String" optional="false">The property name</param>
            ///<returns type="Boolean">The result of the delete</returns>

            //TODO: disposal
            var comp = new wipeout.base.computed(callback, this, watchVariables, callbackStringOverride);
            comp.bind(this, name);
            (objectHandler || this.__woBag.watched).registerDisposable(comp);

            return comp;
        };
    };
    
    watched.prototype.observe = watched.createObserveFunction();
    watched.prototype.observeArray = watched.createObserveArrayFunction();
    watched.prototype.computed = watched.createComputedFunction();
    
    watched.prototype.del = function(property) {
        ///<summary>Do "delete obj.prop" functionality</summary>
        ///<param name="property" type="String" optional="false">The property name</param>
        ///<returns type="Boolean">The result of the delete</returns>
        
        if (!useObjectObserve)
            this[property] = undefined;
        
        return delete this[property];
    };
    
    watched.beforeObserveCycle = function(callback) {
        return wipeout.change.handler.instance.beforeObserveCycle(callback);
    };
    
    watched.afterObserveCycle = function(callback) {
        return wipeout.change.handler.instance.afterObserveCycle(callback);
    };
    
    watched.beforeNextObserveCycle = function(callback) {
        var dispose = wipeout.change.handler.instance.beforeObserveCycle(function () {
            dispose.dispose();
            callback();
        });
    };
    
    watched.afterNextObserveCycle = function(callback, waitForNextCycle) {
        
        if (!wipeout.change.handler.instance.__going && !waitForNextCycle) {
            setTimeout(callback);
        } else {        
            var dispose = wipeout.change.handler.instance.afterObserveCycle(function() {
                dispose.dispose();
                callback()
            });
        }
    };
                                      
    return watched;
});
