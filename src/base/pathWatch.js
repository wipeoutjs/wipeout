// name is subject to change

Class("wipeout.base.pathWatch", function () {
    
    var arrayMatch = /\[\s*\d\s*\]$/g;
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
        
        this.path = property.split(".");
        for (var i = 0; i < this.path.length; i++) {
            this.path[i] = wipeout.utils.obj.trim(this.path[i]);
            var match = this.path[i].match(arrayMatch);
            if (match) {
                this.path[i] = wipeout.utils.obj.trim(this.path[i].replace(arrayMatch, ""));
                
                for (var j = 0, jj = match.length; j < jj; j++)
                    this.path.splice(++i, 0, parseInt(match[j].match(/\d/)[0]));
            }
        }
        
        this.disposables = new Array(this.path.length);
        this.val = wipeout.utils.obj.getObject(property, forObject);
        
        this.buildObservableChain();
        this.init = true;
        
        this.disp = this.observe("val", callback, context || forObject, evaluateOnEachChange, evaluateIfValueHasNotChanged);
    });
    
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
        
        var currentIsArray = (function (i) {
            return (i != null ? current[this.path[i]] : current) instanceof wipeout.base.array;
        }).bind(this);
        
        // get the last item in the path subscribing to changes along the way
        for (; current && i < this.path.length - (currentIsArray(i) ? 0 : 1); i++) {
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
        
        // observe the last item in the path
        if (currentIsArray())
            this.disposables[i] = current.observe(this.callback, this.context || this.forObject, this.evaluateOnEachChange, this.evaluateIfValueHasNotChanged);
        else if (current && current.observe /*TODO: better way of telling*/)
            this.disposables[i] = current.observe(this.path[i], function(oldVal, newVal) {
                this.val = newVal;
            }, this);
    };
    
    pathWatch.prototype.dispose = function () {
        for (var i = 0, ii = this.disposables.length; i < ii && this.disposables[i]; i++)
            if (this.disposables[i])
                this.disposables[i].dispose();

        this.disposables.length = 0;
        this.disp.dispose();        
        
        for (var i in this)
            delete this[i];
    };
                                      
    return pathWatch;
});