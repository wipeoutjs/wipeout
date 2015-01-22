// name is subject to change

Class("wipeout.base.bindable", function () {
    
    var bindable = wipeout.base.watched.extend(function bindable() {
        ///<summary>An object whose properties can be bound to</summary>
        
        this._super();
        
        this.__woBag.disposables = {};
        this.__woBag.propertySettings = {};
    });
        
    var getGlobalProperty = function (forClass, forProperty) {
        
        bindable.globalSettings = bindable.globalSettings || new wipeout.base.utils.globalSettingsDictionary();
    
        var output;
        if (!(output = bindable.globalSettings.value(forClass)))
            bindable.globalSettings.add(forClass, output = {});
        
        return output[forProperty] || (output[forProperty] = {});
    };
    
    var parserPrefix = "__wipeoutGlobalParser_";
    
    // assuming this static function will be passed on via inheritance
    bindable.addGlobalParser = function (forProperty, parser) {
        
        if (typeof parser === "string") {
            var parsers = [];  
            enumerateArr(parser.split("-"), function(parser) {                
                if (wipeout.template.compiledInitializer.parsers[parser])
                    parsers.push(wipeout.template.compiledInitializer.parsers[parser]);
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
        
        if (typeof bindingType !== "string" || !wipeout.template.bindingTypes[bindingType])
            //TODO
            throw "Invalid binding type. Binding types must be either a string which points to wipeout binding type, or a function which will parse the data";
             
        var bindingName = bindingPrefix + forProperty;
        if (this.prototype.hasOwnProperty(bindingName))
            throw "A global binding has already been defined for this property";
            
        this.prototype[bindingName] = bindingType;
    };
    
    bindable.prototype.getGlobalParser = function (forProperty) {
        
        return this[parserPrefix + forProperty];
    };
    
    bindable.prototype.getGlobalBinding = function (forProperty) {
        
        return this[bindingPrefix + forProperty];
    };
    
    bindable.getGlobalParser = function (forProperty) {
        
        return this.prototype[parserPrefix + forProperty];
    };
    
    bindable.getGlobalBinding = function (forProperty) {
        
        return this.prototype[bindingPrefix + forProperty];
    };
    
    bindable.prototype.disposeOf = function(key) {
        ///<summary>Dispose of an item registered as a disposable</summary>
        ///<param name="key" type="String" optional="false">The key of the item to dispose</param>
        if(this.__woBag.disposables[key]) {
            this.__woBag.disposables[key]();
            delete this.__woBag.disposables[key];
        }
    };
    
    bindable.prototype.disposeOfAll = function() {
        ///<summary>Dispose of all items registered as a disposable</summary>
        for(var i in this.__woBag.disposables)
            this.disposeOf(i);
    };
    
    bindable.prototype.registerDisposeCallback = (function() {
        var i = 0;
        return function(disposeFunction) {
            ///<summary>Register a dispose function which will be called when this object is disposed of.</summary>
            ///<param name="disposeFunction" type="Function" optional="false">The function to call when on dispose</param>
            ///<returns type="String">A key to dispose off this object manually</returns>

            if(!disposeFunction || disposeFunction.constructor !== Function) throw "The dispose function must be a Function";

            var id = (++i).toString();            
            this.__woBag.disposables[id] = disposeFunction;            
            return id;
        };
    })();
    
    bindable.prototype.computed = function(name, callback, watchVariables, callbackStringOverride) {
        ///<summary>Do "delete obj.prop" functionality</summary>
        ///<param name="property" type="String" optional="false">The property name</param>
        ///<returns type="Boolean">The result of the delete</returns>
        
        var comp = this._super.apply(this, arguments);
        this.registerDisposable(comp);
        return comp;
    };
    
    bindable.prototype.observe = function(property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged) {
        ///<summary>Observe a property for change</summary>
        ///<param name="property" type="String" optional="false">The property</param>
        ///<param name="callback" type="Function" optional="false">The callback for property change</param>
        ///<param name="context" type="Any" optional="true">The context of the callback</param>
        ///<param name="evaluateOnEachChange" type="Boolean" optional="true">If set to true, will fire callback each time the property changes, rather than once, for the last time the property changed</param>
        ///<param name="evaluateIfValueHasNotChanged" type="Boolean" optional="true">If set to true, will fire callback if the new value is the same as the old value</param>
        ///<returns type="Object">A disposable object</returns>
        
        var obs = this._super.apply(this, arguments);
        this.registerDisposable(obs);
        return obs;
    };
    
    bindable.prototype.registerDisposable = function(disposableOrDisposableGetter) {
        ///<summary>An object with a dispose function to be disposed when this object is disposed of.</summary>
        ///<param name="disposableOrDisposableGetter" type="Function" optional="false">The function to dispose of on dispose, ar a function to get this object</param>
        ///<returns type="String">A key to dispose off this object manually</returns>
        
        if(!disposableOrDisposableGetter) throw "Invalid disposeable object";        
        if(disposableOrDisposableGetter.constructor === Function && !disposableOrDisposableGetter.dispose) disposableOrDisposableGetter = disposableOrDisposableGetter.call(this);        
        if(!disposableOrDisposableGetter || !(disposableOrDisposableGetter.dispose instanceof Function)) throw "The disposable object must have a dispose(...) function";

        return this.registerDisposeCallback(disposableOrDisposableGetter.dispose.bind(disposableOrDisposableGetter));
    };
    
    bindable.prototype.dispose = function() {
        ///<summary>Dispose of this bindable</summary>
        
        this.disposeOfAll();
    };
    
    return bindable;
});