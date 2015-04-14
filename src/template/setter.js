
Class("wipeout.template.setter", function () {
	
	/*
	Redesign
	Common elements:	name parsing (something--s-tw)
						parsers
						filters
						getValue
						canSet
						setValue
						onValueChanged
						
	Properties:			bindingType
						onPropertyChange
	
	Element:			on elmement event
	*/
	
	
	
	
	//var build, watch, execute (get), getValue
	
	var setter1 = objjs.object.extend(function setter (name, value) {
		///<summary>Base class for vm property setters and html attribute setters</summary>
        ///<param name="name" type="String">The name of the item to set</param>
        ///<param name="value" type="String">The value to set it at (before parsing and renderContext are applied)</param>
		
		this._super();
	
		///<summary type="String">The name of the property</summary>
		this.name = name;
		
		///<summary type="String">The value of the property</summary>
		this._value = value;
	});
		
	
	
	var setter = objjs.object.extend(function setter (name, value) {
		///<summary>Base class for vm property setters and html attribute setters</summary>
        ///<param name="name" type="String">The name of the item to set</param>
        ///<param name="value" type="String">The value to set it at (before parsing and renderContext are applied)</param>
		
		this._super();
	
		///<summary type="String">The name of the property</summary>
		this.name = name;
		
		///<summary type="String">The value of the property</summary>
		this._value = value;
	});
	
	setter.prototype.build = function () {
		///<summary>Build a getter for this._value</summary>
        ///<returns type="Function">A function to get the value from render context parts</returns>
		
		return this._built || (this._built = wipeout.template.context.buildGetter(this.getValue()));
	};
	
    setter.isSimpleBindingProperty = function (property) {
		///<summary>Determine whether a logic string is a simple property chain</summary>
        ///<param name="property" type="String">The logic</param>
        ///<returns type="Boolean">The result</returns>
		
        return /^([\$\w\s\.]|(\[\d+\]))+$/.test(property);
    };
	
	setter.prototype.watch = function (renderContext, callback, evaluateImmediately) {
		///<summary>When called within a wipeout binding function, will watch for a change in the value of the setter. Also handles all disposal in this case</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<param name="callback" type="Function">The callback to invoke when the value changes</param>
        ///<param name="evaluateImmediately" type="Boolean">Invoke the callback now</param>
        ///<returns type="obsjs.diposable">A dispose function to dispose prematurely</returns>
		
		if (!this._caching)
			throw "The watch function can only be called in the context of a cacheAllWatched call. Otherwise the watcher object will be lost, causing memory leaks";
		
		var watched = setter.isSimpleBindingProperty(this.getValue()) ?
			new obsjs.observeTypes.pathObserver(renderContext, this.getValue()) :
			renderContext.getComputed(this.build());
		
		this._caching.push(watched);
		return watched.onValueChanged(callback, evaluateImmediately);
	};
	
	setter.prototype.execute = function (renderContext) {
		///<summary>Return the value of this setter when applied to a renderContext</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Any">The returned value</returns>
		
		return this.build().apply(null, renderContext.asGetterArgs());
	};
	
	setter.prototype.cacheAllWatched = function (logic) {
		///<summary>Set up the setter to cache dispose functions and invoke logic which might create dispose functions</summary>
        ///<param name="logic" type="Function">The logic to invoke</param>
        ///<returns type="Array" generic0="obsjs.disposable">Dispose functions</returns>
		
		if (this._caching)
			throw "cacheAllWatched cannot be asynchronus or nested.";
		
		try {
			this._caching = [];
			logic();
			return this._caching;
		} finally {
			delete this._caching;
		}
	};
	
	// virtual
	setter.prototype.getValue = function () {
		///<summary>Get the value</summary>
        ///<returns type="String">The value</returns>
		
		return this._value;
	};
	
	return setter;
});