Class("wipeout.polyfills.Function", function () {
    
    var _function = function() {
        ///<summary>Polyfill placeholder for Function</summary>
    };
    
    _function.prototype.bind = function(context) {
        ///<summary>Polyfill for Function.prototype.bind</summary>
        ///<param name="context" type="Any" optional="false">The object to bind</param>
        ///<returns type="Function">A bound function</returns>
		
		var func = this;
		return function () {
			return func.apply(context, arguments);
		};
    };
    
    enumerateObj(_function.prototype, function(item, i) {
        if(!Function.prototype[i])
            Function.prototype[i] = item;
    });
    
    return _function;    
});