
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
    
    htmlAttributes.itemscontrol = function (value, element, renderContext) {
        
        var viewModelElements = [];
        renderContext.$data.items.observe(function (removed, added, indexes) {
                    
            /*var vme = wipeout.utils.obj.copyArray(viewModelElements);
            this.items.length = this.itemSource.length;

            enumerateArr(indexes.added, function(item) {
                
                viewModelElements[item.index] = item.value;
                
                
                
                this.items.replace(item.index, this._createItem(item.value));
            }, this);

            enumerateArr(indexes.moved, function(item) {
                this.items.replace(item.to, vme[item.from]);
            }, this);*/
            
        }, renderContext.$data);
        
        renderContext.$data.items.push("dd");
        wipeout.base.watched.afterNextObserveCycle(function() {
            
            renderContext.$data.items.push("ee");
            wipeout.base.watched.afterNextObserveCycle(function() {
                
                renderContext.$data.items.splice(1, 0, "ff");
                wipeout.base.watched.afterNextObserveCycle(function() {
                    renderContext.$data.items.reverse();
                });
            });
        });
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