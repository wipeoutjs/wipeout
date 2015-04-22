
Class("wipeout.base.bindable", function () {
	
    var bindable = busybody.observable.extend(function bindable() {
        ///<summary>An object which interacts with the wipeout template parser and defines parsers and bindings for specific properties</summary>
        
        this._super();
    });
    
    var parserPrefix = "__wipeoutGlobalParser_";
    
    // assuming this static function will be passed on via inheritance
    bindable.addGlobalParser = function (forProperty, parser) {
		///<summary>Add a global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<param name="parser" type="String|Function">The parser. Either a parser function (function (value, propertyName, renderContext) { }) or a pointer to a wipeout parser (wo.parsers)</param>
		 
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
		///<summary>Add a global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<param name="parser" type="String|Function">The parser. Either a parser function (function (value, propertyName, renderContext) { }) or a pointer to a wipeout parser (wo.parsers)</param>
		
		return bindable.addGlobalParser.apply(this.constructor, arguments);
	};
    
    var bindingPrefix = "__wipeoutGlobalBinding_";
    
    // assuming this static function will be passed on via inheritance
    bindable.addGlobalBindingType = function (forProperty, bindingType) {
		///<summary>Add a global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<param name="bindingType" type="String">The binding type. A pointer to a wipeout binding (wo.bindings)</param> wo.bindings</param>
		
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
		///<summary>Add a global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<param name="bindingType" type="String">The binding type. A pointer to a wipeout binding (wo.bindings)</param> wo.bindings</param>
		
		return bindable.addGlobalBindingType.apply(this.constructor, arguments);
	};
    
    bindable.prototype.getGlobalParser = function (forProperty) {
		///<summary>Get the global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<returns type="Function">The parser</returns>
        
        return this[parserPrefix + forProperty];
    };
    
    bindable.prototype.getGlobalBindingType = function (forProperty) {
		///<summary>Get the global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<returns type="String">A pointer to the binding type (wo.bindings)</returns>
        
        return this[bindingPrefix + forProperty];
    };
    
    bindable.getGlobalParser = function (forProperty) {
		///<summary>Get the global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<returns type="Function">The parser</returns>
        
        return this.prototype[parserPrefix + forProperty];
    };
    
    bindable.getGlobalBindingType = function (forProperty) {
		///<summary>Get the global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<returns type="String">A pointer to the binding type (wo.bindings)</returns>
        
        return this.prototype[bindingPrefix + forProperty];
    };
	
    return bindable;
});