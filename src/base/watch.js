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
                
        var handler = wipeout.base.watched.useObjectObserve ? 
                new wipeout.change.objectObserveObjectHandler(object) :
                new wipeout.change.nonObjectObserveObjectHandler(object, false);
        
        var observe = wipeout.base.watched.createObserveFunction(handler);
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
            value: wipeout.base.watched.prototype.del,
            writable: false
        });
        
        Object.defineProperty(object, "computed", {
            enumerable: false,
            configurable: false,
            value: wipeout.base.watched.prototype.computed,
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