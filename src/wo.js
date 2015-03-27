
//TODO: unit test
window.wo = function (model, htmlElement) {
    ///<summary>Create a new observable array</summary>
    ///<param name="model" type="Any" optional="true">The root model</param>
    ///<param name="htmlElement" type="HTMLElement or String" optional="true">The root html element. Can be an element or an id</param>

	var output = new obsjs.disposable();
	
    if (arguments.length < 2)
        htmlElement = document.getElementsByTagName("body")[0];
    else if (typeof htmlElement === "string")
        htmlElement = document.getElementById(htmlElement);

	if (wo.getViewModelConstructor(htmlElement))
		output.registerDisposable(new wipeout.template.rendering.viewModelElement(htmlElement));
	else
		enumerateArr(wipeout.utils.obj.copyArray(htmlElement.getElementsByTagName("*")), function (element) {

			// element may have been removed since get all elements
			if (htmlElement.contains(element) && wo.getViewModelConstructor(element))
				output.registerDisposable(new wipeout.template.rendering.viewModelElement(element));
		});
	
	return output;
};

wo.viewModel = viewModel;

//TODO: document
var realName = "data-wo-element-name";
wo.getViewModelConstructor = function (wmlElement) {
	
	if (wmlElement instanceof Element) {
		var constr, name = wmlElement.attributes[realName] ?
			wmlElement.attributes[realName].value : 
			wipeout.utils.obj.camelCase(wipeout.utils.obj.trimToLower(wmlElement.localName));
	} else {
		var constr, name = wmlElement.attributes[realName] ?
			wmlElement.attributes[realName].value : 
			wipeout.utils.obj.camelCase(wipeout.utils.obj.trimToLower(wmlElement.name));
	}
	
	//TODO: document
	if (/^js[A-Z]/.test(name))
		name = name.substr(2);
	
	if (constr = wipeout.utils.obj.getObject(name))
		return {
			name: name,
			constructor: constr
		};
};

window.addEventListener("load", function () {
    window.wo(null); //TODO: model
});