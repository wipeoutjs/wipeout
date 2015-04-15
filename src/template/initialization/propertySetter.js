
Class("wipeout.template.initialization.propertySetter", function () {
	
    var propertySetter = wipeout.template.setter.extend(function propertySetter (name, value, flags) {
        ///<summary>A setter for a view model property</summary>
        ///<param name="name" type="String">The name of the property</param>
        ///<param name="value" type="wipeout.wml.wmlElement|wipeout.wml.wmlAttribute">The setter value</param>
        ///<param name="flags" type="Array">Binding or parser flags</param>
		
		this._super(name, value);
        
        ///<summary type="Function">The parser if any</summary>
        this.parser = [];
		
        ///<summary type="String">The binding type if any</summary>
        this.bindingType = null;
        
        // process parseing and binding flags
        enumerateArr(flags || [], function (flag) {
            if (wipeout.template.initialization.parsers[flag]) {
                this.parser.push(wipeout.template.initialization.parsers[flag]);
            } else if (wipeout.htmlBindingTypes[flag]) {
                if (this.bindingType)
                    throw "A binding type is already specified for this property.";
                
                this.bindingType = flag;
            }
        }, this);
        
        // if parser has already been processed
        if (!(this.parser instanceof Array))
            return;
                
        if (this.parser.length === 1) {
            this.parser = this.parser[0];
        } else if (this.parser.length) {
        	var p = this.parser;
            this.parser = function (value, propertyName, renderContext) {
                for(var i = 0, ii = p.length; i < ii; i++)
                    value = p[i](value, propertyName, renderContext);

                return value;
            };
            
            this.parser.useRawXmlValue = p[0].useRawXmlValue;
        } else {
            this.parser = null;
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
		
	propertySetter.prototype.getBindingType = function (viewModel) {
        ///<summary>Get the binding type or global binding type</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<returns type="String">the binding type</returns>
		
		return this.bindingType || 
				(viewModel instanceof wipeout.base.bindable && viewModel.getGlobalBindingType(this.name)) || 
				"ow";
	};
	
	return propertySetter;
});