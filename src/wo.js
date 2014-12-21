
//TODO: unit test
window.wo = function (model, htmlElement) {
    ///<summary>Create a new observable array</summary>
    ///<param name="model" type="Any" optional="true">The root model</param>
    ///<param name="htmlElement" type="HTMLElement or String" optional="true">The root html element. Can be an element or an id</param>

    if (arguments.length < 2)
        htmlElement = document.getElementsByTagName("body")[0];
    else if (typeof htmlElement === "string")
        htmlElement = document.getElementById(htmlElement);

    enumerateArr(htmlElement.getElementsByTagName("*"), function (element) {

        // element may have been removed since get all elements
        if (htmlElement.contains(element) && getMeAViewModel(element))
            new wipeout.template.viewModelElement(element);
    });        
}

window.addEventListener("load", function () {
    window.wo(null); //TODO: model
});

var getMeAViewModel = function(element) {   
    
    var vmName = wipeout.utils.obj.trimToLower(element.tagName);
    var vmConstructor = wipeout.utils.obj.getObject(vmName);
    if (!vmConstructor && element.attributes[wipeout.settings.wipeoutAttributes.viewModelName])
        vmConstructor = wipeout.utils.obj.getObject(vmName = element.attributes[wipeout.settings.wipeoutAttributes.viewModelName].value);
    
    var dataViewModel = "data-" + wipeout.settings.wipeoutAttributes.viewModelName;
    if (!vmConstructor && element.attributes[dataViewModel])
        vmConstructor = wipeout.utils.obj.getObject(vmName = element.attributes[dataViewModel].value);

    if(!vmConstructor)
        return;
    
    return {
        name: vmName,
        constructor: vmConstructor
    };
}