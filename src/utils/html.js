

Class("wipeout.utils.html", function () { 
        
	//TODO: clean up unused code
	
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
    
    html.createTemplatePlaceholder = createTemplatePlaceholder;
    html.specialTags = specialTags;
    html.outerHTML = outerHTML;
    html.getViewModel = getViewModel
    
    return html;    
});