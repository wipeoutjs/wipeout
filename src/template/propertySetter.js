
Class("wipeout.template.propertySetter", function () {
	
    function propertySetter (value, flags) {
        this.value = value;
        
        this.parser = [];
        this.bindingType = null;
        
        // process parseing and binding flags
        enumerateArr(flags || [], function (flag) {
            if (wipeout.template.compiledInitializer.parsers[flag]) {
                this.parser.push(wipeout.template.compiledInitializer.parsers[flag]);
            } else if (wipeout.htmlBindingTypes[flag]) {
                if (this.bindingType)
                    throw "A binding type is already specified for this property.";
                
                this.bindingType = flag;
            }
        }, this);
        
        // if parser has already been processed
        if (!(this.parser instanceof Array))
            return;
        
        var p = this.parser;
        
        if (p.length === 1) {
            this.parser = p[0];
        } else if (p.length) {
            this.parser = function (value, propertyName, renderContext) {
                for(var i = 0, ii = p.length; i < ii; i++)
                    value = p[i](value, propertyName, renderContext);

                return value;
            };
            
            this.parser.xmlParserTempName = p[0].xmlParserTempName;
        } else {
            this.parser = null;
        }
    }
	
	propertySetter.prototype.getParser = function(forViewModel, propertyName) {
        var globalParser = forViewModel instanceof wipeout.base.bindable ?
            forViewModel.getGlobalParser(propertyName) :
            null;
        
        // use parser, global parser or lazy create auto parser
        return this.parser || 
            globalParser ||
            (this.parser = wipeout.template.compiledInitializer.getAutoParser(this.valueAsString()));
    };
    
    propertySetter.prototype.valueAsString = function () {
        return typeof this._valueAsString === "string" ?
            this._valueAsString :
            (this._valueAsString = this.value.serializeContent());
    };
	
	return propertySetter;
});