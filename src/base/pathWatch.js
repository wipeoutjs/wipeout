// name is subject to change

Class("wipeout.base.pathWatch", function () {
    
    var pathWatch = wipeout.base.watched.extend(function pathWatch (forObject, property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged) {
        ///<summary>Observe a property for change. Should be "call()"ed with this being a "watched"</summary>
        ///<param name="forObject" type="wipeout.base.watched" optional="false">The object to watch</param>
        ///<param name="property" type="String" optional="false">The property</param>
        ///<param name="callback" type="Function" optional="false">The callback for property change</param>
        ///<param name="context" type="Any" optional="true">The context of the callback</param>
        ///<param name="evaluateOnEachChange" type="Boolean" optional="true">If set to true, will fire callback each time the property changes, rather than once, for the last time the property changed</param>
        ///<param name="evaluateIfValueHasNotChanged" type="Boolean" optional="true">If set to true, will fire callback if the new value is the same as the old value</param>
        
        this._super();
        
        this.forObject = forObject;
        this.property = property;
        this.callback = callback;
        this.context = context;
        this.evaluateOnEachChange = evaluateOnEachChange;
        this.evaluateIfValueHasNotChanged = evaluateIfValueHasNotChanged;
        
        this.path = wipeout.utils.obj.splitPropertyName(property);
        
        this.disposables = new Array(this.path.length);
        this.val = wipeout.utils.obj.getObject(property, forObject);
        
        this.buildObservableChain();
        this.init = true;
        
        this.observe("val", callback, context || forObject, evaluateOnEachChange, evaluateIfValueHasNotChanged);
    });
    
    //TODO test
    pathWatch.prototype.onValueChanged = function (callback, evaluateImmediately) {
        var obs = this.observe("val", callback); 
        this.registerDisposable(obs);
        if (evaluateImmediately) callback(undefined, this.val);
        return obs;
    }
    
    pathWatch.prototype.execute = function () {
        
        var current = this.forObject;
        
        // get item at index "begin"
        for (i = 0, ii = this.path.length; current != null && i < ii; i++) {
            current = current[this.path[i]];
        }
        
        return current;
    };
    
    pathWatch.prototype.buildObservableChain = function (begin) {
                           
        begin = begin || 0;
        
        // dispose of anything in the path after the change
        for (var i = begin; i < this.path.length; i++) {
            if (this.disposables[i]) {
                this.disposables[i].dispose();
                this.disposables[i] = null;
            }
        }

        var current = this.forObject, _this = this;
        
        // get item at index "begin"
        for (i = 0; current && i < begin; i++) {
            current = current[this.path[i]];
        }
        
        // get the last item in the path subscribing to changes along the way
        for (; current && i < this.path.length - 1; i++) {
            if (current.observe /*TODO: better way of telling*/ && current[this.path[i]] && i >= begin) {
                var args = [(function (i) {
                    return function(oldVal, newVal) {
                        _this.buildObservableChain(i);
                        _this.val = wipeout.utils.obj.getObject(_this.property, _this.forObject);
                    };
                }(i))];
                
                if (isNaN(this.path[i]))
                    args.splice(0, 0, this.path[i]);
                
                this.disposables[i] = current.observe.apply(current, args);
            }

            current = current[this.path[i]];
        }
        
        // observe last item in path
        if (current && current.observe /*TODO: better way of telling*/)
            this.disposables[i] = current.observe(this.path[i], function (oldVal, newVal) {
                this.val = newVal;
            }, this);
    };
    
    pathWatch.prototype.dispose = function () {
        this._super();
        
        for (var i = 0, ii = this.disposables.length; i < ii && this.disposables[i]; i++)
            if (this.disposables[i]) {
                this.disposables[i].dispose();
                this.disposables[i] = null;
            }

        this.disposables.length = 0;
    };
                                      
    return pathWatch;
});