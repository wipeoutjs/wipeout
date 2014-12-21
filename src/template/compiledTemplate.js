
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
        
        enumerateArr(template, this.addNode, this);
            
        // concat successive strings
        for (var i = this.html.length - 1; i > 0; i--) {
            if (typeof this.html[i] === string && typeof this.html[i - 1] === string)
                this.html[i - 1] += this.html.splice(i, 1)[0];
        }
        
        // protection from infite loops
        delete this._addedElements;
    };
    
    compiledTemplate.prototype.addNonElement = function(node) {
        this.html.push(node.serialize());
    };
    
    compiledTemplate.prototype.addViewModel = function(vmNode) {
        this.html.push("<script");
        this.html.push(idPlaceholder);
        this.modifications.push([{
            action: attributes.wipeoutCreateViewModel,
            value: vmNode
        }]);
        
        this.html.push(' type="placeholder"></script>');
    };
    
    compiledTemplate.prototype.addElement = function(element) {
        this.html.push("<" + element.name);

        var modifications;
        for (var attr in element.attributes) {

            // if it is a special attribute
            if (attributes[attr]) {
                
                // if it is the first special attribute for this element
                if (!modifications) {
                    modifications = [];
                    
                    // give it a unique id
                    this.html.push(idPlaceholder);
                    this.modifications.push(modifications);
                }

                // ensure the id modification is the first to be done
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
                this.addNode(element);
            }, this);
            this.html.push("</" + element.name + ">");
        }
    };
    
    compiledTemplate.prototype.addNode = function(node) {
        
        if(this._addedElements.indexOf(node) !== -1)
            throw "Infinite loop"; //TODO
        
        this._addedElements.push(node);
        
        if (node.nodeType !== 1)
            this.addNonElement(node);
        else if (wipeout.utils.obj.getObject(node.name))//TODO
            this.addViewModel(node);
        else
            this.addElement(node);
        
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
    
    // return dispose function
    var attributes = {
        "wo-click": function (value, element, renderContext) {
            return function() {
            };
        },
        id: function (value, element, renderContext) {
            renderContext.$this.templateItems[value] = element;
            element.id = value;
        },
        wipeoutCreateViewModel: function (value, element, renderContext) {
            new wipeout.template.viewModelElement(element, value);
        }
    };
        
    return compiledTemplate;
});