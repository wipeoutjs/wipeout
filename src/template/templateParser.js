
//http://www.w3.org/TR/html-markup/syntax.html
Class("wipeout.template.templateParser", function () {  
    
    function templateParser(templateString) {
        
        var preParsed = templateParser.preParse(templateString);
        var root = new wipeout.template.rootTemplateElement();        
        templateParser._parseTheEther(preParsed, root, 0);
        return root;
    }
    
    // for unit testing
    templateParser.specialTags = {};
    var whiteSpace = templateParser.specialTags.whiteSpace = new wipeout.template.templatePart(/\s+/, false); //NOTE: \s includes newlines
    var equals = templateParser.specialTags.equals = new wipeout.template.templatePart(/\s*=\s*/, false);
    var openSQuote = templateParser.specialTags.openSQuote = new wipeout.template.templatePart("'", false);
    var closeSQuote = templateParser.specialTags.closeSQuote = new wipeout.template.templatePart("'", "\\");
    var openDQuote = templateParser.specialTags.openDQuote = new wipeout.template.templatePart('"', false);
    var closeDQuote = templateParser.specialTags.closeDQuote = new wipeout.template.templatePart('"', "\\");
    var openTag1 = templateParser.specialTags.openTag1 = new wipeout.template.templatePart("<", false);
    var openTag2 = templateParser.specialTags.openTag2 = new wipeout.template.templatePart("</", false);
    var closeTag1 = templateParser.specialTags.closeTag1 = new wipeout.template.templatePart(">", false);
    var closeTag2 = templateParser.specialTags.closeTag2 = new wipeout.template.templatePart("/>", false);
    var openComment = templateParser.specialTags.openComment = new wipeout.template.templatePart("<!--", false);
    var closeComment = templateParser.specialTags.closeComment = new wipeout.template.templatePart("-->", false);
    
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
    
    templateParser.findFirstInstance = function(input, startingPosition, items) {
        
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
                        var o = templateParser.findFirstInstance(input, position.index + 1, [item]);
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
    
    templateParser.preParse = function(input, beginWith /* optional */, startAtChar /* optional */, output /* optional */) {
        
        // begin in the ether
        beginWith = beginWith || {nextChars: inTheEther};
        startAtChar = startAtChar || 0;
        
        output = output || [];
        var first = templateParser.findFirstInstance(input, startAtChar, beginWith.nextChars);
        
        if(!first) {
            if(input.length > startAtChar)
                output.push(input.substr(startAtChar));
        } else {        
            if(first.index > startAtChar)
                output.push(input.substring(startAtChar, first.index));

            output.push(first.type);
            templateParser.preParse(input, first.type, first.index + first.length, output);
        }
        
        return output;
    };
    
    templateParser.preParse = function(input) {
        
        // begin in the ether
        var item = {type: {nextChars: inTheEther}}, i = 0, output = [];        
        while (true) {
            item = templateParser.findFirstInstance(input, i, item.type.nextChars);
            
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
    
    var validateAttrName = /^.+=$/;
    var equals = "=";
    templateParser._createAttribute = function(preParsed, startAt) {
        var i = startAt;
        if(typeof preParsed[i] !== "string")
            //TODO
            throw {
                message: "Cannot create template attribute"
            };
        
        var name = preParsed[i];
        i++;
        if (preParsed[i] === whiteSpace) { 
            i++;
            if(preParsed[i] === equals) {
                name += equals;
                i++;
                if (preParsed[i] === whiteSpace)
                    i++;
            }
        }
        
        if(!validateAttrName.test(name))
            //TODO
            throw {
                message: "Cannot create template attribute"
            };
        
        // do not need to check if opening quote matches closing. Preparser chceks this
        if ((preParsed[i] === openDQuote || preParsed[i] === openSQuote)) {
            if (typeof preParsed[i + 1] === "string" &&
            (preParsed[i + 2] === closeDQuote || preParsed[i + 2] === closeSQuote)) {
                return {
                    index: i + 3,
                    name: name.substr(0, name.length - 1),
                    value: new wipeout.template.templateAttribute(preParsed[i + 1], preParsed[i] === openDQuote ? '"' : "'")
                };
            } else if (preParsed[i + 1] === closeDQuote || preParsed[i + 1] === closeSQuote) {
                return {
                    index: i + 2,
                    name: name.substr(0, name.length - 1),
                    value: new wipeout.template.templateAttribute("", preParsed[i] === openDQuote ? '"' : "'")
                };
            }
        }
        
        //TODO
        throw {
            message: "Cannot create template attribute"
        };
    };
        
    var validateTagName = /^[a-zA-Z0-9\-]+$/;    
    templateParser._createHtmlElement = function(preParsed, startIndex, parentElement) {
        
        var i = startIndex;
        if (preParsed[i] !== openTag1)
            //TODO
            throw {
                message: "Cannot create template element"
            };
        
        i++;
        
        // skip whitespace
        if (preParsed[i] === whiteSpace)
            i++;
        
        // validate name
        if(!validateTagName.test(preParsed[i]))
            //TODO
            throw {
                message: "Cannot create template element"
            };
        
        // create element
        var element = new wipeout.template.templateElement(preParsed[i], parentElement);
        parentElement.push(element);
        i++;
        
        for(var ii = preParsed.length; i < ii; i++) {
                        
            if (preParsed[i] === closeTag1 || preParsed[i] === closeTag2 ||
                (preParsed[i] === whiteSpace && (preParsed[i + 1] === closeTag1 || preParsed[i + 1] === closeTag2))) {
                
                if(preParsed[i] === whiteSpace) i++;
                
                element.inline = preParsed[i] === closeTag2;
                i++;
                
                return element.inline ? i : templateParser._parseTheEther(preParsed, element, i);
            }
            
            if(preParsed[i] !== whiteSpace) {
                //TODO
                throw {
                    message: "Cannot create template element"
                };
            }
            
            var attr = templateParser._createAttribute(preParsed, i + 1);
            i = attr.index - 1; // -1 for loop++
            element.attributes[attr.name] = attr.value;
        }
        
        return i;
    };
    
    templateParser._parseTheEther = function(preParsed, rootElement, startIndex) {
        
        for(var i = startIndex, ii = preParsed.length; i < ii; i++) {
            if (typeof preParsed[i] === "string") {
                
                rootElement.push(preParsed[i]);
            } else if(preParsed[i] === openComment) {
                
                if (preParsed[i + 1] === closeComment) {
                    rootElement.push(new wipeout.template.templateComment(""));
                    i++;
                } else if (typeof preParsed[i + 1] === "string" && preParsed[i + 2] === closeComment) {
                    rootElement.push(new wipeout.template.templateComment(preParsed[i + 1]));
                    i+=2;
                } else {
                    //TODO
                    throw {
                        message: "Cannot find closing comment tag"
                    };
                }
            } else if (preParsed[i] === openTag1) {
                
                i = templateParser._createHtmlElement(preParsed, i, rootElement) - 1; // -1 to compensate for loop++
            } else if (preParsed[i] === openTag2) {
                
                // there won't be any whitespace special characters in a closing tag                
                if (rootElement.name && typeof preParsed[i + 1] === "string" && preParsed[i + 2] === closeTag1) {
                    if(rootElement.name === wipeout.utils.obj.trim(preParsed[i + 1]))
                        return i + 3; // skip <, "name" and >
                    
                    //TODO
                    throw {
                        message: "Invalid closing tag"
                    };
                } else {
                    //TODO
                    throw {
                        message: "Invalid closing tag"
                    };
                }
            } else {
                //TODO
                throw {
                    message: "Invalid template"
                };
            }
        } 
        
        return i;
    };
    
    return templateParser;
});