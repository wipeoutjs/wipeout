
window.wo = function (model, htmlElement) {
    ///<summary>Create a new observable array</summary>
    ///<param name="model" type="Any" optional="true">The root model</param>
    ///<param name="htmlElement" type="HTMLElement or String" optional="true">The root html element. Can be an element or an id</param>

	var output = new busybody.disposable();
	
    if (arguments.length < 2)
        htmlElement = document.getElementsByTagName("body")[0];
    else if (typeof htmlElement === "string")
        htmlElement = document.getElementById(htmlElement);

	if (wipeout.utils.viewModels.getViewModelConstructor(htmlElement)) {
		var vme = new wipeout.template.rendering.viewModelElement(htmlElement);
		if (model != null)
			vme.createdViewModel.model = model;
		output.registerDisposable(vme);
	} else {
		enumerateArr(wipeout.utils.obj.copyArray(htmlElement.getElementsByTagName("*")), function (element) {

			// element may have been removed since get all elements
			if (htmlElement.contains(element) && wipeout.utils.viewModels.getViewModelConstructor(element)) {
				var vme = new wipeout.template.rendering.viewModelElement(element);
				if (model != null)
					vme.createdViewModel.model = model;
				output.registerDisposable(vme);
			}
		});
	}
	
	return output;
};

window.addEventListener("load", function () {
    window.wo();
});