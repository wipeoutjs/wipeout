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
    
    if (Object.observe) {
        watched.prototype.watch = function(property) {
            // This method is not needed for Object.observe.
        };
        
        watched.prototype.observe = function(property, callback, context) {
        };    
    // if Object.defineProperty works for all object types
    } else if ((function(){ try { Object.defineProperty({}, "a", {}); } catch(e) { return false; } }())) {
        
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
        
        watched.prototype.observe = function(property, callback, context) {
            
            this.watch(property);

            this.__woBag.propertyChanged.register(function(args) {
                // TODO: not the most performant way of doing this
                if(args.property === property) {
                    callback.call(context, args.oldValue, args.newValue);
                }
            });
        };
    } else {
        //TODO
    }
                                      
    return watched;
});