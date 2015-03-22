
Class("wipeout.template.setter", function () {
	
	var setter = objjs.object.extend(function setter (name, value) {
		this._super();
		
		this.name = name;
		this._value = value;
	});
	
	setter.prototype.build = function () {
		
		return this._built || (this._built = wipeout.template.context.buildGetter(this.getValue()));
	};
	
	setter.prototype.watch = function (renderContext, callback, evaluateImmediately) {
		if (!this._caching)
			throw "The watch function can only be called in the context of a cacheAllWatched call. Otherwise the watcher object will be lost, causing memory leaks";
				
		var watched = wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(this.getValue()) ?
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