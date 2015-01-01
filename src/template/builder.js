
Class("wipeout.template.builder", function () {
        
    var wipeoutPlaceholder = "wipeout_placeholder_id_";
    var generator = (function() {
        var i = Math.floor(Math.random() * 1000000000);
        return function() {
            return wipeoutPlaceholder + (++i);
        }
    }());
    
    function builder(template) {
        var htmlFragments = [];
        
        this.elements = [];
        enumerateArr(template.html, function(html) {
            if (typeof html === "string") {
                htmlFragments.push(html);
            } else {
                var id = generator();
                htmlFragments.push(" id=\"" + id + "\"");
                this.elements.push({
                    id: id,
                    actions: html
                });
            }
        }, this);
        
        this.html = htmlFragments.join("");
    }
    
    builder.prototype.execute = function(renderContext) {
        
        var output = [];
        enumerateArr(this.elements, function(elementAction) {
            var element = document.getElementById(elementAction.id);
            enumerateArr(elementAction.actions, function(mod) {
                var dispose = mod.action(mod.value, element, renderContext);
                if(dispose instanceof Function)
                    output.push(dispose);
            });
        }, this);
    
        return function() {
            enumerateArr(output.splice(0, output.length), function(f) {
                f();
            });
        };
    }
    
    return builder;
});