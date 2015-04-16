
Class("wipeout.template.initialization.propertySetter", function () {
	
    var propertySetter = wipeout.template.setter.extend(function propertySetter (name, value, parser) {
        ///<summary>A setter for a view model property</summary>
        ///<param name="name" type="String">The name of the property</param>
        ///<param name="value" type="wipeout.wml.wmlElement|wipeout.wml.wmlAttribute">The setter value</param>
        ///<param name="parser" type="String|Function">the parser or a pointer to it</param>
		
		this._super(name, value);
        
        ///<summary type="Function">The parser if any</summary>
        this.parser = null;
		
        ///<summary type="String">The binding type if any</summary>
        this.bindingType = null;
		
		if (parser instanceof Function) {
			this.parser = parser;
		} else if (parser) {
            if (wipeout.template.initialization.parsers[parser])
                this.parser = wipeout.template.initialization.parsers[parser];
			else
				throw "Invalid parser: " + parser;	//TODE
		}
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