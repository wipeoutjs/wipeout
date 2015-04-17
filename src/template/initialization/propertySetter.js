
Class("wipeout.template.initialization.propertySetter", function () {
	
    var propertySetter1 = wipeout.template.setter.extend(function propertySetter (name, value, parser) {
        ///<summary>A setter for a view model property</summary>
        ///<param name="name" type="String">The name of the property</param>
        ///<param name="value" type="wipeout.wml.wmlElement|wipeout.wml.wmlAttribute">The setter value</param>
        ///<param name="parser" type="String|Function">the parser or a pointer to it</param>
		
		this._super(name, value, parser);
	});
	
	propertySetter1.prototype.onPropertyChanged = function (viewModel, callback, evaluateImmediately) {
        ///<summary>A setter for a view model property</summary>
        ///<param name="viewModel" type="Any">The view model which has the property</param>
        ///<param name="callback" type="Function">A callback to execute when the value changes</param>
        ///<param name="evaluateImmediately" type="Boolean">Execute the callback now</param>
        ///<returns type="Boolean">Whether the property could be subscribed to or not</returns>
		
		if (!this._caching)
			throw "The watch function can only be called in the context of a cacheAllWatched call. Otherwise the watcher object will be lost, causing memory leaks";
		
		var op = obsjs.tryObserve(viewModel, this.name, callback);
		if (op) this._caching.push(op);
		if (evaluateImmediately)
			callback(undefined, wipeout.utils.obj.getObject(this.name, viewModel));
		
		return !!op;
	};
	
	// override
	propertySetter1.prototype.value = function() {
        ///<summary>Get the value</summary>
        ///<returns type="String">The value</returns>
		
        return this.hasOwnProperty("_valueAsString") ?
            this._valueAsString :
            (this._valueAsString = this._super().serializeContent());
    };
	
	// override
	propertySetter1.prototype.getParser = function (propertyOwner) {
		///<summary>Return the parser for the </summary>
        ///<param name="propertyOwner" type="Any">The object (or Element) which this property is being applied to</param>
        ///<returns type="Function">The parser</returns>
		
		return this._super() || (propertyOwner instanceof wipeout.base.bindable && propertyOwner.getGlobalParser(this.name));
	};
	
	return propertySetter1;
	
	
	
    var propertySetter = wipeout.template.setter.extend(function propertySetter (name, value, parser) {
        ///<summary>A setter for a view model property</summary>
        ///<param name="name" type="String">The name of the property</param>
        ///<param name="value" type="wipeout.wml.wmlElement|wipeout.wml.wmlAttribute">The setter value</param>
        ///<param name="parser" type="String|Function">the parser or a pointer to it</param>
		
		this._super(name, value, parser);
	});
	
	// override
	propertySetter.prototype.getValue = function() {
        ///<summary>Get the value</summary>
        ///<returns type="String">The value</returns>
		
        return this.hasOwnProperty("_valueAsString") ?
            this._valueAsString :
            (this._valueAsString = this._super().serializeContent());
    };
	
	propertySetter.prototype.getParser = function(forViewModel) {
        ///<summary>Get the parser or a global parser</summary>
        ///<param name="forViewModel" type="Any">The current view model</param>
        ///<returns type="Function">the parser</returns>
		
        // use parser, global parser or lazy create auto parser
        return this.parser ||
            (forViewModel instanceof wipeout.base.bindable ? forViewModel.getGlobalParser(this.name) : null);
    };
	 
	propertySetter.prototype.parseOrExecute = function (viewModel, renderContext) {
        ///<summary>Get the value of this setter for a given viewModel and render context</summary>
        ///<param name="viewModel" type="Any">The current view model. This is used to get a global parser, if any</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Any">The result</returns>
		
		var parser = this.getParser(viewModel);
		
		return parser ?
			parser(parser.useRawXmlValue ? this._value : this.getValue(), this.name, renderContext) :
			this.build().apply(null, renderContext.asGetterArgs());
	};
	
	return propertySetter;
});