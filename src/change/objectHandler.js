
Class("wipeout.change.objectHandler", function () {

    var arrayIndexProperty = "$wipeout-array-index-property";
    var objectHandler = wipeout.base.object.extend(function objectHandler (forObject) {
        
        if (this.constructor === objectHandler) throw "Cannot create instance of an abstract class";
        
        this._super();
        
        this.forObject = forObject;
        this.callbacks = {};
        
        if (this.forArray = (forObject instanceof wipeout.base.array)) {
            callbacks[arrayIndexProperty] = {
                complexCallbacks: [],
                simpleCallbacks: []
            };
            
            this.arrayCopy = wipeout.utils.obj.copyArray(forObject);
        }
    });
    
    objectHandler.prototype.isValidArrayChange = function (change) {
        return this.forArray && objectHandler.isValidArrayChange(change);
    };
    
    objectHandler.isValidArrayChange = function (change) {
        return change.type === "splice" || (change.type === "update" && !isNaN(parseInt(change.name)));
    };
    
    objectHandler.prototype.registerChange = function (change) {
        
        if (this.isValidArrayChange(change))
            wipeout.change.handler.instance.pushArray(this.forObject, change, this); //TODO, first arg is not needed
        else
            wipeout.change.handler.instance.pushObj(change, this);
    };
    
    objectHandler.prototype._observe = function (callback, callbackList, sortCallback) {
        throw "Abstract methods must be implemented";
    };
        
    objectHandler.prototype.observeArray = function (callback, context, complexCallback /*TODO*/) {
        
        var callbacks = complexCallback ? 
            this.callbacks[arrayIndexProperty].complexCallbacks : 
            this.callbacks[arrayIndexProperty].simpleCallbacks;
        
        var cb = function () {
            if (!output.suspended)
                callback.apply(context, arguments);
        };
        
        var output = this.observe(arrayIndexProperty, cb, callbacks);
        return output;
    };
    
    objectHandler.prototype.observeObject = function (property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged, priority) {
        
        var callbacks = this.callbacks[property] || (this.callbacks[property] = []);
        
        var cb = function (oldVal, newVal) {
            if ((evaluateIfValueHasNotChanged || oldVal !== newVal) && !output.suspended)
                callback.apply(context, arguments);
        }
        
        cb.property = property;
        cb.priority = priority || 0;
        cb.evaluateOnEachChange = !!evaluateOnEachChange;
        
        var output = this.observe(property, cb, callbacks);
        return output;
    };
    
    objectHandler.prototype.observe = function (property, callback, callbackArray) {
                
        var cancel = this._observe(property, callback, callbackArray, function () { callbackArray.sort(function (a, b) { return a.priority > b.priority  }) });
        
        var output = {
            suspended: 0,
            dispose: function () {
                if(!callbackArray) return;
                                
                cancel();
                
                var i = callbackArray.indexOf(callback);
                if (i !== -1)
                    callbackArray.splice(i, 1);
                
                callbackArray = null;
            },
            suspend: function (callback) {
                //TODO document this
                if (callback === false) {
                    var dispose = this.observe(property, function () {
                        dispose.dispose();
                        output.suspended++;
                    }, null, null, Number.MIN_VALUE);
                } else if (!arguments.length || callback.constructor !== Function) {
                    if (output.suspended > 0)
                        output.suspended--;
                } else {
                    try {
                        output.suspend();
                        callback();
                    } finally {
                        output.suspend(false);
                    }
                }
            }
        };
        
        return output;
    };
    
    objectHandler.prototype.dispose = function() {
        for (var i in this.callbacks)
            delete this.callbacks[i];
    }
    
    return objectHandler;
});