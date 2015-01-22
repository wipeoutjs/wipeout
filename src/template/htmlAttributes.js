
Class("wipeout.template.htmlAttributes", function () {
    function htmlAttributes() {
    }  
    
    var functionReference = /^[\s\.\w\$]*$/;
    
    //TODO: types of inputs
    htmlAttributes.click = function (value, element, renderContext) { //TODO error handling
        
        if (functionReference.test(value))
            value = value + "(e, element);";
        
        //TODO non standard (with)
        var callback = new Function("e", "element", "renderContext", "with (renderContext) " + value);
        
        return onElementEvent(element, "click", function (e) {
            callback(e, element, renderContext);
        });
    };
    
    //TODO: types of inputs
    htmlAttributes.value = function (value, element, renderContext) { //TODO error handling
        
        if (!wipeout.template.bindingTypes.owts.isSimpleBindingProperty(value))
            throw "Cannot bind to the property \"" + value + "\".";
        
        var d1 = onVmValueChanged(value, function (oldVal, newVal) {
            if (element.value !== newVal)
                element.value = newVal;
        }, renderContext);
        
        //TODO: this is very non standard (the with part)
        var setter = wipeout.template.bindingTypes.owts.buildSetter(value, true);
        var d2 = onElementEvent(element, "change", function () {
            setter(renderContext, element.value);
        });
        
        return function () {
            if (d1) {
                d1();
                d2();
                
                d1 = null;
                d2 = null;
            }
        }
    };   
    
    var defaultVal = {};
    function onVmValueChanged (value, callback, renderContext) { //TODO error handling
        
        var context = new wipeout.base.watched({value: defaultVal}), name = "value";
        context.callback = wipeout.template.compiledInitializer.getAutoParser(value);
        
        var observation = context.observe(name, callback);
        
        // order important. Observe before computed execution
        var computed = new wipeout.base.computed(context, name, context.callback, {renderContext: renderContext, value: value, propertyName: ""});
        
        return function output() {
            observation.dispose();
            computed.dispose();
        };
    };
    
    function onElementEvent (element, event, callback) { //TODO error handling
        
        //TODO, third arg (capture)
        element.addEventListener(event, callback);
        
        return function() {
            if (callback) {
                //TODO, third arg (capture)
                element.removeEventListener(event, callback);
                callback = null;
            }
        };
    };
    
    htmlAttributes.render = function (value, element, renderContext) { //TODO error handling
        
        var htmlContent = new wipeout.template.renderedContent(element, value, renderContext);
        var disposal = onVmValueChanged(value, function (oldVal, newVal) {
            htmlContent.render(newVal);
        }, renderContext);
        
        return function() {
            disposal();
            htmlContent.dispose();
        };
    };  
    
    htmlAttributes.content = function (value, element, renderContext) { //TODO error handling
        return onVmValueChanged(value, function (oldVal, newVal) {
            element.innerHTML = newVal;
        }, renderContext);
    };
    
    //TODO: dispose function
    htmlAttributes.itemscontrol = function (value, element, renderContext) {
        
        if (renderContext.$this.__woBag.hasItemsControlBinding)
            throw "This items control already has an items control binding";
        
        var token = renderContext.$this.__woBag.hasItemsControlBinding = {};
            
        var renderedItems = [];
        
        function onItemsChanged (removed, added, indexes) {
            var items = wipeout.utils.obj.copyArray(renderedItems);
            for (var i = renderContext.$this.items.length, ii = renderedItems.length; i < ii; i++)
                renderedItems[i].dispose();

            renderedItems.length = renderContext.$this.items.length;
            
            var removed = {}, added = {}
            enumerateArr(indexes.added, function(item) {
                if (renderedItems[item.index])
                    removed[item.index] = renderedItems[item.index];
                
                var el = document.createElement("script");
                if (item.index >= renderedItems.length - 1)
                    element.appendChild(el);
                else
                    renderedItems[item.index + 1].closingTag.parentElement.insertAfter(el, item[item.index + 1].closingTag);
                    
                renderedItems[item.index] = new wipeout.template.renderedContent(el, "item: " + item.index, renderContext);
                renderedItems[item.index].render(item.value);
            }, this);
        
            enumerateArr(indexes.moved, function(item) {
                removed[item.to] = renderedItems[item.to];
                added[item.from] = true;
                
                renderedItems[item.to] = items[item.from];
                if (item.to >= renderedItems.length - 1)
                    renderedItems[item.to].appendTo(element);
                else
                    renderedItems[item.to].move(renderedItems[item.to + 1].openingTag);
            }, this);
            
            for (var i in removed)
                if (!added[i])
                    removed[i].dispose();
        }
        
        var d1 = renderContext.$this.items.observe(onItemsChanged);
        
        var added = [];
        for (var i = 0, ii = renderContext.$this.items.length; i < ii; i++)
            added.push({
                value: renderContext.$this.items[i],
                index: i
            });
            
        onItemsChanged([],[],{added: added});
        
        return function () {
            d1.dispose();
            for (var i = 0, ii = renderedItems.length; i < ii; i++)
                renderedItems[i].dispose();
                
            renderedItems.length = 0;
            if (renderContext.$this.__woBag.hasItemsControlBinding === token)
                delete renderContext.$this.__woBag.hasItemsControlBinding;
        }
    };
    
    htmlAttributes.id = function (value, element, renderContext) {
        renderContext.$this.templateItems[value] = element;
        element.id = value;
        
        return function() {
            if (renderContext.$this.templateItems[value] === element)
                delete renderContext.$this.templateItems[value]
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