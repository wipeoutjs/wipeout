//TODO unit test

Class("wipeout.template.templateElementBase", function () {
    
    var templateElementBase = wipeout.base.object.extend.call(Array, function templateElementBase() {
        this._super();
    });
    
    templateElementBase.extend = wipeout.base.object.extend;
    templateElementBase.prototype._super = wipeout.base.object.prototype._super;
    
    templateElementBase.prototype.serializeChildren = function() {
        
        var output = [];
        
        for(var i = 0, ii = this.length; i < ii; i++) {
            if (typeof this[i] === "string")
                output.push(this[i]);
            else if (this[i] instanceof wipeout.template.templateElement || this[i] instanceof wipeout.template.templateComment)
                output.push(this[i].serialize());
            else
                throw {
                    message: "Invalid template element",
                    value: this[i]
                };
        }
        
        return output.join("");
    }
    
    return templateElementBase;
});

Class("wipeout.template.rootTemplateElement", function () {
    
    var rootTemplateElement = wipeout.template.templateElementBase.extend(function rootTemplateElement() {
        this._super();
    });
    
    return rootTemplateElement;
});

Class("wipeout.template.templateElement", function () {
    
    var templateElement = wipeout.template.templateElementBase.extend(function templateElement(name, parentElement, inline /*optional*/) {
        this._super();
        
        this.name = name;
        
        this.attributes = {};
        if(parentElement instanceof wipeout.template.templateElementBase)
            this.parentElement = parentElement;
        else
            throw "Invalid parent element";
        
        this.inline = !!inline;
        this.nodeType = 1;
    });
    
    templateElement.prototype.serialize = function() {
        var output = [];
        
        output.splice(0, 0, "<", this.name);
        var index = 2;
        for(var i in this.attributes) {
            output.splice(index, 0, " ", i, "=", this.attributes[i].surrounding, this.attributes[i].value, this.attributes[i].surrounding);
            index+=6;
        }
        
        var children = this.serializeChildren();
        if(!children.length && this.inline) {
            output.push(" />");            
        } else {
            output.push(">");
            output.push(children);
            output.push("<" + this.name + ">");
        }
        
        return output.join("");
    }
    
    return templateElement;
});

Class("wipeout.template.templateAttribute", function () {
    
    return function templateAttribute(value, surrounding) {
        this.value = value;
        this.surrounding = surrounding;
        this.nodeType = 2;
    };
});

Class("wipeout.template.templateComment", function () {
    
    var templateComment = function templateComment(commentText) {
        this.commentText = commentText;
        this.nodeType = 8;
    };
    
    templateComment.serialize = function() {
        return "<!--" + this.commentText + "-->";
    }
    
    return templateComment;
});

Class("wipeout.template.templateString", function () {
    
    var templateComment = function templateComment(text) {
        this.text = text;
        this.nodeType = 3;
    };
    
    templateComment.serialize = function() {
        return this.text;
    }
    
    return templateComment;
});