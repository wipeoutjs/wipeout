
Class("wipeout.template.rendering.builder", function () {
        
    // generate unique ids
    var wipeoutPlaceholder = "wipeout_placeholder_id_";
    builder.uniqueIdGenerator = (function() {
        var i = Math.floor(Math.random() * 1000000000);
        return function() {
			///<summary>Get a unique html id</summary>
			///<returns type="String">The id</returns>
			
            return wipeoutPlaceholder + (++i);
        }
    }());
    
    function builder(compiledTemplate) {
        ///<summary>Build html and execute logic giving the html functionality</summary>
        ///<param name="compiledTemplate" type="wipeout.template.compiledTemplate" optional="false">The template to base the html on</param>
        
        ///<summary type="Array">A list of processors to add dynamic content</summary>
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
        
        ///<summary type="String">The static html for this builder</summary>
        this.html = htmlFragments.join("");
    };
	
	builder.prototype.execute = function(renderContext) {
        ///<summary>Add dynamic content to the html</summary>
        ///<param name="renderContext" type="wipeout.template.renderContext" optional="false">The context of the dynamic content</param>
		///<returns type="Function">A dispose function</returns>
		
        var output = [];
        enumerateArr(this.elements, function(elementAction) {
            // get the element
            var element = document.getElementById(elementAction.id);
            element.removeAttribute("id");
            
            // run all actions on it
            enumerateArr(elementAction.actions, function(setter) {				
				output.push.apply(output, setter.applyToElement(element, renderContext));
            });
        }, this);
    
        return function() {
            enumerateArr(output.splice(0, output.length), function(d) {
                d.dispose();
            });
        };
    }
    
    return builder;
});