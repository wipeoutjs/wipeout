
Class("wipeout.template.rendering.htmlAttributeSetter", function () {
	
	var htmlAttributeSetter = wipeout.template.setter.extend(function htmlAttributeSetter (name, value, action) {
		///<summary>Set html attributes</summary>
        ///<param name="name" type="String">The name of the attribute</param>
        ///<param name="value" type="String">The value of the attribute</param>
        ///<param name="action" type="String" optional="true">The wipoeut html attribute to use. If null, use "name"</param>
		
		this._super(name, value);
		
		///<summary type="String">The wipoeut html attribute to use. If null, use "name"</summary>
		this.action = action;
	});
	
	htmlAttributeSetter.prototype.setData = function (element, name, data) {
		///<summary>When used by a wipeout html attribute (wo.htmlAttributes), set data against the html element. This is useful to pass data between html attributes</summary>	//TODM
        ///<param name="element" type="Element">The html element</param>
        ///<param name="name" type="String">The data key</param>
        ///<param name="data" type="Any">the data</param>
        ///<returns type="Any">The data</returns>
        
		if (!this._caching)
			throw "The setData function can only be called in the context of a cacheAllWatched call. Otherwise the event dispose callback will be lost, causing memory leaks";
		
		this._caching.push({
			dispose: function () {
				wipeout.utils.domData.clear(element, name);
			}
		});
		
		return wipeout.utils.domData.set(element, name, data);
	};
	
	htmlAttributeSetter.prototype.getData = function (element, name) {
		///<summary>Get data saved against a html element</summary>
        ///<param name="element" type="Element">the element</param>
        ///<param name="name" type="String">The data key</param>
        ///<returns type="Any">The data</returns>
		
		return wipeout.utils.domData.get(element, name);
	};
	
	htmlAttributeSetter.prototype.dataExists = function (element, name) {
		///<summary>Determine whether an element has a data key</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="name" type="String">The data key</param>
        ///<returns type="Boolean">The result</returns>
		
		return wipeout.utils.domData.exists(element, name);
	};
	
	htmlAttributeSetter.prototype.eventBuild = function () {
		///<summary>Build an event invoker for this._value</summary>
        ///<returns type="Function">A function to get the value from render context parts</returns>
		
		return this._eventBuilt || (this._eventBuilt = wipeout.template.context.buildEventGetter(this.getValue()));
	};
	
	htmlAttributeSetter.prototype.onElementEvent = function (element, event, renderContext, callback, capture) { //TODE
		///<summary>When called within a wipeout binding function, will watch for a an element event. Also handles all disposal in this case</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="event" type="String">The event</param>
        ///<param name="renderContext" type="wipeout.template.context">The context of the callback</param>
        ///<param name="callback" type="Function">A callback for the event. To use the render context, generate the callback using wipeout.template.context.buildEventGetter</param>
        ///<param name="capture" type="Boolean">Capture the event within this element</param>
        ///<returns type="Function">A dispose function to dispose prematurely</returns>
		
		if (!this._caching)
			throw "The onElementEvent function can only be called in the context of a cacheAllWatched call. Otherwise the event dispose callback will be lost, causing memory leaks";
		
		callback = callback || (function (e) {
			this.eventBuild().apply(null, renderContext.asEventArgs(e, element));
		}).bind(this);
						
        element.addEventListener(event, callback, capture || false);
        
        var output = new obsjs.disposable(function() {
			element.removeEventListener(event, callback, capture || false);
			callback = null;
        });
		
		this._caching.push(output);
		
		return output.dispose.bind(output);
    };
	
	htmlAttributeSetter.prototype.applyToElement = function (element, renderContext) {
		///<summary>Apply this attribute to an element/summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Array">An array of disposables</returns>
		
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
	
	htmlAttributeSetter.prototype.splitValue = function () {
		///<summary>Splits an attribute string into various parts</summary>
        ///<returns type="Object|String">The split data, or the original input if the data does not need to be split</returns>
		
		var splitValue = wipeout.utils.obj.removeCommentsTokenStrings(this.getValue());
		var split = splitValue.output.split("=>");
		if (split.length === 1)
			return {
				inputs: [this.getValue()],
				filter: "passthrough"
			};
		
		if (split.length !== 2)
			throw "Invalid attribute value: " + splitValue + ". You may only include 1 filter.";	//TODE
		
		var output = {
			filter: trim(splitValue.addTokens(split[1])),
			inputs: []
		};
		
		enumerateArr(split[0].split(","), function (item) {
			output.inputs.push(trim(splitValue.addTokens(item)));
		});
		
		return output;
	};
	
	return htmlAttributeSetter;
});