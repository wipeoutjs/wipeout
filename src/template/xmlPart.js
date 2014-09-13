Class("wipeout.template.xmlPart", function () {  
        //TODO: move to seperate file
    function xmlPart(value, escaped) {
        
        this.value = value;        
        this.escaped = escaped;
        
        this.nextChars = [];
    }
    
    xmlPart.prototype.indexOf = function(string, startingPosition) {
        if (this.value instanceof RegExp) {
            //TODO: efficiencies
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
                //TODO: efficiencies
                length: this.value.length
            };
        }
    };
    
    return xmlPart;
});