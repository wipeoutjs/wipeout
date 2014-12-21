
Class("wipeout.template.builder", function () {
        
    var wipeoutPlaceholder = "wipeout_placeholder_";
    var generator = (function() {
        var i = 0;
        return function() {
            return wipeoutPlaceholder + (++i);
        }
    }());
    
    function builder(template) {
        var htmlFragments = [];
        
        var ids = [];
        enumerateArr(template.html, function(html, i) {
            if (html === wipeout.template.compiledTemplate.idPlaceholder) {
                var id = generator();
                htmlFragments.push(" id=\"" + id + "\"");
                ids.push(id);
            } else {
                htmlFragments.push(html);
            }
        });
        
        this.html = htmlFragments.join("");
        this.modifications = template.modifications;
        this.ids = ids;
        
        // the ammount of idPlaceholders should correspond to the amount of modifications
        if(this.modifications.length !== this.ids.length) throw "Invalid html engine";
    }
    
    builder.prototype.execute = function(renderContext) {
        
        var output = [];
        enumerateArr(this.ids, function(id, i) {
            var element = document.getElementById(id);
            enumerateArr(this.modifications[i], function(mod) {
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