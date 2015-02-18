//TODO unit test

var getParentElement = function() {
    if (this._parentElement) {
        if(this._parentElement.indexOf(this) === -1)
            delete this._parentElement;
    }
    
    return this._parentElement;
};

Class("wipeout.template.templateElementBase", function () {
    
    var templateElementBase = wipeout.base.object.extend.call(Array, function templateElementBase() {
        this._super();
    });
	
	obsjs.observeTypes.computed.nonArrayType(templateElementBase);
    
    templateElementBase.extend = wipeout.base.object.extend;
    templateElementBase.prototype._super = wipeout.base.object.prototype._super;
    
    templateElementBase.prototype.push = function(obj) {
        if(obj.getParentElement !== getParentElement)
            throw "Invalid template node";
        if(obj.getParentElement())
            throw "This node already has a parent element";
        
        var output = this._super(obj);
        obj._parentElement = this;
        return output;
    };
    
    templateElementBase.prototype.splice = function() {
        
        for(var i = 2, ii = arguments.length; i < ii; i++) {
            if(!arguments[i].getParentElement)
                throw "Invalid template node";
            if(arguments[i].getParentElement())
                throw "This node already has a parent element";
        }
        
        var output = this._super.apply(this, arguments);
        
        for(var i = 2, ii = arguments.length; i < ii; i++) {
            arguments[i]._parentElement = this;
        }
        
        return output;
    };
    
    templateElementBase.prototype.serializeContent = function() {
        
        var output = [];        
        wipeout.utils.obj.enumerateArr(this, function(i) {
            output.push(i.serialize());
        });
        
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
    
    var templateElement = wipeout.template.templateElementBase.extend(function templateElement(name, inline /*optional*/) {
        this._super();
        
        this.name = name;
        
        this.attributes = {};        
        this.inline = !!inline;
        this.nodeType = 1;
    });
    
    templateElement.prototype.getParentElement = getParentElement;
    
    templateElement.prototype.serialize = function() {
        var output = [];
        
        output.splice(0, 0, "<", this.name);
        var index = 2;
        for(var i in this.attributes) {
            output.splice(index, 0, " ", i, this.attributes[i].serializeValue());
            index+=3;
        }
        
        var children = this.serializeContent();
        if(!children.length && this.inline) {
            output.push(" />");            
        } else {
            output.push(">");
            output.push(children);
            output.push("</" + this.name + ">");
        }
        
        return output.join("");
    }
    
    return templateElement;
});

Class("wipeout.template.templateAttribute", function () {
    
    function templateAttribute(value, surrounding) {
        this.value = value;
        this.surrounding = surrounding;
        this.nodeType = 2;
    };
    
    templateAttribute.prototype.serializeValue = function() {
        if (!this.value && !this.surrounding) return "";
        
        if (!this.surrounding) return "=" + this.value;
        
        return "=" + this.surrounding + this.value + this.surrounding;
    };    
    
    templateAttribute.prototype.serializeContent = function() {
                
        return this.value;
    }
    
    return templateAttribute;
});

Class("wipeout.template.templateComment", function () {
    
    var templateComment = function templateComment(commentText) {        
        this.commentText = commentText;
        this.nodeType = 8;
    };
    
    templateComment.prototype.serialize = function() {
        return "<!--" + this.commentText + "-->";
    };
    
    templateComment.prototype.getParentElement = getParentElement;
    
    return templateComment;
});

Class("wipeout.template.templateString", function () {
    
    var templateString = function templateString(text) {
        this.text = text;
        this.nodeType = 3;
    };
    
    templateString.prototype.serialize = function() {
        return this.text;
    }
    
    templateString.prototype.getParentElement = getParentElement;
    
    return templateString;
});