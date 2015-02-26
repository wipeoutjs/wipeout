
Class("wipeout.template.renderContext", function () {
    
    // warning: do not make observable. This will create a LOT of un necessary subscriptions
    function renderContext (forVm, parentContext) {
        
        this.$this = forVm;
        this.$parents = [];
        this.$parent = null;
        this.$parentContext = null;
        
        if (parentContext) {
            this.$parentContext = parentContext;
            this.$parent = parentContext.$this;
            this.$parents.push(this.$parent);
            this.$parents.push.apply(this.$parents, parentContext.$parents);
        }
    }
    
    // each render context has access to the global scope
    function renderContextPrototype () {}    
    renderContextPrototype.prototype = window;
    renderContext.prototype = new renderContextPrototype();
    
    renderContext.prototype.$find = function (searchTermOrFilters, filters) {
        
		return (this._finder || (this._finder = new wipeout.utils.find(this))).find(searchTermOrFilters, filters);
    };
    
    renderContext.prototype.childContext = function (forVm) {
        
        return new renderContext(forVm, this);
    };
    
    renderContext.prototype.variablesForComputed = function (additions) {
        var output = {};
        enumerateObj(this, function (property, name) {
            if (this.hasOwnProperty(name) && name[0] === "$")
                output[name] = property;
        }, this);
        
        enumerateObj(additions, function (property, name) {
            output[name] = property;
        });
        
        return output;
    };  
    
    renderContext.addRenderContext = function (toFunction) {
        
        return toFunction
            .toString()
            .replace(/\$this/g, "renderContext.$this")
            .replace(/\$parent/g, "renderContext.$parent");
    };
    
    return renderContext;
});