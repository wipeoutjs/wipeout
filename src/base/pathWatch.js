// name is subject to change

Class("wipeout.base.pathWatch", function () {
    
    function pathWatch (forObject, property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged) {
        ///<summary>Observe a property for change. Should be "call()"ed with this being a "watched"</summary>
        ///<param name="forObject" type="wipeout.base.watched" optional="false">The object to watch</param>
        ///<param name="property" type="String" optional="false">The property</param>
        ///<param name="callback" type="Function" optional="false">The callback for property change</param>
        ///<param name="context" type="Any" optional="true">The context of the callback</param>
        ///<param name="evaluateOnEachChange" type="Boolean" optional="true">If set to true, will fire callback each time the property changes, rather than once, for the last time the property changed</param>
        ///<param name="evaluateIfValueHasNotChanged" type="Boolean" optional="true">If set to true, will fire callback if the new value is the same as the old value</param>
        ///<returns type="Object">A disposable object</returns>
        
        this.forObject = forObject;
        this.property = property;
        this.callback = callback;
        this.context = context;
        this.evaluateOnEachChange = evaluateOnEachChange;
        this.evaluateIfValueHasNotChanged = evaluateIfValueHasNotChanged;
        
        this.path = property.split(".");        
        this.disposables = new Array(this.path.length);
        this.val = wipeout.utils.obj.getObject(property, forObject);
        
        this.redo(0, this.path.length);
    }
    
    pathWatch.prototype.redo = function (begin, end) {
                           
        // dispose of anything in the path after the change
        for (var i = begin; i < end; i++) {
            if (this.disposables[i]) {
                this.disposables[i].dispose();
                this.disposables[i] = null;
            } else {
                break;
            }
        }

        // subscribe to new objects after the change and get the latest object in the path which is observable
        var current = this.forObject, _this = this;
        for (var i = 0; current && current.observe /*TODO: better way of telling*/ && i < end - 1; i++) {
            if (current[this.path[i]] && i >= begin)              
                this.disposables[i] = current.observe(this.path[i], (function (i) {
                    return function() {
                        _this.redo(i, end);                            
                    };
                }(i)));                

            current = current[this.path[i]];
        }

        if (current && current.observe /*TODO: better way of telling*/)
            this.disposables[i] = current.observe(this.path[i], this.callback, this.context, this.evaluateOnEachChange, this.evaluateIfValueHasNotChanged);

        var newVal = wipeout.utils.obj.getObject(this.property, this.forObject);
        if (this.val !== newVal) {
            this.callback.call(this.context, this.val, newVal);
            this.val = newVal;
        }
    };
    
    pathWatch.prototype.dispose = function () {
        for (var i = 0, ii = this.disposables.length; i < ii && this.disposables[i]; i++)
            this.disposables[i].dispose();

        this.disposables.length = 0;
    };
                                      
    return pathWatch;
});