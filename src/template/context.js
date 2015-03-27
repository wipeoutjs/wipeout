
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
	
	context.prototype.asGetterArgs = function () {
		return this.getterArgs || (this.getterArgs = [this, this.$this, this.$parent, this.$parents, this.$index]);
	};
	
	context.prototype.asWatchVariables = function () {
		return this.watchVariables || (this.watchVariables = {
			$context: this, 
			$this: this.$this, 
			$parent: this.$parent, 
			$parents: this.$parents, 
			$index: this.$index
		});
	};
	
	context.prototype.asEventArgs = function (e, element) {
		
		var args = this.asGetterArgs().slice();
		args.push(e);
		args.push(element);
		
		return args;
	};
	
	context.prototype.getComputed = function (forFunction) {
		return new obsjs.observeTypes.computed(forFunction, null, {watchVariables: this.asWatchVariables(), allowWith: true});
	}
	
	context.buildGetter = function (logic) {
		
		try {
			// TODO: try to reuse stuff in "asGetterArgs"
			return new Function("$context", "$this", "$parent", "$parents", "$index", "with ($context) return " + logic + ";");
		} catch (e) {
			// TODO: try to take into account some of these cases
			throw "Invalid function logic. Function logic must contain only one line of code and must not have a 'return' statement ";
		}	
	};
	
	//TODO: handle logic like this "$this.set = true; $this.unset = false;"
	context.buildEventGetter = function (logic) {
		
		if (!/\)[\s;]*$/.test(logic))
			logic += "(e, element)";
			
		try {
			// TODO: try to reuse stuff in "asGetterArgs"
			return new Function("$context", "$this", "$parent", "$parents", "$index", "e", "element", "with ($context) return " + logic + ";");
		} catch (e) {
			// TODO: try to take into account some of these cases
			throw "Invalid function logic. Function logic must contain only one line of code and must not have a 'return' statement ";
		}	
	};
    
    return context;
});