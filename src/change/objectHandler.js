
Class("wipeout.change.objectHandler", function () {

    var arrayIndexProperty = "$wipeout-array-index-property";
    var objectHandler = wipeout.base.disposable.extend(function objectHandler (forObject) {
        
        if (this.constructor === objectHandler) throw "Cannot create instance of an abstract class";
        
        this._super();
        
        this.forObject = forObject;
        this.callbacks = {};
        
        if (this.forArray = (forObject instanceof wipeout.base.array)) {
            this.callbacks[arrayIndexProperty] = {
                complexCallbacks: [],
                simpleCallbacks: []
            };
            
            this.arrayCopy = wipeout.utils.obj.copyArray(forObject);
        }
    });
    
    var arrayIndexProperty = objectHandler.arrayIndexProperty = "$wipeout-array-index-property";
    
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
        
        if (typeof arguments[0] === "string") {            
                      
            // stagger argument list
            var property = arguments[0], cb = arguments[1], ctxt = arguments[2], cplx = arguments[3];
            var disposeKey2;
            var disposeKey1 = this.registerDisposable(this.forObject.observe(property, function(oldVal, newVal) {
                if (disposeKey2)
                    this.disposeOf(disposeKey2);

                disposeKey2 = newVal instanceof wipeout.base.array ? 
                    this.registerDisposable(newVal.observe(cb, ctxt, cplx)) : 
                    null;
            }));

            var v = wipeout.utils.obj.getObject(property, this.forObject);
            if(v instanceof wipeout.base.array) 
                disposeKey2 = this.registerDisposable(v.observe(cb, ctxt, cplx));

            return new wipeout.base.disposable(function() {
                if (disposeKey2)
                    this.disposeOf(disposeKey2);

                this.disposeOf(disposeKey1);
            });
        }
        
        var callbacks = complexCallback ? 
            this.callbacks[arrayIndexProperty].complexCallbacks : 
            this.callbacks[arrayIndexProperty].simpleCallbacks;
        
        var cb = function () {
            if (!output.suspended)
                callback.apply(context, arguments);
        };
        
        cb.property = arrayIndexProperty;
        
        var output = this.observe(arrayIndexProperty, cb, callbacks);
        return output;
    };
    
    objectHandler.prototype.observeObject = function (property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged, priority) {
        
        if (/[\.\[]/.test(property)) {
            var pw = new wipeout.base.pathWatch(this.forObject, property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged);
            this.registerDisposable(pw);
            return pw;
        }
        
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
        
        this.registerDisposable(output);
        
        return output;
    };
    
    objectHandler.prototype.dispose = function() {
        this._super();
        
        for (var i in this.callbacks) {
            if (i === arrayIndexProperty) {
                this.callbacks[i].simpleCallbacks.length = 0;
                this.callbacks[i].complexCallbacks.length = 0;
            } else {
                delete this.callbacks[i];
            }
        }
    }
    
    return objectHandler;
});