
Class("wipeout.template.initialization.propertySetter", function () {
	
    var propertySetter = wipeout.template.setter.extend(function propertySetter (name, value, flags) {
		
		this._super(name, value);
        
        this.parser = [];
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
            
            this.parser.xmlParserTempName = p[0].xmlParserTempName;
        } else {
            this.parser = null;
        }
    });
	
	// override
	propertySetter.prototype.getValue = function() {
		
        return this.hasOwnProperty("_valueAsString") ?
            this._valueAsString :
            (this._valueAsString = this._value.serializeContent());
    };
	
	propertySetter.prototype.getParser = function(forViewModel) {
		
        // use parser, global parser or lazy create auto parser
        return this.parser ||
            (forViewModel instanceof wipeout.base.bindable ? forViewModel.getGlobalParser(this.name) : null);
    };
	
	propertySetter.prototype.parseOrExecute = function (viewModel, renderContext) {
		
		var parser = this.getParser(viewModel);
		
		return parser ?
			parser(parser.xmlParserTempName ? this._value : this.getValue(), this.name, renderContext) :
			this.build().apply(null, renderContext.asGetterArgs());
	};
	
	propertySetter.prototype.applyToViewModel = function (viewModel, renderContext) {
		
		if (!this.bindingType)
			this.bindingType = 
				(viewModel instanceof wipeout.base.bindable && viewModel.getGlobalBindingType(this.name)) || 
				"ow";
		
		if (!wipeout.htmlBindingTypes[this.bindingType]) throw "Invalid binding type :\"" + this.bindingType + "\" for property: \"" + this.name + "\".";
		
		var op = [];
		op.push.apply(op, this.cacheAllWatched((function () {
			var o = wipeout.htmlBindingTypes[this.bindingType](viewModel, this, renderContext)
			if (o instanceof Function)
				op.push({ dispose: o });
			else if (o && o.dispose instanceof Function)
				op.push(o);
		}).bind(this)));
		
		return op;
	};
	
	return propertySetter;
});