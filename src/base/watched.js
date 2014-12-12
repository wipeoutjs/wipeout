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
        ///<summary>Create a custom observe function. An observe function observes a property of the contextual object</summary>
        ///<param name="woBag" type="Object" optional="true">The __woBag to observe from. Defaults to this.__woBag</param>
        ///<param name="watchFunctionGetter" type="Function" optional="true">The watch function. Defaults to this.watch</param>
        ///<returns type="Function">The observe function</returns>
        
        return function(property, callback, context, evaluateOnEachChange, evaluateIfValueHasNotChanged) {
            ///<summary>Observe a property for change</summary>
            ///<param name="property" type="String" optional="false">The property</param>
            ///<param name="callback" type="Function" optional="false">The callback for property change</param>
            ///<param name="context" type="Any" optional="true">The context of the callback</param>
            ///<param name="evaluateOnEachChange" type="Boolean" optional="true">If set to true, will fire callback each time the property changes, rather than once, for the last time the property changed</param>
            ///<param name="evaluateIfValueHasNotChanged" type="Boolean" optional="true">If set to true, will fire callback if the new value is the same as the old value</param>
            ///<returns type="Object">A disposable object</returns>
            
            var disposeOfWatch = (watchFunction || this.watch).call(this, property);
            
            var _woBag = woBag || this.__woBag;
            if (!_woBag.watched)
                _woBag.watched = {
                    callbacks: {}
                };
            else if (!_woBag.watched.callbacks)
                _woBag.watched.callbacks = {};
            
            if (!_woBag.watched.callbacks[property])
                _woBag.watched.callbacks[property] = [];

            var cb = function (oldVal, newVal) {
                if(evaluateIfValueHasNotChanged || oldVal !== newVal)
                    callback.call(context, oldVal, newVal);
            }
            
            cb.evaluateOnEachChange = evaluateOnEachChange;
            _woBag.watched.callbacks[property].push(cb);
            
            return {
                dispose: function() {
                    var i;
                    if(_woBag.watched.callbacks[property]) {
                        while ((i = _woBag.watched.callbacks[property].indexOf(cb)) !== -1)
                            _woBag.watched.callbacks[property].splice(i, 1);

                        if(!_woBag.watched.callbacks[property].length) {
                            delete _woBag.watched.callbacks[property];
                            disposeOfWatch.dispose();
                        }
                    }
                }
            };
        }
    };
    
    var useObjectObserve = watched.useObjectObserve = Object.observe && wipeout.settings.useObjectObserve;
    
    watched.createWatchFunction = function(woBag, watchedProperties, usePrototype) {
        ///<summary>Create a custom watch function. A watch function is necessary in order to observe</summary>
        ///<param name="woBag" type="Object" optional="true">The __woBag to observe from. Defaults to this.__woBag</param>
        ///<param name="watchedProperties" type="Object" optional="true">A place to put watched property flags. Defaults to "this.constructor.prototype"</param>
        ///<param name="usePrototype" type="Boolean" optional="true">If set to true, will put accessors on the objects prototype rather than on the object.</param>
        ///<returns type="Function">The watch function</returns>
        
        if (useObjectObserve) {
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
            
            var _woBag = woBag || this.__woBag;
            _woBag.watched = _woBag.watched || {};
            
            if (_woBag.watched.dosposeOfObjectObserved) // using this as a flag also
                return _woBag.watched.dosposeOfObjectObserved;
            
            var observeFunction = (function(changes) {
                
                enumerateArr(changes, function(change) {
                    var i = wipeout.utils.changeHandler.instance.lastIndexOf(this, change.name);
                    if(i !== -1)
                        wipeout.utils.changeHandler.instance._changes[i].newVal = change.oldValue; //TODO, investigate and comment
                    
                    wipeout.utils.changeHandler.instance.push(this, change.name, _woBag, change.oldValue, this[change.name]);
                }, this);
            }).bind(this);
            
            Object.observe(this, observeFunction);
            return _woBag.watched.dosposeOfObjectObserved = {
                dispose: (function() {
                    
                    if(_woBag.watched.callbacks)
                        for(var i in _woBag.watched.callbacks)
                            return; // only dispose if all callbacks are gone
                    
                    delete _woBag.watched.dosposeOfObjectObserved;
                    Object.unobserve(this, observeFunction);
                }).bind(this)
            };
        };
    };
    
    function buildWoBag (woBag) {        
        if(!woBag.watched) {
            woBag.watched = {
                oldValues: {},
                callbacks: {}
            };
        } else { 
            woBag.watched.oldValues = woBag.watched.oldValues || {};
            woBag.watched.callbacks = woBag.watched.callbacks || {};
        }
    }
    
    var watchPrefix = "__wo-watch-";  
    watched.createPropertyAccessorWatchFunction = function(woBag, watchedProperties) {
        ///<summary>Create a custom watch function</summary>
        ///<param name="woBag" type="Object" optional="true">The woBag to observe from. Defaults to this.__woBag</param>
        ///<param name="watchedProperties" type="Object" optional="true">A place to put watched property flags. Defaults to "this.constructor.prototype"</param>
        ///<returns type="Function">The watch function</returns>
        
        return function(property) {
            ///<summary>Setup a property to be watched</summary>
            ///<param name="property" type="String" optional="false">The property name</param>
            ///<returns type="Object">A disposable object</returns>
            
            var _woBag = woBag || this.__woBag;
            var usePrototype = !watchedProperties;
            var _watchedProperties = watchedProperties || Object.getPrototypeOf(this);
            
            buildWoBag(_woBag);
            
            // do not re-define properties if they exist anywhere else on the property chain
            if (_watchedProperties[watchPrefix + property])
                return _watchedProperties[watchPrefix + property];
            
            if(this.hasOwnProperty(property)) {
                _woBag.watched.oldValues[property] = this[property];
                delete this[property];
            }
            
            Object.defineProperty(usePrototype ? _watchedProperties : this, property, {
                get: function() {
                    
                    return (woBag || this.__woBag).watched.oldValues[property];
                },
                set: function(value) {
                    var __woBag = woBag || this.__woBag;
                    
                    buildWoBag(__woBag);
                    
                    var old = __woBag.watched.oldValues[property];
                    __woBag.watched.oldValues[property] = value;
                    
                    if(__woBag.watched.callbacks[property])
                        wipeout.utils.changeHandler.instance.push(this, property, __woBag, old, value);
                },
                enumerable: true,
                configurable: !usePrototype
            });
            
            if (usePrototype) {
                // modifications to the prototype are permanent
                return _watchedProperties[watchPrefix + property] = {dispose: function(){}};
            } else {
                return _watchedProperties[watchPrefix + property] = {
                    dispose: (function() {
                        if (delete _watchedProperties[watchPrefix + property])
                            Object.defineProperty(this, property, {
                                value: this[property],
                                writable: true,
                                configurable: true
                            });
                    }).bind(this)
                };
            }
        };
    }
    
    watched.deleteFunction = function(property) {
        ///<summary>Do "delete obj.prop" functionality</summary>
        ///<param name="property" type="String" optional="false">The property name</param>
        ///<returns type="Boolean">The result of the delete</returns>
        
        if (!useObjectObserve)
            this[property] = undefined;
        
        return delete this[property];
    };
    
    watched.prototype.watch = watched.createWatchFunction(null, null, true);
    watched.prototype.observe = watched.createObserveFunction();
    watched.prototype.del = watched.deleteFunction;
                                      
    return watched;
});