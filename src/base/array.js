
Class("wipeout.base.array", function () {
        
    wipeout.base.object.extend.call(Array, function array() { 
        Array.call(this);
        
        this.__woBag = {
            length: 0
        };
    });
    
    array.changeIndex = function(index) {
        if (index instanceof Number && index % 1 === 0) {
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
                
            v = array.changeIndex(v);            
            if (v === undefined) 
                throw RangeError("Invalid array length");
            
            if (v === this.__woBag.length)
                return;
            
            if(v > this.__woBag.length) {
                this.signal([{
                    addedCount: v - this.__woBag.length,
                    index: this.__woBag.length,
                    object: this,
                    removed: [],
                    type: "splice"
                }]);
            } else {
                var removed = [];
                for(var i = v, ii = this.__woBag.length; i < ii; i++)
                    removed.push(this[i]);
                
                this.signal([{
                    addedCount: 0,
                    index: v,
                    object: this,
                    removed: removed,
                    type: "splice"
                }]);
            }
            
            this.__woBag.length = v;            
        },
        get: function() {
            return this.__woBag.length;
        }
    });

    array.protoype.replaceElement = function(index, replacement) {
                
        this.signal([{
            name: index.toString(),
            object: this,
            oldValue: this[index],
            type: "update"
        }]);
        
        return this[index] = replacement;
    };

    array.protoype.pop = function() {
           
        if (this.__woBag.length) {
            this.signal([{
                addedCount: 0,
                index: this.__woBag.length - 1,
                object: this,
                removed: [this[this.__woBag.length - 1]],
                type: "splice"
            }]);
        }
        
        return Array.prototype.pop.call(this);
    };

    array.protoype.push = function() {
           
        this.signal([{
            addedCount: 1,
            index: this.__woBag.length,
            object: this,
            removed: [],
            type: "splice"
        }]);
        
        return Array.prototype.push.call(this);
    };

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    
    array.prototype._signal = function(values) {
    };
    
    array.prototype.signal = function(values) {
        
        if(!this.__woBag.cache)
            this.__woBag.cache = [];
        
        var signalToken = this.__woBag.signalToken = {};
        
        for (var i = 0, ii = values.length; i < ii; i++)
            this.__woBag.cache.push(values[0]);
        
        setTimeout((function() {
            if(signalToken === this.__woBag.signalToken) {
                var cache = this.__woBag.cache;
                delete this.__woBag.cache;
                this._signal(cache);
            }
        }).bind(this), 10);
    };
});





















