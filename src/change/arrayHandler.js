
Class("wipeout.change.arrayHandler", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    var arrayHandler = wipeout.base.object.extend(function arrayHandler (forArray) {
        
        if (this.constructor === arrayHandler) throw "Cannot create instance of an abstract class";
        
        this._super();
        
        if (!(forArray instanceof wipeout.base.array))
            throw "Invalid array";
                
        this.forArray = forArray;
        this.simpleCallbacks = [];    // function (removed, added) { }
        this.complexCallbacks = [];   // function (change) { }
        this.arrayCopy = wipeout.utils.obj.copyArray(forArray);
    });
    
    arrayHandler.isValidArrayChange = function (change) {
        return change.type === "splice" || (change.type === "update" && !isNaN(parseInt(change.name)));
    };
    
    arrayHandler.prototype.registerChange = function (change) {

        wipeout.change.handler.instance.pushArray(this.forArray, change, this.forArray.__woBag);
    };
    
    arrayHandler.prototype._observe = function (callback, callbackList, disposed) {
        throw "Abstract methods must be implemented";
    };
    
    arrayHandler.prototype.observe = function (callback, context, complexCallback /*TODO*/) {
        
        var callbacks = complexCallback ? 
            this.complexCallbacks : 
            this.simpleCallbacks;
        
        //TODO, polyfill bind
        callback = callback.bind(context || this);
        
        var cancel = this._observe(callback, callbacks);
        
        return {
            dispose: function () {
                if(!callbacks) return;
                                
                cancel();
                
                var i = callbacks.indexOf(callback);
                if (i !== -1)
                    callbacks.splice(i, 1);
                
                callbacks = null;
            }
        };
    };
    
    arrayHandler.prototype.dispose = function() {        
        this.__woBag.watchedArray.complexCallbacks.length = 0;
        this.__woBag.watchedArray.simpleCallbacks.length = 0;
    }
    
    return arrayHandler;
});