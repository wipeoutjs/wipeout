Class("wipeout.template.xmlParser", function () {
    
    function xmlParser() {
    }
    
    var $comment = {
        open:/<\!\-\-/,
        close: /\-\->/
    };
    var $sQuote = {
        open: /'/,
        close: /(?<!\\)(?:\\{2})*\K'/
    };
    var $dQuote = {
        open: /"/,
        close: /(?<!\\)(?:\\{2})*\K"/
    };
    
    xmlParser.parse = function(xmlString) {
        var char;
        while ((char = firstEscapeChar(xmlString)) != null) {
            
        }
    };
    
    function firstEscapeChar(input) {
        
        var results = [
            input.search($comment.open),
            input.search($sQuote.open),
            input.search($dQuote.open)
        ];
        
        var lowest = -1;
        for(var i = 0; i < 3; i++) {
            if(results[i] !== -1 && (results[i] < lowest || lowest === -1))
                lowest = i;
        }
        
        return lowest === -1 ? null : {
            type: i + 1,
            value: results[i]
        }
    }
    
    xmlParser.serialize = function(pseudoXmlElement) {
        
        throw "Not implemented";        
    };
    
    return xmlParser;
});