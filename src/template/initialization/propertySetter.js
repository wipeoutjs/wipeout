
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
	
	propertySetter.prototype.getParser = function(forViewModel, propertyName) {
        
        // use parser, global parser or lazy create auto parser
        return this.parser ||
            (this.parser = (forViewModel instanceof wipeout.base.bindable ? forViewModel.getGlobalParser(propertyName) : null) || 
			wipeout.template.initialization.compiledInitializer.getAutoParser(this.valueAsString()));
    };
    
    propertySetter.prototype.valueAsString = function () {
        return typeof this._valueAsString === "string" ?
            this._valueAsString :
            (this._valueAsString = this.value.serializeContent());
    };
	
	return propertySetter;
});