
Class("wipeout.template.setter", function () {
	
	var setter = objjs.object.extend(function setter (name, value) {
		///<summary>Base class for vm property setters and html attribute setters</summary>
        ///<param name="name" type="String">The name of the item to set</param>
        ///<param name="value" type="String">The value to set it at (before parsing and renderContext are applied)</param>
		
		this._super();
		
		this.name = name;
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
		if (!this._caching)
			throw "The watch function can only be called in the context of a cacheAllWatched call. Otherwise the watcher object will be lost, causing memory leaks";
		
		var watched = setter.isSimpleBindingProperty(this.getValue()) ?
			new obsjs.observeTypes.pathObserver(renderContext, this.getValue()) :
			renderContext.getComputed(this.build());
		
		this._caching.push(watched);
		return watched.onValueChanged(callback, evaluateImmediately);
	};
	
	setter.prototype.execute = function (renderContext) {
		return this.build().apply(null, renderContext.asGetterArgs());
	};
	
	setter.prototype.cacheAllWatched = function (logic) {
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
	
	setter.prototype.getValue = function () {
		return this._value;
	};
	
	return setter;
});