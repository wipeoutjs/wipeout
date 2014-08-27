Class("wipeout.template.xmlParser", function () {
    
    function xmlParser() {
    }
    
    
    var comment = {
        open: "<!--",
        close: "-->",
        escaped: false
    }, sQuote = {
        open: "'",
        close: "'",
        escaped: true
    }, dQuote = {
        open: "\"",
        close: "\"",
        escaped: true
    }, elementTag = {
        open: "<",
        close: ">",
        escaped: false
    }, closeElementTag = {
        open: ">",
        escaped: false
    }, attribute = {
    }, beginElement = {
    }, endElement = {
    }, incomplete = {
    };
    
    xmlParser.preCompileTags = {
        comment: comment,
        incomplete: incomplete,
        attribute: attribute,
        dQuote: dQuote,
        sQuote: sQuote
    };
    
    xmlParser._parseEscapedBlocks = function(xmlString) {
        
        var parts = [], startingPosition = 0, character;
        while ((character = xmlParser.firstEscapeChar(xmlString, startingPosition, [comment, elementTag])) != null) {
            
            if (character.begin - startingPosition > 0)
                parts.push({
                    position: startingPosition,
                    type: incomplete,
                    value: xmlString.substr(startingPosition, character.begin - startingPosition)
                });
            
            if (character.type === comment) {
                startingPosition = xmlParser.closeItem(xmlString, comment, character.begin, parts);
            } else if (character.type === elementTag) {
                while ((character = xmlParser.firstEscapeChar(xmlString, startingPosition, [comment, closeElementTag, sQuote, dQuote])) != null) {
                    
                    if (character.type === comment ||character.type === sQuote ||character.type === dQuote)
                        startingPosition = xmlParser.closeItem(xmlString, character.type, character.begin, parts);
                    else if (character.type === closeElementTag) {
                        parts.push({
                            position: startingPosition,
                            type: incomplete,
                            value: xmlString.substr(startingPosition, character.begin - startingPosition)
                        });
                        startingPosition = character.begin + 1;
                        break;
                    } else
                        throw "Internal error";
                }
            } else
                throw "Internal error";
        }
        
        if(xmlString.length - startingPosition > 0)
            parts.push({
                position: startingPosition,
                type: incomplete,
                value: xmlString.substr(startingPosition)
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
    
    xmlParser.closeItem = function(input, item, startingPosition, parts) {
        var i = input.indexOf(item.close, startingPosition + 4);
        
        var sp = startingPosition + item.open.length;
        while (true) {
            sp = input.indexOf(item.close, sp);
            if(sp === -1)
                throw {
                    error: "Cannot find closing tag to match comment at position: " + startingPosition,
                    xml: input
                };
            
            if (!item.escaped)
                break;            
            
            var escaped = 0;
            for(var i = sp -1; i >= 0; i--) {
                if(input[i] === "\\")
                    escaped ++;
                else
                    break;
            }

            if(escaped % 2 === 0)
                break;
            
            sp++;
        }      
        
        parts.push({
            type: item,
            value: input.substring(startingPosition + item.open.length, sp)
        });

        return sp + item.close.length;
    };
    
    xmlParser.firstEscapeChar = function(input, startingPosition, chars) {
        
        var position, output;
        wipeout.utils.obj.enumerateArr(chars, function(item) {
            if ((position = input.indexOf(item.open, startingPosition)) !== -1 && (!output || output.begin > position))
                output = {
                    type: item,
                    begin: position
                };
        });
        
        return output;
    };
    
    xmlParser.serialize = function(pseudoXmlElement) {
        
        throw "Not implemented";        
    };
    
    return xmlParser;
    
   /* xmlParser.closeComment = function(itemType, input, startingPosition, parts) {
        var i = input.indexOf("-->", startingPosition + item.open.length);
        
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
    };*/
});