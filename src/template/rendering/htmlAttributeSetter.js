
Class("wipeout.template.rendering.htmlAttributeSetter", function () {
	
	function htmlAttributeSetter (name, value, action /* optional */) {
		this.name = name;
		this.action = action;
		this.value = value;
	}
	
	htmlAttributeSetter.prototype.eventBuild = function () {
		
		return this._eventBuilt || (this._eventBuilt = wipeout.template.context.buildEventGetter(this.value));
	};
	
	htmlAttributeSetter.prototype.onElementEvent = function (element, event, renderContext, callback) { //TODO error handling
        
		if (!this._caching)
			throw "The onElementEvent function can only be called in the context of a cacheAllWatched call. Otherwise the event dispose callback will be lost, causing memory leaks";
		
		callback = callback || (function (e) {
			this.eventBuild().apply(null, renderContext.asEventArgs(e, element));
		}).bind(this);
						
        //TODO, third arg in addEventListener (capture)
        element.addEventListener(event, callback);
        
        var output = new obsjs.disposable(function() {
			//TODO, third arg (capture)
			element.removeEventListener(event, callback);
			callback = null;
        });
		
		this._caching.push(output);
		
		return output.dispose.bind(output);
    };
	
	htmlAttributeSetter.prototype.build = function () {
		
		return this._built || (this._built = wipeout.template.context.buildGetter(this.value));
	};
	
	htmlAttributeSetter.prototype.watch = function (renderContext, callback, evaluateImmediately) {
		if (!this._caching)
			throw "The watch function can only be called in the context of a cacheAllWatched call. Otherwise the watcher object will be lost, causing memory leaks";
				
		var watched = wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(this.value) ?
			new obsjs.observeTypes.pathObserver(renderContext, this.value) :
			renderContext.getComputed(this.build());
		
		this._caching.push(watched);
		return watched.onValueChanged(callback, evaluateImmediately);
	};
	
	htmlAttributeSetter.prototype.apply = function (element, renderContext) {
		var op = [];
		op.push.apply(op, this.cacheAllWatched((function () {
			var o = wipeout.template.rendering.htmlAttributes[this.action || this.name](element, this, renderContext);
			if (o instanceof Function)
				op.push({ dispose: o });
			else if (o && o.dispose instanceof Function)
				op.push(o);
		}).bind(this)));
		
		return op;
	};
	
	htmlAttributeSetter.prototype.execute = function (renderContext) {
		return this.build().apply(null, renderContext.asGetterArgs());
	};
	
	htmlAttributeSetter.prototype.cacheAllWatched = function (logic) {
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
	
	return htmlAttributeSetter;
});