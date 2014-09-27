// name is subject to change

Class("wipeout.base.watched", function () {
    
    var watched = wipeout.base.object.extend(function watched() {
        ///<summary>An object whose properties can be subscribed to</summary>
        
        this._super();
                    
        this.__woBag = {
            watched: {},
            propertyChanged: wo.event()
        };
    });
    
    watched.prototype.__watching = {};
    
    watched.createObserveFunction = function(woBag, watchFunction) {
        ///<summary>Create a custom observe function</summary>
        ///<param name="woBag" type="Object" optional="true">The __woBag to observe from. Defaults to this.__woBag</param>
        ///<param name="watchFunctionGetter" type="Function" optional="true">The watch function. Defaults to this.watch</param>
        ///<returns type="Function">The observe function</returns>
        
        return function(property, callback, context) {
            ///<summary>Observe a property for change</summary>
            ///<param name="property" type="String" optional="false">The property</param>
            ///<param name="callback" type="Function" optional="false">The callback for property change</param>
            ///<param name="context" type="Any" optional="true">The context of the callback</param>
            ///<returns type="Object">A disposable object</returns>
            
            //TODO: do something with dispose object
            (watchFunction || this.watch).call(this, property);

            return (woBag || this.__woBag).propertyChanged.register(function(args) {
                // TODO: not the most performant way of doing this
                if(args.property === property) {
                    callback.call(context, args.oldValue, args.newValue);
                }
            });
        }
    };
    
    watched.createWatchFunction = function(woBag, watchedProperties, usePrototype) {
        ///<summary>Create a custom watch function</summary>
        ///<param name="woBag" type="Object" optional="true">The __woBag to observe from. Defaults to this.__woBag</param>
        ///<param name="watchedProperties" type="Object" optional="true">A place to put watched property flags. Defaults to "this.constructor.prototype"</param>
        ///<param name="usePrototype" type="Boolean" optional="true">If set to true, will put accessors on the objects prototype rather than on the object.</param>
        ///<returns type="Function">The watch function</returns>
        
        if (Object.observe && wipeout.settings.useObjectObserve) {
            return watched.createObjectObserveWatchFunction(woBag);
        // if Object.defineProperty works for all object types (IE8 works for dom elements only)
        } else if ((function(){ try { Object.defineProperty({}, "a", {}); return true; } catch(e) { return false; } }())) {
            return watched.createPropertyAccessorWatchFunction(woBag, watchedProperties, usePrototype);
        } else {
            return function() {
                console.error("Watching object properties is not supported in this browser. Please upgrade or consider using wipeout version 1");
            };
        }
    };
    
    watched.createObjectObserveWatchFunction = function(woBag) {
        ///<summary>Create a custom watch function</summary>
        ///<param name="woBag" type="Object" optional="true">The __woBag to observe from. Defaults to this.__woBag</param>
        ///<returns type="Function">The watch function</returns>
        
        return function(property, addToObjectDirectly) {
            ///<summary>Setup a property to be watched</summary>
            ///<param name="property" type="String" optional="false">The property name</param>
            ///<returns type="Object">A disposable object</returns>
            
            woBag = woBag || this.__woBag;
            if(woBag.dosposeOfObjectObserved) // using this as a flag also
                return woBag.dosposeOfObjectObserved;
            
            var observeFunction = (function(changes) {                
                enumerateArr(changes, function(change) {
                    woBag.propertyChanged.trigger({
                        property: change.name,
                        oldValue: change.oldValue,
                        newValue: this[change.name] //TODO, peek?
                    });
                }, this);                
            }).bind(this);
            
            Object.observe(this, observeFunction);
            return woBag.dosposeOfObjectObserved = {
                dispose: (function() {
                    Object.unobserve(this, observeFunction);
                }).bind(this)
            };
        };
    };
    
    var watchPrefix = "__wo-watch-";  
    watched.createPropertyAccessorWatchFunction = function(woBag, watchedProperties, usePrototype) {
        ///<summary>Create a custom watch function</summary>
        ///<param name="woBag" type="Object" optional="true">The __woBag to observe from. Defaults to this.__woBag</param>
        ///<param name="watchedProperties" type="Object" optional="true">A place to put watched property flags. Defaults to "this.constructor.prototype"</param>
        ///<param name="usePrototype" type="Boolean" optional="true">If set to true, will put accessors on the objects prototype rather than on the object.</param>
        ///<returns type="Function">The watch function</returns>
        
        return function(property) {
            ///<summary>Setup a property to be watched</summary>
            ///<param name="property" type="String" optional="false">The property name</param>
            ///<returns type="Object">A disposable object</returns>
            
            woBag = woBag || this.__woBag;
            watchedProperties = watchedProperties || Object.getPrototypeOf(this);
            
            // do not re-define properties if they exist anywhere else on the property chain
            if (watchedProperties[watchPrefix + property])
                return watchedProperties[watchPrefix + property];
            
            if(this.hasOwnProperty(property)) {
                woBag.watched[property] = this[property];
                delete this[property];
            }
            
            Object.defineProperty(usePrototype ? watchedProperties : this, property, {
                get: function() {
                    return woBag.watched[property];
                },
                set: function(value) {
                    var old = woBag.watched[property];
                    woBag.watched[property] = value;
                    
                    woBag.propertyChanged.trigger({
                        property: property,
                        oldValue: old,
                        newValue: value
                    });
                },
                enumerable: true,
                configurable: !usePrototype
            });
            
            if(usePrototype) {
                // modification to the prototype are permanent
                return {dispose: function(){}};
            } else {
                return watchedProperties[watchPrefix + property] = {
                    dispose: (function() {
                        Object.defineProperty(this, {
                            value: this[property], //TODO: peek?,
                            writable: true,
                            configurable: true
                        });
                    }).bind(this)
                };
            }
        };
    }
    
    watched.prototype.watch = watched.createWatchFunction(null, null, true);
    watched.prototype.observe = watched.createObserveFunction();
                                      
    return watched;
});