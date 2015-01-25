
Class("wipeout.change.objectHandler", function () {
            
    var objectHandler = wipeout.base.object.extend(function objectHandler (forObject) {
        
        if (this.constructor === objectHandler) throw "Cannot create instance of an abstract class";
        
        this._super();
        
        this.forObject = forObject;
        this.callbacks = {};
    });
    
    objectHandler.prototype.registerChange = function (change) {
        wipeout.change.handler.instance.pushObj(change, this);
    };
    
    objectHandler.prototype._observe = function (callback, callbackList, sortCallback) {
        throw "Abstract methods must be implemented";
    };
    
    objectHandler.prototype.observe = function (property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged, priority) {
        
        var suspended = 0;
        var callbacks = this.callbacks[property] || (this.callbacks[property] = []);
        
        context = context || this;
        var cb = function (oldVal, newVal) {
            if ((evaluateIfValueHasNotChanged || oldVal !== newVal) && !suspended)
                callback.apply(context, arguments);
        }
        
        cb.property = property;
        cb.priority = priority || 0;
        cb.evaluateOnEachChange = !!evaluateOnEachChange;
        
        var cancel = this._observe(property, cb, callbacks, function () { callbacks.sort(function (a, b) { return a.priority > b.priority  }) });
        
        var output = {
            dispose: function () {
                if(!callbacks) return;
                                
                cancel();
                
                var i = callbacks.indexOf(cb);
                if (i !== -1)
                    callbacks.splice(i, 1);
                
                callbacks = null;
            },
            suspend: function (callback) {
                //TODO document this
                if (callback === false) {
                    var dispose = this.observe(property, function () {
                        dispose.dispose();
                        suspended++;
                    }, null, null, Number.MIN_VALUE);
                } else if (!arguments.length || callback.constructor !== Function) {
                    if (suspended > 0)
                        suspended--;
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