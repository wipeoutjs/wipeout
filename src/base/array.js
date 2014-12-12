Class("wipeout.base.array", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    var array = wipeout.base.object.extend.call(Array, function array(initialValues) {
        
        Array.call(this);
        
        this.__woBag = {
            length: 0,
            simpleCallbacks: [],    // function (removed, added) { }
            complexCallbacks: []    // function (change) { }
        };
        
        this.__woBag.changes = new ap(this);
        
        if(initialValues) {
            enumerateArr(initialValues, function(val) {
                this.push(val);
            }, this);
            
            //TODO: this is hacky
            this.__woBag.changes._changes.length = 0;
        }
        
        if(useObjectObserve) {
            Array.observe(this, (function(changes) {
                enumerateArr(changes, this.__woBag.changes.push, this.__woBag.changes);
            }).bind(this));
        }
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

    array.prototype.replaceElement = function(index, replacement) {
        
        if (!useObjectObserve)
            this.__woBag.changes.push({
                name: index.toString(),
                object: this,
                oldValue: this[index],
                type: "update"
            });


        return this.alteringLength(function() {
            return this[index] = replacement;
        });
    };

    array.prototype.pop = function() {

        if (!useObjectObserve)
            if (this.__woBag.length)
                this.__woBag.changes.push({
                    addedCount: 0,
                    index: this.__woBag.length - 1,
                    object: this,
                    removed: [this[this.__woBag.length - 1]],
                    type: "splice"
                });

        return this.alteringLength(function() {
            return Array.prototype.pop.call(this);
        });
    };

    array.prototype.shift = function() {

        if (!useObjectObserve)
            if (this.__woBag.length)
                this.__woBag.changes.push({
                    addedCount: 0,
                    index: 0,
                    object: this,
                    removed: [this[0]],
                    type: "splice"
                });

        return this.alteringLength(function() {
            return Array.prototype.shift.call(this);
        });
    };

    array.prototype.push = function(item) {

        if (!useObjectObserve)
            this.__woBag.changes.push({
                addedCount: 1,
                index: this.__woBag.length,
                object: this,
                removed: [],
                type: "splice"
            });

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

            this.__woBag.changes.push({
                addedCount: arguments.length - 2,
                index: index,
                object: this,
                removed: removed,
                type: "splice"
            });
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

    //TODO: rename and move
    function ap (forArray) {
        this._changes = [];

        this.forArray = forArray;
    }

    ap.prototype.push = function(change) {
        this._changes.push(change);

        setTimeout((function() {
            this.go();
        }).bind(this));
    };

    ap.prototype.shift = function() {
        return this._changes.shift();
    };

    ap.prototype.go = function() {
        if (this.__going) return;

        this.__going = {
            added: [],
            removed: []
        };

        this._go();
    };

    ap.prototype._go = function() {
        var change = this.shift();
        if (!change) {
            this.finish();
            return;
        }

        var tmp, ch;
        if (change.type === "splice") {
            ch = change;
        } else if (!isNaN(tmp = parseInt(change.name))) {
            ch = {
                addedCount: 1,
                index: parseInt(change.name),
                removed: [change.oldValue]
            };
        } else if (change.name === "length") {
            // there will be a corresponding splice
            return;           
        }

        // splice added
        if (ch.addedCount) {
            for (var i = ch.index, ii = ch.addedCount + ch.index; i < ii; i++) {
                if ((tmp = this.__going.removed.indexOf(this.forArray[i])) !== -1)
                    this.__going.removed.splice(tmp, 1);
                else
                    this.__going.added.push(this.forArray[i]);
            }
        }

        // splice removed
        for (var i = 0, ii = ch.removed.length; i < ii; i++) {
            if ((tmp = this.__going.added.indexOf(ch.removed[i])) !== -1)
                this.__going.added.splice(i, 1);
            else
                this.__going.removed.push(ch.removed[i]);
        }

        setTimeout((function() {

            enumerateArr(this.forArray.__woBag.complexCallbacks, function(item) {
                item.callback.call(item.context, change);
            });

            this._go();
        }).bind(this));
    };

    ap.prototype.finish = function() {
        var vals = this.__going;
        delete this.__going;

        enumerateArr(this.forArray.__woBag.simpleCallbacks, function(item) {
            item.callback.call(item.context, vals.removed, vals.added);
        });            
    };
    
    //TODO: simple/complex
    array.prototype.observe = function (callback, context, complexCallback /*TODO*/) {
        
        var callbacks = complexCallback ? 
            this.__woBag.complexCallbacks : 
            this.__woBag.simpleCallbacks;
        
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
    
    return array;
});