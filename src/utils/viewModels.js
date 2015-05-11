Class("wipeout.utils.viewModels", function () { 
	
	function viewModels () {}

	var realName1 = "wo-el", realName2 = "data-wo-el";
	viewModels.getElementName = function (wmlElement) {
        ///<summary>Get the actual name of an element. The actual name is either the "data-wo-element-name" attribute or the element name</summary>
        ///<param name="wmlElement" type="wipeout.wml.wmlElement">The key</param>
        ///<returns type="String">The name</returns>

		name = wmlElement instanceof Element ?
			(wmlElement.getAttribute(realName1) || wmlElement.getAttribute(realName2) || camelCase(trimToLower( wmlElement.localName))) :
			camelCase(trimToLower(wmlElement.name));
		
		return /^js[A-Z]/.test(name) ? name.substr(2) : name;
	};
	
	viewModels.getViewModel = function (htmlNode, endAt) {
        ///<summary>Get the view model which rendered this node (if any)</summary>
        ///<param name="htmlNode" type="Element">The node</param>
        ///<param name="endAt" type="Element" optional="true">An element which definitely has not view model, meaning all parent elements will also not have a view model.</param>
        ///<returns type="Object">The view model</returns>
		
		if (!htmlNode || htmlNode === endAt)
			return;
		
		if (htmlNode.wipeoutOpening)
			return htmlNode.wipeoutOpening.viewModel;
		if (htmlNode.wipeoutClosing)
			return htmlNode.wipeoutClosing.viewModel;
		
		var ps = htmlNode.previousSibling;
		if (ps && ps.wipeoutClosing)
			ps = ps.wipeoutClosing.openingTag.previousSibling || htmlNode.parentNode;
				
		return viewModels.getViewModel(ps);
	};
	
	viewModels.getViewModelConstructor = function (wmlElement) {
        ///<summary>A constructor for a view model (if any) given a specific element</summary>
        ///<param name="wmlElement" type="wipeout.wml.wmlElement">The element</param>
        ///<returns type="Boolean">Success</returns>

		var constr, name = viewModels.getElementName(wmlElement);

		if (constr = wipeout.utils.obj.getObject(name))
			return {
				name: name,
				constructor: constr
			};
	};
	
	return viewModels;
});