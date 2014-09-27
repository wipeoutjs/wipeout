// name is subject to change

Class("wipeout.base.watched", function () {
    
    var watched = wipeout.base.object.extend(function watched(initialValues, woBagIsEnumerable) {
        ///<summary>An object whose properties can be subscribed to</summary>   
        this._super();
        
        if(initialValues)
            wipeout.utils.obj.extend(this, initialValues);
        
        var woBag = {
            watched: {},
            propertyChanged: wo.event()
        };
            
        // __woBag should be private, however this has performance penalties, especially in IE
        // in practice the woBagIsEnumerable flag will be set by wipeout only
        if(woBagIsEnumerable) {
            this.__woBag = woBag;
        } else {
            Object.defineProperty(this, '__woBag', {
                enumerable: false,
                configurable: false,
                value: woBag,
                writable: false
            });
        }
    });
    
    watched.prototype.__watching = {};
    
    watched.prototype.observe = function(property, callback, context) {

        this.watch(property);

        this.__woBag.propertyChanged.register(function(args) {
            // TODO: not the most performant way of doing this
            if(args.property === property) {
                callback.call(context, args.oldValue, args.newValue);
            }
        });
    };
    
    if (false) {//(Object.observe) {
        watched.prototype.watch = function(property) {
            // This method is not needed for Object.observe.
            
            if(this.__woBag.objectObserved)
                return;
            
            this.__woBag.objectObserved = true;
            Object.observe(this, (function(changes) {
                
                enumerateArr(changes, function(change) {
                    this.__woBag.propertyChanged.trigger({
                        property: change.name,
                        oldValue: change.oldValue,
                        newValue: this[change.name] //TODO, peek?
                    });
                }, this);
                
            }).bind(this));
        };
    // if Object.defineProperty works for all object types (IE8 works for dom elements only)
    } else if ((function(){ try { Object.defineProperty({}, "a", {}); return true; } catch(e) { return false; } }())) {
        
        var watchPrefix = "__wo-watch-";        
        watched.prototype.watch = function(property) {
            
            // do not re-define properties if they exist anywhere else on the property chain
            if(this.constructor.prototype[watchPrefix + property])
                return;
            
            this.constructor.prototype[watchPrefix + property] = true;
            
            if(this.hasOwnProperty(property)) {
                this.__woBag.watched[property] = this[property];
                delete this[property];
            }
            
            Object.defineProperty(this.constructor.prototype, property, {
                get: function() {
                    return this.__woBag.watched[property];
                },
                set: function(value) {
                    var old = this.__woBag.watched[property];
                    this.__woBag.watched[property] = value;
                    
                    this.__woBag.propertyChanged.trigger({
                        property: property,
                        oldValue: old,
                        newValue: value
                    });
                },
                enumerable: true
            });
        }
    } else {
        //TODO: console.error
    }
                                      
    return watched;
});