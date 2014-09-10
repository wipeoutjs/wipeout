//TODO unit test

Class("wipeout.template.xmlElementBase", function () {
    
    var xmlElementBase = wipeout.base.object.extend.call(Array, function xmlElementBase() {
        this._super();
    });
    
    xmlElementBase.extend = wipeout.base.object.extend;
    
    xmlElementBase.prototype.serializeChildren = function() {
        
        var output = [];
        
        for(var i = 0, ii = this.length; i < ii; i++) {
            if (typeof this[i] === "string")
                output.push(this[i]);
            else if (this[i] instanceof wipeout.template.xmlElement || this[i] instanceof wipeout.template.xmlComment)
                output.push(this[i].serialize());
            else
                throw {
                    message: "Invalid xml element",
                    value: this[i]
                };
        }
        
        return output.join("");
    }
    
    return xmlElementBase;
});

Class("wipeout.template.rootXmlElement", function () {
    
    var rootXmlElement = wipeout.template.xmlElementBase.extend(function rootXmlElement() {
        this._super();
    });
    
    return rootXmlElement;
});

Class("wipeout.template.xmlElement", function () {
    
    var xmlElement = wipeout.template.xmlElementBase.extend(function xmlElement(name, parentElement, inline /*optional*/) {
        this._super(name);
        
        this.attributes = {};
        if(parentElement instanceof wipeout.template.xmlElementBase)
            this.parentElement = parentElement;
        else
            throw "Invalid parent element";
        
        this.inline = !!inline;
    });
    
    xmlElement.prototype.serialize = function() {
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
    
    return xmlElement;
});

Class("wipeout.template.xmlAttribute", function () {
    
    return function xmlAttribute(value, surrounding) {
        this.value = value;
        this.surrounding = surrounding;
    };
});

Class("wipeout.template.xmlComment", function () {
    
    var xmlComment = function xmlComment(commentText) {
        this.commentText = commentText;
    };
    
    xmlComment.serialize = function() {
        return "<!--" + this.commentText + "-->";
    }
    
    return xmlComment;
});