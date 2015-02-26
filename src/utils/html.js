

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
    
    var getViewModel = function(forHtmlNode) {
        ///<summary>Get the view model associated with a html node</summary>
        ///<param name="forHtmlNode" type="HTMLNode">The element which is the root node of a wo.view</param>
        ///<returns type="wo.view">The view model associated with this node, or null</returns>
        
		if (!forHtmlNode)
			return null;
				
        if (forHtmlNode.wipeoutOpening)
			return forHtmlNode.wipeoutOpening.viewModel;
		
		if (forHtmlNode.wipeoutClosing)
			return forHtmlNode.wipeoutClosing.viewModel;
		
		return getViewModel(wipeout.template.renderedContent.getParentElement(forHtmlNode));
    };
    
    var createTemplatePlaceholder = function(forViewModel) {
        ///<summary>Create a html node so serve as a temporary template while the template loads asynchronously</summary>
        ///<param name="forViewModel" type="wo.view">The view to which this temp template will be applied. May be null</param>
        ///<returns type="HTMLElement">A new html element to use as a placeholder template</returns>
        
        var el = document.createElement("span");
        el.innerHTML = "Loading template";
        return el;
    };
    
    function html() {
    };
    
    html.cannotCreateTags = cannotCreateTags;
    html.createTemplatePlaceholder = createTemplatePlaceholder;
    html.specialTags = specialTags;
    html.getFirstTagName = getFirstTagName;
    html.getTagName = getTagName;
    html.outerHTML = outerHTML;
    html.getViewModel = getViewModel
    
    return html;    
});