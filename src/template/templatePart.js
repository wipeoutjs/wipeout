Class("wipeout.template.templatePart", function () {  
        //TODO: move to seperate file
    function templatePart(value, escaped) {
        
        this.value = value;        
        this.escaped = escaped;
        
        this.nextChars = [];
    }
    
    templatePart.prototype.indexOf = function(string, startingPosition) {
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
    
    return templatePart;
});