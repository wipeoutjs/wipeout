// name is subject to change

Class("wipeout.base.watched", function () {
    
    var watched = wipeout.base.object.extend(function watched() {
        ///<summary>An object whose properties can be subscribed to</summary>
        
        this._super();
                    
        this.__woBag = {
            watched: useObjectObserve ? 
                new wipeout.change.objectObserveObjectHandler(this) :
                new wipeout.change.nonObjectObserveObjectHandler(this, true)
        };
    });
    
    var useObjectObserve = watched.useObjectObserve = Object.observe && wipeout.settings.useObjectObserve;
    
    watched.createObserveFunction = function (objectHandler) {
        return function (property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged) {
            
            var oh = objectHandler || this.__woBag.watched;
            if (property.indexOf(".") !== -1)
                return new wipeout.base.pathWatch(this, property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged);

            return oh.observeObject.apply(oh, arguments);
        };
    };
    
    watched.prototype.observe = watched.createObserveFunction();
    
    watched.prototype.observeArray = function (property, callback, context, complexCallback) {
        var disposeOfArray;
        var dispose = this.observe(property, function(oldVal, newVal) {
            if (disposeOfArray)
                disposeOfArray.dispose();
            
            disposeOfArray = newVal instanceof wipeout.base.array ? 
                newVal.observe(callback, context, complexCallback) : 
                null;
        }, this);
        
        var v = wipeout.utils.obj.getObject(property, this);
        if(v instanceof wipeout.base.array) 
            disposeOfArray = v.observe(callback, context, complexCallback);
        
        return {
            dispose: function() {
                if (disposeOfArray)
                    disposeOfArray.dispose();
                dispose.dispose();
            }
        };
    };
    
    watched.prototype.del = function(property) {
        ///<summary>Do "delete obj.prop" functionality</summary>
        ///<param name="property" type="String" optional="false">The property name</param>
        ///<returns type="Boolean">The result of the delete</returns>
        
        if (!useObjectObserve)
            this[property] = undefined;
        
        return delete this[property];
    };
    
    watched.prototype.computed = function(name, callback, watchVariables, callbackStringOverride) {
        ///<summary>Do "delete obj.prop" functionality</summary>
        ///<param name="property" type="String" optional="false">The property name</param>
        ///<returns type="Boolean">The result of the delete</returns>
                
        return new wipeout.base.computed(this, name, callback, watchVariables, callbackStringOverride);
        
        var comp = new wipeout.base.computed(callback, this, watchVariables, callbackStringOverride);
        comp.bind(this, name);
        
        return comp;
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
