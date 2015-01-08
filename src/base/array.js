Class("wipeout.base.array", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    var array = wipeout.base.object.extend.call(Array, function array(initialValues) {
        
        Array.call(this);
        
        if (arguments.length)
            if (!(arguments[0] instanceof Array))
                throw "The initial values must be an array";
        
        this.__woBag = {
            length: initialValues ? initialValues.length : 0,
            watchedArray: {
                simpleCallbacks: [],    // function (removed, added) { }
                complexCallbacks: [],   // function (change) { }
                arrayCopy: []
            }  
        };
        
        if (initialValues) {
            for(var i = 0, ii = initialValues.length; i < ii; i++) {
                this[i] = initialValues[i]; // doing it this way as it will not publish changes
                this.__woBag.watchedArray.arrayCopy.push(initialValues[i]);
            }
        }
        
        if (useObjectObserve)
            Array.observe(this, (function(changes) {
                enumerateArr(changes, function(change) {
                    wipeout.change.handler.instance.pushArray(this, change, this.__woBag);
                }, this)
            }).bind(this));
    });
    
    array.prototype._super = wipeout.base.object.prototype._super;
    array.extend = wipeout.base.object.extend;
            
    function changeIndex(index) {
        if (typeof index === "number" && index % 1 === 0) {
            return index;
        } else if(index === null) {
            return 0;
        } else if (index instanceof Boolean) {
            return index ? 1 : 0;
        } else if (typeof index === "string" && !isNaN(index = parseFloat(index)) && index % 1 === 0) {
            return index;
        }

        return undefined;
    }

    Object.defineProperty(array.prototype, "length", {
        set: function(v) {
            v = changeIndex(v);            
            if (v === undefined) 
                throw RangeError("Invalid array length");

            if (v === this.__woBag.length)
                return;

            if(!this.__woBag.alteringLength) {
                if(v > this.__woBag.length) {
                    var args = new Array(v - this.length + 2);
                    args[0] = this.length;
                    args[1] = 0;
                    this.splice.apply(this, args);
                } else if(v < this.__woBag.length) {
                    this.splice(v, this.length - v);
                }
            }
            
            this.__woBag.length = v;
        },
        get: function() {
            return this.__woBag.length;
        }
    });   
    
    array.prototype.alteringLength = function(callback) {
        if (this.__woBag.alteringLength) {
            return callback.call(this);
        } else {
            try {
                this.__woBag.alteringLength = true;
                return callback.call(this);
            } finally {
                this.__woBag.alteringLength = false;
            }
        }
    };

    //TODO: test
    array.prototype.replace = function(index, replacement) {
        
        if (!useObjectObserve)
            wipeout.change.handler.instance.pushArray(this, {
                name: index.toString(),
                object: this,
                oldValue: this[index],
                type: "update"
            }, this.__woBag);


        return this.alteringLength(function() {
            return this[index] = replacement;
        });
    };

    array.prototype.pop = function() {

        if (!useObjectObserve)
            if (this.__woBag.length)
                wipeout.change.handler.instance.pushArray(this, {
                    addedCount: 0,
                    index: this.__woBag.length - 1,
                    object: this,
                    removed: [this[this.__woBag.length - 1]],
                    type: "splice"
                }, this.__woBag);

        return this.alteringLength(function() {
            return Array.prototype.pop.call(this);
        });
    };

    array.prototype.shift = function() {

        if (!useObjectObserve)
            if (this.__woBag.length)
                wipeout.change.handler.instance.pushArray(this, {
                    addedCount: 0,
                    index: 0,
                    object: this,
                    removed: [this[0]],
                    type: "splice"
                }, this.__woBag);

        return this.alteringLength(function() {
            return Array.prototype.shift.call(this);
        });
    };

    array.prototype.remove = function(item) {

        var i;
        if ((i = this.indexOf(item)) !== -1)
            this.splice(i, 1);
    };

    array.prototype.push = function(item) {

        if (!useObjectObserve)
            wipeout.change.handler.instance.pushArray(this, {
                addedCount: 1,
                index: this.__woBag.length,
                object: this,
                removed: [],
                type: "splice"
            }, this.__woBag);

        return this.alteringLength(function() {
            return Array.prototype.push.call(this, item);
        });
    };

    array.prototype.splice = function(index, removeCount, addItems) {

        if (!useObjectObserve) {
            var removed = [];
            for(var i = index, ii = removeCount + index > this.length ? this.length : removeCount + index; 
                i < ii; 
                i++)
                removed.push(this[i]);

            wipeout.change.handler.instance.pushArray(this, {
                addedCount: arguments.length - 2,
                index: index,
                object: this,
                removed: removed,
                type: "splice"
            }, this.__woBag);
        }

        var args = arguments;
        return this.alteringLength(function() {
            return Array.prototype.splice.apply(this, args);
        });
    };

    //TODO
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    
    //TODO: simple/complex
    array.prototype.observe = function (callback, context, complexCallback /*TODO*/) {
        
        var callbacks = complexCallback ? 
            this.__woBag.watchedArray.complexCallbacks : 
            this.__woBag.watchedArray.simpleCallbacks;
        
        var cb = {
            callback: callback, 
            context: context
        };
        
        callbacks.push(cb);
        
        var d = {
            dispose: function () {
                if(!d) return;
                
                d = undefined;
                
                for (var i = 0, ii = callbacks.length; i < ii; i++) {
                    if(callbacks[i] === cb) {
                        callbacks.splice(i, 1);
                        return;
                    }
                }
            }
        };
        
        return d;
    };
    
    array.prototype.dispose = function() {
        this.__woBag.watchedArray.complexCallbacks.length = 0;
        this.__woBag.watchedArray.simpleCallbacks.length = 0;
    }
    
    return array;
});