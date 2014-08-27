Class("wipeout.template.xmlParser", function () {
    
    function xmlParser() {
    }
    
    
    var comment = {
        open: "<!--",
        close: "-->"
    }, sQuote = {
        open: "'",
        close: "'",
        escaped: true
    }, dQuote = {
        open: "\"",
        close: "\"",
        escaped: true
    }, elementTag = {
        open: "'",
        close: "'",
        escaped: true
    }, attribute = {
    }, beginElement = {
    }, endElement = {
    }, incomplete = {
    };
    
    xmlParser.blockTypes = {
        comment: comment, 
        sQuote: sQuote, 
        dQuote: dQuote, 
        attribute: attribute, 
        beginElement: beginElement, 
        endElement: endElement, 
        incomplete: incomplete,
        elementTag: beginElementTag
    };
    
    xmlParser._parseEscapedBlocks = function(xmlString) {
        var character;
        var parts = [];
        var pos = 0;
        var insideElement = false;
        while ((character = xmlParser.firstEscapeChar(xmlString, pos, insideElement)) != null) {
            
            if (character.begin - pos > 0)
                parts.push({
                    position: pos,
                    type: incomplete,
                    value: xmlString.substr(pos, character.begin - pos)
                });
            
            if (character.type === comment)
                pos = xmlParser.closeComment(xmlString, character.begin, parts);
            else if (character.type === sQuote)
                pos = xmlParser.closeQuote(sQuote, xmlString, character.begin, parts);
            else if (character.type === dQuote)
                pos = xmlParser.closeQuote(dQuote, xmlString, character.begin, parts);
            else if (character.type === beginElementTag)
                insideElement = true;
            else if (character.type === endElementTag)
                insideElement = false;
            else
                throw "Internal error"; // firstEscapeChar(...) only searches for comment, sQuote and dQuote            
        }
        
        if(xmlString.length - pos > 0)
            parts.push({
                position: pos,
                type: incomplete,
                value: xmlString.substr(pos)
            });
        
        return parts;
    };
    
    var attrName = /\s*[a-zA-Z_\-]*(?=\s*=\s*$)/;
    xmlParser._createAttributes = function(parts) {
        
        for(var i = 0, ii = parts.length; i < ii; i++) {
            if (parts[i].type === sQuote || parts[i] === dQuote) {
                if(i < 1 || parts[i - 1].type !== incomplete || !parts[i - 1].value) throw "Invalid comment string: " + parts[i].value;
                
                var match = parts[i - 1].value.match(attrName);
                if(!match || !match.length) throw "Invalid comment string: " + parts[i].value;
                
                parts[i - 1].value = parts[i - 1].value.substr(0, match.index);
                parts[i].type = attribute;
                parts[i].key = match[0].replace(/^\s*/, "");
            }
        }
    };
    
    xmlParser.closeComment = function(input, startingPosition, parts) {
        var i = input.indexOf("-->", startingPosition + 4);
        
        if (i === -1)
            throw {
                error: "Cannot find closing tag to match comment at position: " + startingPosition,
                xml: input
            };
        
        parts.push({
            type: comment,
            value: input.substring(startingPosition + 4, i)
        });

        return i + 3;
    };
    
    xmlParser.closeQuote = function(quoteType, input, startingPosition, parts) {
        if(quoteType === sQuote)
            quoteType = "'";
        else if(quoteType === dQuote)
            quoteType = '"';
        else
            throw "Internal error"; // should only be used in this manner
        
        var sp = startingPosition;
        while(sp >= 0) {
            sp = input.indexOf(quoteType, sp + 1);
            var escaped = 0;
            for(var i = sp -1; i >= 0; i--) {
                if(input[i] === "\\")
                    escaped ++;
                else
                    break;
            }
            
            if(sp !== -1 && escaped % 2 === 0) {                
                parts.push({
                    type: sQuote,
                    value: input.substring(startingPosition + 1, sp)
                });

                return sp + 1;
            }
        }
        
        throw {
            error: "Cannot find closing quote to match quote at position: " + startingPosition,
            xml: input
        };
    };
    
    xmlParser.firstEscapeChar = function(input, startingPosition, includeQuotes) {
        var output = null;
        var position = input.indexOf("<!--", startingPosition);
        if(position !== -1)
            output = {
                type: comment,
                begin: position
            };
        
        var position = input.indexOf("<", startingPosition);
        if(position !== -1 && (!output || output.begin > position))
            output = {
                type: beginElementTag,
                begin: position
            };
        
        if(includeQuotes) {
            position = input.indexOf("'", startingPosition);
            if(position !== -1 && (!output || output.begin > position))
                output = {
                    type: sQuote,
                    begin: position
                };

            position = input.indexOf("\"", startingPosition);
            if(position !== -1 && (!output || output.begin > position))
                output = {
                    type: dQuote,
                    begin: position
                };
        }
        
        return output;
    };
    
    xmlParser.serialize = function(pseudoXmlElement) {
        
        throw "Not implemented";        
    };
    
    return xmlParser;
});