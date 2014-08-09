Class("wipeout.polyfills.Array", function () {
    
    var array = function() {
        ///<summary>Polyfill placeholder for Array</summary>
    };
    
    array.prototype.indexOf = function(obj) {
        ///<summary>Polyfill for Array.prototype.indexOf</summary>
        ///<param name="obj" type="Any" optional="false">The object to find</param>
        ///<returns type="Number">It's index</returns>
        
        for(var i = 0, ii = this.length; i < ii; i++)
            if(this[i] === obj)
                return i;
        
        return -1;
    };
    
    enumerateObj(array.prototype, function(item, i) {
        if(!Array.prototype[i])
            Array.prototype[i] = item;
    });
    
    return array;    
});