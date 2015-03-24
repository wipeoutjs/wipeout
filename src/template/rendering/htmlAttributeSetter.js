
Class("wipeout.template.rendering.htmlAttributeSetter", function () {
	
	var htmlAttributeSetter = wipeout.template.setter.extend(function htmlAttributeSetter (name, value, action /* optional */) {
		
		this._super(name, value);
		
		this.action = action;
	});
	
	htmlAttributeSetter.prototype.setData = function (element, name, data) {
        
		if (!this._caching)
			throw "The setData function can only be called in the context of a cacheAllWatched call. Otherwise the event dispose callback will be lost, causing memory leaks";
		
		this._caching.push({
			dispose: function () {
				wipeout.utils.domData.clear(element, name);
			}
		});
		
		return wipeout.utils.domData.set(element, name, data);
	};
	
	htmlAttributeSetter.prototype.getData = function (element, name, data) {
		
		return wipeout.utils.domData.get(element, name);
	};
	
	htmlAttributeSetter.prototype.eventBuild = function () {
		
		return this._eventBuilt || (this._eventBuilt = wipeout.template.context.buildEventGetter(this.getValue()));
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
	
	htmlAttributeSetter.prototype.applyToElement = function (element, renderContext) {
		var op = [];
		op.push.apply(op, this.cacheAllWatched((function () {
			var o = wipeout.template.rendering.htmlAttributes[this.action || this.name](element, this, renderContext);
			if (o && o.dispose instanceof Function)
				op.push(o);
			else if (o instanceof Function)
				op.push({ dispose: o });
		}).bind(this)));
		
		return op;
	};
	
	return htmlAttributeSetter;
});