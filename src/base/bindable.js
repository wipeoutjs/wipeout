// name is subject to change

//TODO: rename
Class("wipeout.base.bindable", function () {
    
    var bindable = wipeout.base.observable.extend(function bindable() {
        ///<summary>An object whose properties can be bound to</summary>
        
        this._super();
    });
    
    var parserPrefix = "__wipeoutGlobalParser_";
    
    // assuming this static function will be passed on via inheritance
    bindable.addGlobalParser = function (forProperty, parser) {
        
        if (typeof parser === "string") {
            var parsers = [];  
            enumerateArr(parser.split("-"), function(parser) {                
                if (wipeout.template.parsers[parser])
                    parsers.push(wipeout.template.parsers[parser]);
                else
                    //TODO
                    throw "Invalid parser. Parsers must be either a string which points to wipeout parser, or a function which will parse the data";
            });
            
            if (parsers.length === 0)
                return;
            else if (parsers.length === 1)
                parser = parsers[0];
            else
                parser = function (value, propertyName, renderContext) {
                    enumerateArr(parsers, function(p) {
                        value = p(value, propertyName, renderContext);
                    });
                    
                    return value;
                }
            
        } else if (!parser || parser.constructor !== Function) {
            //TODO
            throw "Invalid parser. Parsers must be either a string which points to wipeout parser, or a function which will parse the data";
        }
        
        var parserName = parserPrefix + forProperty;      
        if (this.prototype.hasOwnProperty(parserName)) {
            var p = this.prototype[parserName];
            this.prototype[parserName] = function (value, propertyName, renderContext) {
                return parser(p(value, propertyName, renderContext), propertyName, renderContext);
            };
        } else {
            this.prototype[parserName] = parser;
        }
    };
    
    var bindingPrefix = "__wipeoutGlobalBinding_";
    
    // assuming this static function will be passed on via inheritance
    bindable.addGlobalBindingType = function (forProperty, bindingType) {
        
        if (typeof bindingType !== "string" || !wipeout.htmlBindingTypes[bindingType])
            //TODO
            throw "Invalid binding type. Binding types must be a string which points to wipeout binding type";
             
        var bindingName = bindingPrefix + forProperty;
        if (this.prototype.hasOwnProperty(bindingName))
            throw "A global binding has already been defined for this property";
            
        this.prototype[bindingName] = bindingType;
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