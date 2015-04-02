var getParentElement = function() {
    if (this._parentElement) {
        if(this._parentElement.indexOf(this) === -1)
            delete this._parentElement;
    }
    
    return this._parentElement;
};

Class("wipeout.wml.wmlElementBase", function () {
    
    var wmlElementBase = wipeout.base.object.extend.call(Array, function wmlElementBase() {
        this._super();
    });
	
	obsjs.observeTypes.computed.nonArrayType(wmlElementBase);
    
    wmlElementBase.extend = wipeout.base.object.extend;
    wmlElementBase.prototype._super = wipeout.base.object.prototype._super;
    
    wmlElementBase.prototype.push = function(obj) {
        if(obj.getParentElement !== getParentElement)
            throw "Invalid template node";
        if(obj.getParentElement())
            throw "This node already has a parent element";
        
        var output = this._super(obj);
        obj._parentElement = this;
        return output;
    };
    
    wmlElementBase.prototype.splice = function() {
        
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
    
    wmlElementBase.prototype.serializeContent = function() {
        
        var output = [];        
        wipeout.utils.obj.enumerateArr(this, function(i) {
            output.push(i.serialize());
        });
        
        return output.join("");
    }
    
    return wmlElementBase;
});

Class("wipeout.wml.rootWmlElement", function () {
    
    var rootWmlElement = wipeout.wml.wmlElementBase.extend(function rootWmlElement() {
        this._super();
		
		this.nodeType = 9;
    });
    
    return rootWmlElement;
});

Class("wipeout.wml.wmlElement", function () {
    
    var wmlElement = wipeout.wml.wmlElementBase.extend(function wmlElement(name, inline /*optional*/) {
        this._super();
        
        this.name = name;
        
        this.attributes = {};        
        this.inline = !!inline;
        this.nodeType = 1;
    });
    
    wmlElement.prototype.getParentElement = getParentElement;
    
	wmlElement.prototype.getAttribute = function (attributeName) {
		return this.attributes[attributeName] ?
			this.attributes[attributeName].value :
			null;
	};
	
    wmlElement.prototype.serialize = function() {
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
    
    return wmlElement;
});

Class("wipeout.wml.wmlAttribute", function () {
    
    function wmlAttribute(value) {
        this.value = value;
        this.nodeType = 2;
    };
    
    wmlAttribute.prototype.serializeValue = function() {
		
        return '="' + this.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"';
    };    
    
    wmlAttribute.prototype.serializeContent = function() {
                
        return this.value;
    };
    
    return wmlAttribute;
});

Class("wipeout.wml.wmlComment", function () {
    
    var wmlComment = function wmlComment(commentText) {        
        this.commentText = commentText;
        this.nodeType = 8;
    };
    
    wmlComment.prototype.serialize = function() {
        return "<!--" + this.commentText + "-->";
    };
    
    wmlComment.prototype.getParentElement = getParentElement;
    
    return wmlComment;
});

Class("wipeout.wml.wmlString", function () {
    
    var wmlString = function wmlString(text) {
        this.text = text;
        this.nodeType = 3;
    };
    
    wmlString.prototype.serialize = function() {
        return this.text;
    }
    
    wmlString.prototype.getParentElement = getParentElement;
    
    return wmlString;
});