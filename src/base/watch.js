// name is subject to change

Class("wipeout.base.watch", function () {
    
    var observeToken = {};
    
    var watch = function (object) {
        ///<summary>Add observe functionality to an object. The functionality is the same as wo.watched.prototype.observe</summary>
        ///<param name="object" type="Object" optional="true">The object to add functionality to. Defaults to {}</param>
        ///<returns type="Object">The amended object</returns>
        
        if (!arguments.length) object = {};
        
        if (watch.canWatch(object))
            return object;
                
        var woBag = new wipeout.base.watched().__woBag;
        var _watch = wipeout.base.watched.createWatchFunction(woBag, {});
        var observe = wipeout.base.watched.createObserveFunction(woBag, _watch);
        observe.__token = observeToken;
        
        Object.defineProperty(object, "observe", {
            enumerable: false,
            configurable: false,
            value: observe,
            writable: false
        });
        
        Object.defineProperty(object, "del", {
            enumerable: false,
            configurable: false,
            value: wipeout.base.watched.deleteFunction,
            writable: false
        });
        
        return object;
    };
    
    watch.canWatch = function (object) {
        ///<summary>Determine whether an object can be observed or not</summary>
        ///<param name="object" type="Object" optional="true">The object to check</param>
        ///<returns type="Boolean">The result</returns>
        
        return object && (object instanceof wipeout.base.watched || (object.observe && object.observe.__token === observeToken));
    }
                                      
    return watch;
});