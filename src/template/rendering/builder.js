
Class("wipeout.template.rendering.builder", function () {
        
    // generate unique ids
    var wipeoutPlaceholder = "wipeout_placeholder_id_";
    builder.uniqueIdGenerator = (function() {
        var i = Math.floor(Math.random() * 1000000000);
        return function() {
            return wipeoutPlaceholder + (++i);
        }
    }());
    
    function builder(compiledTemplate) {
        ///<summary>Build html and execute logic giving the html functionality</summary>
        ///<param name="template" type="wipeout.template.compiledTemplate" optional="false">The template to base the html on</param>
        
        this.elements = [];
        
        var htmlFragments = [];
        
        enumerateArr(compiledTemplate.html, function(html) {
            if (typeof html === "string") {
                // static html, add to output
                htmlFragments.push(html);
            } else {
                // dynamic content. Generate an id to find the html and add actions
                var id = builder.uniqueIdGenerator();
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
        ///<summary>Add dynamic content to the html</summary>
        ///<param name="renderContext" type="wipeout.template.renderContext" optional="false">The context of the dynamic content</param>
        
        var output = [];
        enumerateArr(this.elements, function(elementAction) {
            // get the element
            var element = document.getElementById(elementAction.id);
            element.removeAttribute("id");
            
            // run all actions on it
            enumerateArr(elementAction.actions, function(mod) {
                var dispose = mod.action(mod.value, element, renderContext, mod.actionName);
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