

Class("wipeout.template.xmlParser", function () {  
    
    function xmlParser(xmlString) {
        
        var preParsed = xmlParser.preParse(xmlString);
        var root = new wipeout.template.rootXmlElement();        
        xmlParser.parseTheEther(preParsed, root, 0);
        return root;
    }    
    xmlParser.parse2 = function(preParsed) {
        
        var root = new wipeout.template.rootXmlElement();        
        xmlParser.parseTheEther(preParsed, root, 0);
        return root;
    };
    
    // for unit testing
    xmlParser.specialTags = {};
    var whiteSpace = xmlParser.specialTags.whiteSpace = new wipeout.template.xmlPart(/\s+/, false); //NOTE: \s includes newlines
    var openSQuote = xmlParser.specialTags.openSQuote = new wipeout.template.xmlPart("'", false);
    var closeSQuote = xmlParser.specialTags.closeSQuote = new wipeout.template.xmlPart("'", "\\");
    var openDQuote = xmlParser.specialTags.openDQuote = new wipeout.template.xmlPart('"', false);
    var closeDQuote = xmlParser.specialTags.closeDQuote = new wipeout.template.xmlPart('"', "\\");
    var openTag1 = xmlParser.specialTags.openTag1 = new wipeout.template.xmlPart("<", false);
    var openTag2 = xmlParser.specialTags.openTag2 = new wipeout.template.xmlPart("</", false);
    var closeTag1 = xmlParser.specialTags.closeTag1 = new wipeout.template.xmlPart(">", false);
    var closeTag2 = xmlParser.specialTags.closeTag2 = new wipeout.template.xmlPart("/>", false);
    var openComment = xmlParser.specialTags.openComment = new wipeout.template.xmlPart("<!--", false);
    var closeComment = xmlParser.specialTags.closeComment = new wipeout.template.xmlPart("-->", false);
    
    // order is important
    var insideTag = [openSQuote, openDQuote, closeTag1, closeTag2, whiteSpace];
    var inTheEther = [openComment, openTag2, openTag1];
    
    enumerateArr(insideTag, function(item) { // \s
        whiteSpace.nextChars.push(item);
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
        
    xmlParser.distillElementName = function(input) {
        var name = input.search(/\s/);
        name = name !== -1 ? input.substring(0, name) : input;
        
        return name.length && name.indexOf("=") === -1 ?
            name :
            null;
    };
    
    var attr = /\s+.*=\s*$/, eq = /=/g, sp = /\s/g;    
    xmlParser.distillAttributeName = function(input) {
        var name = input.match(attr);
        name = (name && name.length ? name[0] : "").replace(eq, "").replace(sp, "");
        
        return name.length ? name : null;
    };
    
    xmlParser.findFirstInstance = function(input, startingPosition, items) {
        
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
                        var o = xmlParser.findFirstInstance(input, position.index + 1, [item]);
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
    
    xmlParser.preParse = function(input, beginWith /* optional */, startAtChar /* optional */, output /* optional */) {
        
        // begin in the ether
        beginWith = beginWith || {nextChars: inTheEther};
        startAtChar = startAtChar || 0;
        
        output = output || [];
        var first = xmlParser.findFirstInstance(input, startAtChar, beginWith.nextChars);
        
        if(!first) {
            if(input.length > startAtChar)
                output.push(input.substr(startAtChar));
        } else {        
            if(first.index > startAtChar)
                output.push(input.substring(startAtChar, first.index));

            output.push(first.type);
            xmlParser.preParse(input, first.type, first.index + first.length, output);
        }
        
        return output;
    };
        
    xmlParser.parseInsideTag = function(preParsed, tag, startIndex) {
                
        for(var i = startIndex, ii = preParsed.length; i < ii; i++) {
            
            if (preParsed[i] === closeTag1 || preParsed[i] === closeTag2) {
                
                tag.inline = preParsed[i] === closeTag2;
                i++;
                
                return tag.inline ? i : xmlParser.parseTheEther(preParsed, tag, i);
            }
            
            if (typeof preParsed[i] !== "string")
                throw "Invalid operation"; // this should have been caught earlier in the distillElementName phase
            
            i++; // skip text
            if (preParsed[i] === openSQuote) {
                
                if ((typeof preParsed[i + 1] === "string" && preParsed[i + 2] === closeSQuote) || preParsed[i + 1] === closeSQuote) {                
                    var name = xmlParser.distillAttributeName(preParsed[i + 1]);
                    if(!name)
                        //TODO
                        throw {
                            message: "Cannot find attribute name"
                        };

                    tag.attributes[name] = new wipeout.template.xmlAttribute(preParsed[i + 1], "'");
                    i+=2 + (preParsed[i + 1] === closeSQuote ? 0 : 1);
                } else {
                    //TODO
                    throw {
                        message: "Invalid attribute"
                    };
                }
            } else if (preParsed[i] === openDQuote) {
                
                if ((typeof preParsed[i + 1] === "string" && preParsed[i + 2] === closeDQuote) || preParsed[i + 1] === closeDQuote) {                
                    var name = xmlParser.distillAttributeName(preParsed[i + 1]);
                    if(!name)
                        //TODO
                        throw {
                            message: "Cannot find attribute name"
                        };

                    tag.attributes[name] = new wipeout.template.xmlAttribute(preParsed[i + 1], '"');
                    i+=2 + (preParsed[i + 1] === closeDQuote ? 0 : 1);
                } else {
                    //TODO
                    throw {
                        message: "Invalid attribute"
                    };
                }
            } else {
                //TODO
                throw {
                    message: "Invalid xml"
                };
            }
        }    
        
        return i;
    };
    
    xmlParser.parseTheEther = function(preParsed, rootElement, startIndex) {
        
        for(var i = startIndex, ii = preParsed.length; i < ii; i++) {
            if (typeof preParsed[i] === "string") {
                
                rootElement.push(preParsed[i]);
            } else if(preParsed[i] === openComment) {
                
                if (preParsed[i + 1] === closeComment) {
                    rootElement.push(new wipeout.template.xmlComment(""));
                    i++;
                } else if (typeof preParsed[i + 1] === "string" && preParsed[i + 2] === closeComment) {
                    rootElement.push(new wipeout.template.xmlComment(preParsed[i + 1]));
                    i+=2;
                } else {
                    //TODO
                    throw {
                        message: "Cannot find closing comment tag"
                    };
                }
            } else if (preParsed[i] === openTag1) {
                
                if (typeof preParsed[i + 1] === "string") {
                    var name = xmlParser.distillElementName(preParsed[i + 1]);
                    if(!name)
                        //TODO
                        throw {
                            message: "Invalid opening tag"
                        };
                    
                    //TODO: is inline? (third consrtuctor arg)
                    var element = new wipeout.template.xmlElement(name, rootElement);
                    i = xmlParser.parseInsideTag(preParsed, element, i + 1) - 1;
                    rootElement.push(element);                    
                } else {
                    //TODO
                    throw {
                        message: "Invalid opening tag"
                    };
                }
            } else if (preParsed[i] === openTag2) {
                
                if (wipeout.obj.trimToLower(rootElement.name) && typeof preParsed[i + 1] === "string" && preParsed[i + 2] === closeTag1) {
                    if(wipeout.obj.trimToLower(rootElement.name) === wipeout.obj.trimToLower(preParsed[i + 1]))
                        return i + 2;
                    
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
                    message: "Invalid xml"
                };
            }
        } 
        
        return i;
    };
    
    return xmlParser;
});