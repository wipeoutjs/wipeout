
Class("wipeout.template.htmlAttributes", function () {
    function htmlAttributes() {
    }    
    
    htmlAttributes.click = function (value, element, renderContext) {
        return function() {
        };
    };    
    
    htmlAttributes.content = function (value, element, renderContext) { //TODO error handling
        var disposable = new wipeout.base.pathWatch(renderContext, value, function (oldVal, newVal) {
            element.innerHTML = newVal;
        });
        
        element.innerHTML = disposable.execute();
        
        return function() {
            disposable.dispose();
        };
    };
    
    htmlAttributes.id = function (value, element, renderContext) {
        renderContext.$data.templateItems[value] = element;
        element.id = value;
        
        return function() {
            if (renderContext.$data.templateItems[value] === element)
                delete renderContext.$data.templateItems[value]
        }
    };
    
    htmlAttributes.wipeoutCreateViewModel = function (value, element, renderContext) {
        var op = new wipeout.template.viewModelElement(element, value, renderContext);
        
        return function () {
            op.dispose(true);
        };
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