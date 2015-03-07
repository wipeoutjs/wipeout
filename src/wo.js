
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

	if (getMeAViewModel(htmlElement))
		output.registerDisposable(new wipeout.template.rendering.viewModelElement(htmlElement));
	else
		enumerateArr(wipeout.utils.obj.copyArray(htmlElement.getElementsByTagName("*")), function (element) {

			// element may have been removed since get all elements
			if (htmlElement.contains(element) && getMeAViewModel(element))
				output.registerDisposable(new wipeout.template.rendering.viewModelElement(element));
		});
	
	return output;
};

wo.viewModel = viewModel;

wo.getViewModel = function (viewModelName, skipCamelCase) {
	
	//TODO: document
	if (!skipCamelCase && wipeout.utils.obj.trimToLower(viewModelName).indexOf("js-") === 0)
		viewModelName = viewModelName.substring(2);
	
	var tmp1 = skipCamelCase ? 
		wipeout.utils.obj.trim(viewModelName) : 
		wipeout.utils.obj.camelCase(wipeout.utils.obj.trimToLower(viewModelName));
	var tmp2;
	if (tmp2 = wipeout.utils.obj.getObject(tmp1))
		return {
			name: tmp1,
			constructor: tmp2
		};
};

window.addEventListener("load", function () {
    window.wo(null); //TODO: model
});

function getMeAViewModel(element) {   
    	
	var tmp1, tmp2;
	if (tmp1 = wo.getViewModel(element.tagName))
		return tmp1;
	
	tmp2 = wipeout.settings.wipeoutAttributes.viewModelName;
	if (element.attributes[tmp2] && 
		(tmp1 = wo.getViewModel(element.attributes[tmp2].value, true)))
		return tmp1;
	
	tmp2 = "data-" + wipeout.settings.wipeoutAttributes.viewModelName;
	if (element.attributes[tmp2] && 
		(tmp1 = wo.getViewModel(element.attributes[tmp2].value, true)))
		return tmp1;
}