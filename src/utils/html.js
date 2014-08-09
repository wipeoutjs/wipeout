

Class("wipeout.utils.html", function () { 
        
    var outerHTML = function(element) {
        ///<summary>Browser agnostic outerHTML function</summary>
        ///<param name="element" type="HTMLElement">The elemet to get the outer html</param>
        ///<returns type="String">The outer html of the input</returns>
        
        if(!element) return null;
        
        if(element.constructor === HTMLHtmlElement) throw "Cannot serialize a Html element using outerHTML";
        
        var tagName = element.nodeType === 1 ? (specialTags[element.tagName.toLowerCase()] || "div") : "div";
        var div = document.createElement(tagName);
        div.appendChild(element.cloneNode(true));
        
        return div.innerHTML;        
    };  
    
    var validHtmlCharacter = /[a-zA-Z0-9]/;
    var getTagName = function(openingTag) {
        ///<summary>Get the tag name of the first element in the string</summary>
        ///<param name="openingTag" type="String">A string of html</param>
        ///<returns type="String">The name of the first tag</returns>
        
        openingTag = openingTag.replace(/^\s+|\s+$/g, "");
        if(!openingTag || openingTag[0] !== "<")
            throw "Invalid html tag";
        
        openingTag = openingTag.substring(1).replace(/^\s+|\s+$/g, "");
        
        for(var i = 0, ii = openingTag.length; i < ii; i++) {
            if(!validHtmlCharacter.test(openingTag[i]))
                break;
        }
        
        return openingTag.substring(0, i);
    };
    
    var stripHtmlComments = /<\!--[^>]*-->/g;
    var getFirstTagName = function(htmlContent) {
        ///<summary>Get the tag name of the first element in the string</summary>
        ///<param name="htmlContent" type="String">A string of html</param>
        ///<returns type="String">The name of the first tag</returns>
        
        htmlContent = htmlContent.replace(stripHtmlComments, "").replace(/^\s+|\s+$/g, "");
        var i = 0;
        if((i = htmlContent.indexOf("<")) === -1)
            return null;
        
        return getTagName(htmlContent.substring(i));
    };
        
    // tags which cannot go into a <div /> tag, along with the tag they should go into
    var specialTags = {
        area: "map",
        base: "head",
        basefont: "head",
        body: "html",
        caption: "table",
        col: "colgroup",
        colgroup: "table",
        command : "menu",
        frame: "frameset",
        frameset: "html",
        head: "html",
        keygen: "form",
        li: "ul",
        optgroup: "select",
        option: "select",
        rp: "rt",
        rt: "ruby",
        source: "audio",
        tbody: "table",
        td: "tr",
        tfoot: "table",
        th: "tr",
        thead: "table",
        tr: "tbody"
    };
    
    // tags which, if the root, wipeout will refuse to create
    var cannotCreateTags = {
        html:true,
        basefont: true,
        base: true,
        body: true,
        frame: true,
        frameset: true,
        head: true
    };
    
    function firstChildOfType(parentElement, childType) {
        for(var i = 0, ii = parentElement.childNodes.length; i < ii; i++) {
            var child = parentElement.childNodes[i];
            if (child.nodeType === 1 && wipeout.utils.obj.trimToLower(child.tagName) === wipeout.utils.obj.trimToLower(childType)) {
                return child;
            }
        }
    }
    
    // tags which are readonly once created in IE
    var ieReadonlyElements = {
        audio: true,
        col: true, 
        colgroup: true,
        frameset: true,
        head: true,
        rp: true,
        rt: true,
        ruby: true,
        select: true,
        style: true,
        table: true,
        tbody: true,
        tfooy: true,
        thead: true,
        title: true,
        tr: true
    };
    
    // firefox replaces some tags with others
    var replaceTags = {
        keygen: "select"
    };
    
    var createElement = function(htmlString) {
        ///<summary>Create a html element from a string</summary>
        ///<param name="htmlString" type="String">A string of html</param>
        ///<returns type="HTMLElement">The first element in the string as a HTMLElement</returns>
        
        var tagName = wipeout.utils.obj.trimToLower(getTagName(htmlString));
        if(cannotCreateTags[tagName]) throw "Cannot create an instance of the \"" + tagName + "\" tag.";
        
        var parentTagName = specialTags[tagName] || "div";
        
        // the innerHTML for some tags is readonly in IE
        if(ko.utils.ieVersion && ieReadonlyElements[parentTagName])
            return firstChildOfType(createElement("<" + parentTagName + ">" + htmlString + "</" + parentTagName + ">"), tagName);
            
        var parent = document.createElement(parentTagName);
        parent.innerHTML = htmlString;
        
        function getElement(tagName) {
            if(!tagName) return null;
            
            for(var i  = 0, ii = parent.childNodes.length; i < ii; i++) {
                // IE might create some other elements along with the one specified
                if(parent.childNodes[i].nodeType === 1 && parent.childNodes[i].tagName.toLowerCase() === tagName) {
                    var element = parent.childNodes[i];
                    parent.removeChild(element);
                    return element;
                }
            }
            
            return null;
        }
        
        return getElement(tagName) || getElement(replaceTags[tagName]);
    }; 
       
    var createElements = function(htmlString) {
        ///<summary>Create an array of html elements from a string</summary>
        ///<param name="htmlString" type="String">A string of html</param>
        ///<returns type="HTMLElement">The string as an array of HTMLElements</returns>
        
        if(htmlString == null) return [];
        
        var sibling = getFirstTagName(htmlString) || "div";
        var parent = specialTags[getTagName("<" + sibling + "/>")] || "div";
        
        // the innerHTML for some tags is readonly in IE
        if(ko.utils.ieVersion && ieReadonlyElements[parent]) {
            var div = createElement("<" + parent + ">" + htmlString + "</" + parent + ">");
            var output = [];
            while(div.firstChild) {
                output.push(div.firstChild);
                div.removeChild(div.firstChild);
            }
            
            return output;
        }
        
        // add wrapping elements so that text element won't be trimmed
        htmlString = "<" + sibling + "></" + sibling + ">" + htmlString + "<" + sibling + "></" + sibling + ">";
        
        var div = document.createElement(parent);
        div.innerHTML = htmlString;
        
        var output = [];
        while(div.firstChild) {
            output.push(div.firstChild);
            div.removeChild(div.firstChild);
        }
        
        // remove added divs
        output.splice(0, 1);
        output.splice(output.length - 1, 1);
        
        return output;
    };  
 
    var getAllChildren = function (element) {
        ///<summary>Get all of the children of a html element or knockout virtual element</summary>
        ///<param name="element" type="HTMLNode">An element or knockout virtual element</param>
        ///<returns type="Array" generic0="HTMLNode">All of the nodes in the element</returns>
        
        var children = [];
        if (wipeout.utils.ko.isVirtual(element)) {
            var parent = wipeout.utils.ko.parentElement(element);
            
            // find index of "element"
            for (var i = 0, ii = parent.childNodes.length; i < ii; i++) {
                if (parent.childNodes[i] === element)
                    break;
            }
 
            i++;
 
            // use previous i
            // get all children of the virtual element. It is ok to get more than
            // just the children as the next block will break out when un wanted nodes are reached
            for (var ii = parent.childNodes.length; i < ii; i++) {
                children.push(parent.childNodes[i]);
            }
        } else {
            children = element.childNodes;
        }
 
        var output = [];
        var depth = 0;
 
        for (var i = 0, ii = children.length; i < ii; i++) {
            if (wipeout.utils.ko.isVirtualClosing(children[i])) {
                depth--;
                
                // we are in a virtual parent element
                if (depth < 0) return output;
                continue;
            }
 
            // we are in a virtual child element
            if (depth > 0)
                continue;
 
            output.push(children[i]);
            
            // the next element will be in a virtual child
            if (wipeout.utils.ko.isVirtual(children[i]))
                depth++;
        }
 
        return output;
    };
    
    var getViewModel = function(forHtmlNode) {
        ///<summary>Get the view model associated with a html node</summary>
        ///<param name="forHtmlNode" type="HTMLNode">The element which is the root node of a wo.view</param>
        ///<returns type="wo.view">The view model associated with this node, or null</returns>
        var vm = wipeout.utils.domData.get(forHtmlNode, wipeout.bindings.wipeout.utils.wipeoutKey);
        if(vm)
            return vm;
        
        var parent = wipeout.utils.ko.parentElement(forHtmlNode);
        if(parent)
            return getViewModel(parent);
        
        return null;
    };
    
    var createTemplatePlaceholder = function(forViewModel) {
        ///<summary>Create a html node so serve as a temporary template while the template loads asynchronously</summary>
        ///<param name="forViewModel" type="wo.view">The view to which this temp template will be applied. May be null</param>
        ///<returns type="HTMLElement">A new html element to use as a placeholder template</returns>
        
        return createElement("<span>Loading template</span>");
    };
    
    var loadTemplate = function(templateId) {
        ///<summary>Asynchronously load a template</summary>
        ///<param name="templateId" type="String">The url and subsequent template id of the template</param>
        
        wipeout.template.asyncLoader.instance.load(templateId);
    };
    
    var cleanNode = function(node) {
        ///<summary>Clean down and dispose of all of the bindings (ko and wo) associated with this node and its children</summary> 
        ///<param name="node" type="HTMLNode" optional="false">The node</param>
        
        var bindings = wipeout.utils.domData.get(node, wipeout.bindings.bindingBase.dataKey);
        
        // check if children have to be disposed
        var controlChildren = false;
        enumerateArr(bindings, function(binding) {
            controlChildren |= binding.bindingMeta.controlsDescendantBindings;
        });

        // dispose of all children
        if(!controlChildren) {
            var child = ko.virtualElements.firstChild(node);
            while (child) {
                cleanNode(child);
                child = ko.virtualElements.nextSibling(child);
            }
        }
        
        // dispose of all wo bindings
        enumerateArr(bindings, function(binding) {
            binding.dispose();
        });

        // clear ko and wo data
        wipeout.utils.domData.clear(node, wipeout.bindings.bindingBase.dataKey);
        ko.cleanNode(node);
    };
    
    var html = function html(htmlManipulationLogic) {
        ///<summary>If html elements are to be moved or deleted, wrap the move logic in a call to this function to ensure disposal of unused view models</summary> 
        ///<param name="htmlManipulationLogic" type="Function" optional="false">A callback to manipulate html</param>
        
        wipeout.utils.htmlAsync(function(cleanupCallback) {
            htmlManipulationLogic();
            cleanupCallback();
        });
    };
    
    try {
        //http://stackoverflow.com/questions/11563554/how-do-i-detect-xml-parsing-errors-when-using-javascripts-domparser-in-a-cross
        var parseErrorNamespace = new DOMParser().parseFromString('<', 'text/xml').getElementsByTagName("parsererror")[0].namespaceURI;
    } catch (e) {
        // IE throws an exception on invalid xml
    }
    
    var parseXml = function(xmlString) {  
        ///<summary>Parse a string into an xm ldocumen</summary> 
        ///<param name="xmlString" type="String" optional="false">the xml string</param>
        ///<returns type="Element" optional="false">Xml</returns>
        
        var xmlTemplate = new DOMParser().parseFromString(xmlString, "application/xml");        
        if(xmlTemplate.getElementsByTagNameNS(parseErrorNamespace, 'parsererror').length) {
			throw "Invalid xml template:\n" + new XMLSerializer().serializeToString(xmlTemplate.firstChild);
		}
        
        return xmlTemplate.documentElement;
    };
    
    html.parseXml = parseXml;
    html.cleanNode = cleanNode;
    html.cannotCreateTags = cannotCreateTags;
    html.createTemplatePlaceholder = createTemplatePlaceholder;
    html.specialTags = specialTags;
    html.getFirstTagName = getFirstTagName;
    html.getTagName = getTagName;
    html.getAllChildren = getAllChildren;
    html.outerHTML = outerHTML;
    html.createElement = createElement;
    html.createElements = createElements;
    html.getViewModel = getViewModel
    
    return html;    
});