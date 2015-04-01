Class("wipeout.polyfills.Array", function () {
    
    var array = function() {
        ///<summary>Polyfill placeholder for Array</summary>
    };
    
    array.prototype.indexOf = function(searchElement, fromIndex) {
        ///<summary>Polyfill for Array.prototype.indexOf</summary>
        ///<param name="searchElement" type="Any" optional="false">The object to find</param>
        ///<param name="fromIndex" type="Number" optional="true">The index to start at</param>
        ///<returns type="Number">It's index</returns>
                
        for(var i = fromIndex || 0, ii = this.length; i < ii; i++)
            if(this[i] === searchElement)
                return i;
        
        return -1;
    };
    
    enumerateObj(array.prototype, function(item, i) {
        if(!Array.prototype[i])
            Array.prototype[i] = item;
    });
    
    return array;    
});