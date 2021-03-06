Class("wipeout.wml.wmlPart", function () { 
	return function (){};
	
    function wmlPart(value, escaped) {
        
        this.value = value;        
        this.escaped = escaped;
        
        this.nextChars = [];
    }
    
    wmlPart.prototype.indexOf = function(string, startingPosition) {
        if (this.value instanceof RegExp) {
            //issue-#46
            if(startingPosition)
                string = string.substr(startingPosition);
            
            var index = string.search(this.value);
            if (index === -1)
                return null;
            
            return {
                index: startingPosition + index,
                length: string.match(this.value)[0].length
            };
            
        }  else {
            var val = string.indexOf(this.value, startingPosition);
            return val == -1 ? null : {
                index: val,
                //issue-#46
                length: this.value.length
            };
        }
    };
    
    return wmlPart;
});