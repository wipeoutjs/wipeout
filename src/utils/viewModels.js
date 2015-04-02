Class("wipeout.utils.viewModels", function () { 
	
	function viewModels () {}

	//TODM
	var realName = "data-wo-element-name";
	viewModels.getElementName = function (wmlElement) {

		var tmp;
		if (wmlElement.getAttribute && (tmp = wmlElement.getAttribute(realName)) != null)
			return tmp;
		
		var name = camelCase(trimToLower(wmlElement instanceof Element ? wmlElement.localName : wmlElement.name));
		
		//TODM
		return /^js[A-Z]/.test(name) ? name.substr(2) : name;
	};
	
	viewModels.getViewModelConstructor = function (wmlElement) {

		var constr, name = viewModels.getElementName(wmlElement);

		if (constr = wipeout.utils.obj.getObject(name))
			return {
				name: name,
				constructor: constr
			};
	};
	
	return viewModels;
});