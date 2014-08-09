Class("wipeout.template.htmlBuilder", function () {
    
    var htmlBuilder = function htmlBuilder(xmlTemplate) {
        ///<summary>Pre-compile that needed to render html from a binding context from a given template</summary>
        ///<param name="xmlTemplate" type="Element">The template to build html from</param>
        
        ///<Summary type="Array" generic0="Any">Pre rendered strings or string generating functions which make up the final html</Summary>
        this.preRendered = [];
        this.generatePreRender(xmlTemplate);
    };
    
    htmlBuilder.prototype.render = function(bindingContext) {
        ///<summary>Build html elements from a binding context</summary>
        ///<param name="bindingContext" type="ko.bindingContext">The bindingContext to build html from</param>
        //<returns type="Array">An array of elements</returns>
        
        var contexts = [];
        var returnVal = [];
        for(var i = 0, ii = this.preRendered.length; i < ii; i++) {
            if(this.preRendered[i] instanceof Function) {                    
                var rendered = this.preRendered[i](bindingContext);                  
                returnVal.push(rendered);
            } else {
                returnVal.push(this.preRendered[i]);
            }
        }
        
        var html = wipeout.utils.html.createElements(returnVal.join(""));
        enumerateObj(htmlBuilder.getTemplateIds({childNodes: html}), function(item, id) {
            bindingContext.$data.templateItems[id] = item;
        });
            
        if (bindingContext.$data instanceof wipeout.base.view)
            bindingContext.$data.onInitialized();
        
        return html;
    };
    
    htmlBuilder.prototype.generatePreRender = function(templateString) {
        ///<summary>Pre compile render code</summary>
        ///<param name="templateString" type="String">The template</param>
                   
        // need to convert to xml and back as string is an XML string, not a HTML string
        var xmlTemplate = wipeout.utils.html.parseXml("<root>" + templateString + "</root>");
        
        var template = wipeout.template.htmlBuilder.generateTemplate(xmlTemplate);
        
        var open = wipeout.template.engine.openCodeTag;
        var close = wipeout.template.engine.closeCodeTag;
        this.preRendered.length = 0;
        
        var startTag, endTag;
        while((startTag = template.indexOf(open)) !== -1) {
            this.preRendered.push(template.substr(0, startTag));
            template = template.substr(startTag);
            
            endTag = template.indexOf(close);
            if(endTag === -1) {
                throw "Invalid wipeout_code tag.";
            }
            
            this.preRendered.push((function(scriptId) {
                return wipeout.template.engine.scriptCache[scriptId];
            })(template.substr(open.length, endTag - open.length)));
                        
            template = template.substr(endTag + close.length);
        }
                
        this.preRendered.push(template);
    };
    
    htmlBuilder.getTemplateIds = function (element) {
        ///<summary>Return all html elements with an id</summary>
        ///<param name="element">The parent element to query</param>
        ///<returns type="Object">A dictionary of elements and ids</returns>
        
        var ids = {};
        enumerateArr(element.childNodes, function(node) {
            if(node.nodeType === 1) {
                for(var j = 0, jj = node.attributes.length; j < jj; j++) {
                    if(node.attributes[j].nodeName === "id") {
                        ids[node.attributes[j].nodeValue] = node;
                        break;
                    }
                }
                
                // look at child elements
                enumerateObj(htmlBuilder.getTemplateIds(node), function(element, id) {
                    ids[id] = element;
                });
            }                
        });
        
        return ids;
    };
    
    htmlBuilder.generateTemplate = function(xmlTemplate) { 
        ///<summary>Convert an xml template to a string</summary>
        ///<param name="xmlTemplate" type="Element">The template</param>
        ///<returns type="String">A string version of the template</returns>
        
        var result = [];
        var ser = new XMLSerializer();
        
        enumerateArr(xmlTemplate.childNodes, function(child) {            
            if(child.nodeType == 1) {
                
                // create copy with no child nodes
                var ch = wipeout.utils.html.parseXml(ser.serializeToString(child));
                while (ch.childNodes.length) {
                    ch.removeChild(ch.childNodes[0]);
                }
                
                var html = wipeout.utils.html.createElement(ser.serializeToString(ch));
                html.innerHTML = wipeout.template.htmlBuilder.generateTemplate(child);                
                result.push(wipeout.utils.html.outerHTML(html));
            } else if(child.nodeType === 3) {
                result.push(child.data);
            } else {
                result.push(ser.serializeToString(child));
            }
        });
        
        return result.join("");
    };
    
    return htmlBuilder;
});