
Class("wipeout.template.compiledTemplate", function () {
    
    var wipeoutPlaceholder = "wipeout_placeholder_", string = "string", idString = "id";
    var generator = (function() {
        var i = 0;
        return function() {
            return wipeoutPlaceholder + (++i);
        }
    }());
    
    var idPlaceholder = {};
    var compiledTemplate = function compiledTemplate(template) {
        ///<summary>The wipeout template engine, inherits from ko.templateEngine</summary>
        
        this.html = [];
        this.modifications = [];
        this._addedElements = [];
        
        enumerateArr(template, this.addElement, this);
            
        // concat successive strings
        for (var i = this.html.length - 1; i > 0; i--) {
            if (typeof this.html[i] === string && typeof this.html[i - 1] === string)
                this.html[i - 1] += this.html.splice(i, 1)[0];
        }
    };
    
    compiledTemplate.prototype.addElement = function(element) {
        
        if(this._addedElements.indexOf(element) !== -1)
            throw "Infinite loop"; //TODO
        
        this._addedElements.push(element);
        
        if (element.nodeType !== 1) {
            this.html.push(element.serialize());
            return;
        }

        this.html.push("<" + element.name);

        var modifications;
        for (var attr in element.attributes) {

            if (attributes[attr]) {
                if (!modifications) {
                    modifications = [];
                    this.html.push(idPlaceholder);
                    this.modifications.push(modifications);
                }

                attr === idString ?
                    modifications.splice(0, 0, {
                        action: attributes[attr],
                        value: element.attributes[attr].value
                    }) :
                    modifications.push({
                        action: attributes[attr],
                        value: element.attributes[attr].value
                    });
            } else {
                this.html.push(" " + attr + element.attributes[attr].serializeValue()); //TODO: put this on attr class
            }
        }

        if (element.inline) {
            this.html.push(" />");
        } else {
            this.html.push(">");
            enumerateArr(element, function(element) {
                this.addElement(element);
            }, this);
            this.html.push("</" + element.name + ">");
        }
    };
    
    compiledTemplate.prototype.getBuilder = function() {
        return new builder(this);
    };
    
    function builder(template) {
        var htmlFragments = [];
        
        var ids = [];
        enumerateArr(template.html, function(html, i) {
            if (html === idPlaceholder) {
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
        
        if(this.modifications.length !== this.ids.length) throw "Invalid html engine";
    }
    
    builder.prototype.execute = function(renderContext) {
        enumerateArr(this.ids, function(id, i) {
            var element = document.getElementById(id);
            enumerateArr(this.modifications[i], function(mod) {
                mod.action(mod.value, element, renderContext);
            });
        }, this); 
    }
    
    var attributes = {
        "wo-click": function (value, element, renderContext) {
        },
        id: function (value, element, renderContext) {
            renderContext.$this.templateItems[value] = element;
            element.id = value;
        }
    }
        
    return compiledTemplate;
});