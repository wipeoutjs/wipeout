
Class("wipeout.template.htmlAttributes", function () {
    function htmlAttributes() {
    }
    
    
    // return dispose function
    htmlAttributes.click = function (value, element, renderContext) {
        return function() {
        };
    };
    
    htmlAttributes.id = function (value, element, renderContext) {
        renderContext.$data.templateItems[value] = element;
        element.id = value;
    };
    
    htmlAttributes.wipeoutCreateViewModel = function (value, element, renderContext) {
        new wipeout.template.viewModelElement(element, value);
    };
    
    var tmp = {};
    for (var i in htmlAttributes) {
        tmp[i] = true;
    }
    
    for (var i in tmp) {
        htmlAttributes["wo-" + i] = htmlAttributes[i];
        htmlAttributes["data-wo-" + i] = htmlAttributes[i];
    }
    
    return htmlAttributes;
});