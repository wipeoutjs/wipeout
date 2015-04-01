
Class("wipeout.base.bindable", function () {
	
    var bindable = wipeout.base.observable.extend(function bindable() {
        ///<summary>An object whose properties can be bound to</summary>
        
        this._super();
    });
    
    var parserPrefix = "__wipeoutGlobalParser_";
    
    // assuming this static function will be passed on via inheritance
    bindable.addGlobalParser = function (forProperty, parser) {
		 
		if (typeof parser === "string")
			parser = wipeout.template.initialization.parsers[parser];
		
        if (!(parser instanceof Function))
			//TODE
			throw "Invalid parser. Parsers must be either a string which points to wipeout parser, or a function which will parse the data";
             
        var parserName = parserPrefix + forProperty;
        if (this.prototype.hasOwnProperty(parserName)) {
			if (this.prototype[parserName] === parser)
				return;
			
            throw "A global parser has already been defined for this property";
		}
            
        this.prototype[parserName] = parser;
    };
	
	bindable.prototype.addGlobalParser = function (forProperty, parser) {
		return bindable.addGlobalParser.apply(this.constructor, arguments);
	};
    
    var bindingPrefix = "__wipeoutGlobalBinding_";
    
    // assuming this static function will be passed on via inheritance
    bindable.addGlobalBindingType = function (forProperty, bindingType) {
		
        if (typeof bindingType !== "string" || !wipeout.htmlBindingTypes[bindingType])
            //TODE
            throw "Invalid binding type. Binding types must be a string which points to wipeout binding type";
             
        var bindingName = bindingPrefix + forProperty;
        if (this.prototype.hasOwnProperty(bindingName)) {
			if (this.prototype[bindingName] === bindingType)
				return;
			
            throw "A global binding has already been defined for this property";
		}
            
        this.prototype[bindingName] = bindingType;
    };
	
	bindable.prototype.addGlobalBindingType = function (forProperty, parser) {
		return bindable.addGlobalBindingType.apply(this.constructor, arguments);
	};
    
    bindable.prototype.getGlobalParser = function (forProperty) {
        
        return this[parserPrefix + forProperty];
    };
    
    bindable.prototype.getGlobalBindingType = function (forProperty) {
        
        return this[bindingPrefix + forProperty];
    };
    
    bindable.getGlobalParser = function (forProperty) {
        
        return this.prototype[parserPrefix + forProperty];
    };
    
    bindable.getGlobalBindingType = function (forProperty) {
        
        return this.prototype[bindingPrefix + forProperty];
    };
	
    return bindable;
});