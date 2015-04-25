
//http://www.w3.org/TR/html-markup/syntax.html
Class("wipeout.wml.wmlParser_experimental", function () {
	
	return function(){};
    		
	function parse (htmlElement) {

		var output = new wipeout.wml.wmlElement(htmlElement.localName);
		for (var i = 0, ii = htmlElement.childNodes.length; i < ii; i++) {
			if (htmlElement.childNodes[i].nodeType === 1)
				output.push(parse(htmlElement.childNodes[i]));
			if (htmlElement.childNodes[i].nodeType === 8)
				output.push(new wipeout.wml.wmlComment(htmlElement.childNodes[i].textContent));
			if (htmlElement.childNodes[i].nodeType === 3)
				output.push(new wipeout.wml.wmlString(htmlElement.childNodes[i].textContent));
		}

		for (var i = 0, ii = htmlElement.attributes.length; i < ii; i++)
			output.attributes[htmlElement.attributes[i].name] = new wipeout.wml.wmlAttribute(htmlElement.attributes[i].value, '"');

		return output;
	}
	
    function wmlParser(wmlString) {
                
        var preParsed = wmlParser.preParse(wmlString);
        var root = new wipeout.wml.wmlElement("root");        
        wmlParser._parseTheEther(preParsed, root, 0);
        return root;
    }
    
    // for unit testing
    wmlParser.specialTags = {};
    var whiteSpace = wmlParser.specialTags.whiteSpace = new wipeout.wml.wmlPart(/\s+/, false); //NOTE: \s includes newlines
    var equals = wmlParser.specialTags.equals = new wipeout.wml.wmlPart(/\s*=\s*/, false);
    var openSQuote = wmlParser.specialTags.openSQuote = new wipeout.wml.wmlPart("'", false);
    var closeSQuote = wmlParser.specialTags.closeSQuote = new wipeout.wml.wmlPart("'", "\\");
    var openDQuote = wmlParser.specialTags.openDQuote = new wipeout.wml.wmlPart('"', false);
    var closeDQuote = wmlParser.specialTags.closeDQuote = new wipeout.wml.wmlPart('"', "\\");
    var openTag1 = wmlParser.specialTags.openTag1 = new wipeout.wml.wmlPart("<", false);
    var openTag2 = wmlParser.specialTags.openTag2 = new wipeout.wml.wmlPart("</", false);
    var closeTag1 = wmlParser.specialTags.closeTag1 = new wipeout.wml.wmlPart(">", false);
    var closeTag2 = wmlParser.specialTags.closeTag2 = new wipeout.wml.wmlPart("/>", false);
    var openComment = wmlParser.specialTags.openComment = new wipeout.wml.wmlPart("<!--", false);
    var closeComment = wmlParser.specialTags.closeComment = new wipeout.wml.wmlPart("-->", false);
    
    // order is important
    var insideTag = [openSQuote, openDQuote, closeTag1, closeTag2, equals, whiteSpace];
    var inTheEther = [openComment, openTag2, openTag1];
    
    enumerateArr(insideTag, function(item) { // \s
        whiteSpace.nextChars.push(item);
    });
    
    enumerateArr(insideTag, function(item) { // =
        equals.nextChars.push(item);
    });
    
    openSQuote.nextChars.push(closeSQuote); // open - '
    
    enumerateArr(insideTag, function(item) { // close - '
        closeSQuote.nextChars.push(item);
    });
    
    openDQuote.nextChars.push(closeDQuote); // open - "
    
    enumerateArr(insideTag, function(item) { // close - "
        closeDQuote.nextChars.push(item);
    });
    
    enumerateArr(insideTag, function(item) { // open - <
        openTag1.nextChars.push(item);
    });
    
    openTag2.nextChars.push(closeTag1); // open - </
    
    enumerateArr(inTheEther, function(item) { // close - >
        closeTag1.nextChars.push(item);
    });
    
    enumerateArr(inTheEther, function(item) { // close - />
        closeTag2.nextChars.push(item);
    });
    
    openComment.nextChars.push(closeComment); // open - <!--
        
    enumerateArr(inTheEther, function(item) { // close - -->
        closeComment.nextChars.push(item);
    }); 
    
    wmlParser.findFirstInstance = function(input, startingPosition, items) {
        
        var position, output, i, count;
        wipeout.utils.obj.enumerateArr(items, function(item) {
            if ((position = item.indexOf(input, startingPosition)) && (!output || output.index > position.index)) {
                
                if(item.escaped) {
                    count = 0;
                    var l = item.escaped.length;
                    for (i = position.index - l; i > startingPosition; i-=l) {
                        if (i >= 0 && input.substr(i, l) === item.escaped)
                            count++;
                        else
                            break;
                    }
                    
                    // try find next
                    if(count % 2 != 0) {
                        var o = wmlParser.findFirstInstance(input, position.index + 1, [item]);
                        if (o && (!output || o.index < output.index))
                            output = o;
                        
                        return; // continue;
                    }
                }
                
                output = {
                    type: item,
                    index: position.index,
                    length: position.length
                };
            }
        });
        
        return output;
    };
    
    wmlParser.preParse = function(input) {
        
        // begin in the ether
        var item = {type: {nextChars: inTheEther}}, i = 0, output = [];        
        while (true) {
            item = wmlParser.findFirstInstance(input, i, item.type.nextChars);
            
            if(!item) {
                if(input.length > i)
                    output.push(input.substr(i));
                
                break;
            } else {
                
                if(item.index > i)
                    output.push(input.substring(i, item.index));

                output.push(item.type);
                i = item.index + item.length;
            }
        }
        
        return output;
    };
    
    wmlParser._createAttribute = function(preParsed, startAt) {
        var i = startAt;
        if(typeof preParsed[i] !== "string")
            //TODE
            throw {
                message: "Cannot create template attribute"
            };
                
        var name = preParsed[i];
        i++;
        if (preParsed[i] === whiteSpace || preParsed[i] === closeTag1 || preParsed[i] === closeTag2) 
            return {
                index: i,
                name: name,
                value: new wipeout.wml.wmlAttribute(null, null)
            }; // <tag attr />
        
        if (preParsed[i] === equals) {
            i++;
            if(typeof preParsed[i] === "string")
                return {
                    index: i + 1,
                    name: name,
                    value: new wipeout.wml.wmlAttribute(preParsed[i], null)
                }; // <tag attr=something />
            
            if (preParsed[i] === openDQuote || preParsed[i] === openSQuote) {
                i++;
                // do not need to check if opening quote matches closing. Preparser chceks this
                if (typeof preParsed[i] === "string" && (preParsed[i + 1] === closeDQuote || preParsed[i + 1] === closeSQuote))
                    return {
                        index: i + 2,
                        name: name,
                        value: new wipeout.wml.wmlAttribute(preParsed[i], preParsed[i + 1] === closeDQuote ? '"' : "'")
                    };// <tag attr="something" attr='something' />
                
                if (preParsed[i] === closeDQuote || preParsed[i] === closeSQuote)
                    return {
                        index: i + 1,
                        name: name,
                        value: new wipeout.wml.wmlAttribute("", preParsed[i] === closeDQuote ? '"' : "'")
                    };// <tag attr="something" attr='something' />
            }
        } 
        
        //TODE
        throw {
            message: "Cannot create template attribute"
        };
    };
        
    wmlParser._createHtmlElement = function(preParsed, startIndex, parentElement) {
        
        var i = startIndex;
        if (preParsed[i] !== openTag1)
            //TODE
            throw {
                message: "Cannot create template element"
            };
        
        i++;
        
        // skip whitespace
        if (preParsed[i] === whiteSpace)
            i++;
        
        // validate name
        if(typeof preParsed[i] !== "string" || !preParsed[i].length)
            //TODE
            throw {
                message: "Cannot create template element"
            };
        
        // create element
        var element = new wipeout.wml.wmlElement(preParsed[i], parentElement);
        parentElement.push(element);
        i++;
        
        for(var ii = preParsed.length; i < ii; i++) {
                        
            if (preParsed[i] === closeTag1 || preParsed[i] === closeTag2 ||
                (preParsed[i] === whiteSpace && (preParsed[i + 1] === closeTag1 || preParsed[i + 1] === closeTag2))) {
                
                if(preParsed[i] === whiteSpace) i++;
                
                element.inline = preParsed[i] === closeTag2;
                i++;
                
                return element.inline ? i : wmlParser._parseTheEther(preParsed, element, i);
            }
            
            if(preParsed[i] !== whiteSpace) {
                //TODE
                throw {
                    message: "Cannot create template element"
                };
            }
            
            var attr = wmlParser._createAttribute(preParsed, i + 1);
            i = attr.index - 1; // -1 for loop++
            element.attributes[attr.name] = attr.value;
        }
        
        return i;
    };
    
    wmlParser._parseTheEther = function(preParsed, rootElement, startIndex) {
        
        for(var i = startIndex, ii = preParsed.length; i < ii; i++) {
            if (typeof preParsed[i] === "string") {
                
                rootElement.push(new wipeout.wml.wmlString(preParsed[i]));
            } else if(preParsed[i] === openComment) {
                
                if (preParsed[i + 1] === closeComment) {
                    rootElement.push(new wipeout.wml.wmlComment(""));
                    i++;
                } else if (typeof preParsed[i + 1] === "string" && preParsed[i + 2] === closeComment) {
                    rootElement.push(new wipeout.wml.wmlComment(preParsed[i + 1]));
                    i+=2;
                } else {
                    //TODE
                    throw {
                        message: "Cannot find closing comment tag"
                    };
                }
            } else if (preParsed[i] === openTag1) {
                
                i = wmlParser._createHtmlElement(preParsed, i, rootElement) - 1; // -1 to compensate for loop++
            } else if (preParsed[i] === openTag2) {
                
                // there won't be any whitespace special characters in a closing tag                
                if (rootElement.name && typeof preParsed[i + 1] === "string" && preParsed[i + 2] === closeTag1) {
                    if(rootElement.name === wipeout.utils.obj.trim(preParsed[i + 1]))
                        return i + 3; // skip <, "name" and >
                    
                    //TODE
                    throw {
                        message: "Invalid closing tag"
                    };
                } else {
                    //TODE
                    throw {
                        message: "Invalid closing tag"
                    };
                }
            } else {
                //TODE
                throw {
                    message: "Invalid template"
                };
            }
        } 
        
        return i;
    };
    
    return wmlParser;
});