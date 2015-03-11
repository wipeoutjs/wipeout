
Class("wipeout.template.context", function () {
    
    // warning: do not make observable. This will create a LOT of un necessary subscriptions
    function context (forVm, parentContext, arrayIndex) {
		
		if (forVm && forVm.shareParentScope)
			throw "You cannot create a template context for a view model with a shared parent scope";
        
        this.$this = forVm;
        
        if (parentContext) {
            this.$parentContext = parentContext;
            this.$parent = parentContext.$this;
            this.$parents = [parentContext.$this];
            this.$parents.push.apply(this.$parents, parentContext.$parents);
        } else {
			this.$parentContext = null;
			this.$parent = null;
			this.$parents = [];
		}
		
		if (arrayIndex != null) {
			this.$index = new obsjs.observable();
			this.$index.value = arrayIndex;
		}
    }
    
    // each render context has access to the global scope
    function renderContextPrototype () {}    
    renderContextPrototype.prototype = window;
    context.prototype = new renderContextPrototype();
    
    context.prototype.$find = function (searchTermOrFilters, filters) {
		
		return (this._finder || (this._finder = new wipeout.utils.find(this))).find(searchTermOrFilters, filters);
    };
    
    context.prototype.contextFor = function (forVm, arrayIndex) {
        
		if (wipeout.settings.displayWarnings && forVm.shareParentScope && arguments.length > 1)
			console.warn("If an item in an array is to be rendered with shareParentScope set to true, this item will not have an $index value in it's renered context");
		
        return forVm && forVm.shareParentScope ? this : new context(forVm, this, arrayIndex);
    };
    
	//TODO: not testing as this will probably be removed
    context.prototype.variablesForComputed = function (additions) {
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
    
    return context;
});