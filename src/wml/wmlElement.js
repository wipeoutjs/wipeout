var getParentElement = function() {
	///<summary>Get the parent element of this node</summary>
	///<returns type="wipeout.wml.wmlElement">The element</returns>
	
    if (this._parentElement) {
		for (var i in this._parentElement)
			if (this._parentElement[i] === this)
				return this._parentElement;
		
        delete this._parentElement;
    }
    
    return null;
};

Class("wipeout.wml.wmlElementBase", function () {
    
    var wmlElementBase = orienteer.extend(function wmlElementBase() {
        ///<summary>A wml element base</summary>
		
        this._super();
		
        ///<summary type="Number">The number of child nodes</summary>
		this.length = 0;
    });
    
    wmlElementBase.extend = orienteer.extend;
    wmlElementBase.prototype._super = orienteer.prototype._super;
    
    wmlElementBase.prototype.push = function(obj) {
        ///<summary>Add an element child</summary>
        ///<param name="obj" type="wipeout.xml.xmlElement">The element</param>
        ///<returns type="Number">The new length</returns>
		
        if(obj.getParentElement !== getParentElement)
            throw "Invalid template node";
        if(obj.getParentElement())
            throw "This node already has a parent element";
        
		this[this.length] = obj;
		this.length++;
        obj._parentElement = this;
        return this.length;
    };
    
    wmlElementBase.prototype.splice = function() {
        ///<summary>Not implemented</summary>	TODV
		
        throw "not implemented";
		
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
        ///<summary>Serialize all of the child elements of this element</summary>
        ///<returns type="String">The value</returns>
        
        var output = [];        
        wipeout.utils.obj.enumerateArr(this, function(i) {
            output.push(i.serialize());
        });
        
        return output.join("");
    }
    
    return wmlElementBase;
});

Class("wipeout.wml.wmlElement", function () {
    
    var wmlElement = wipeout.wml.wmlElementBase.extend(function wmlElement(name, inline) {
        ///<summary>A wml element</summary>
        ///<param name="name" type="String">The element name</param>
        ///<param name="inline" optional="true" type="Boolean">Determines whether the element has a closing tag</param>
		
        this._super();
        
        ///<summary type="String">The element name</summary>
        this.name = name;
        
        ///<summary type="Object">A list of attributes</summary>
        this.attributes = {};
		
        ///<summary type="Boolean">Determines whether the element has a closing tag</summary>
        this.inline = !!inline;
		
        ///<summary type="Number">1</summary>
        this.nodeType = 1;
    });
    
    wmlElement.prototype.getParentElement = getParentElement;
    
	wmlElement.prototype.getAttribute = function (attributeName) {
        ///<summary>Get attribute value by name</summary>
        ///<param name="attributeName" type="String">The attribute</param>
        ///<returns type="String">The value</returns>
		
		return this.attributes[attributeName] ?
			this.attributes[attributeName].value :
			null;
	};
	
    wmlElement.prototype.serialize = function() {
        ///<summary>Serialize the element</summary>
        ///<returns type="String">Serialize the element</returns>
		
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
        ///<summary>An attribute</summary>
        ///<param name="value" type="String">The attribute value</param>
		
        ///<summary type="String">The value</summary>
        this.value = value;
		
        ///<summary type="Number">2</summary>
        this.nodeType = 2;
    };
    
    wmlAttribute.prototype.serializeValue = function() {
        ///<summary>Serialize the attribute from "=" onwards</summary>
        ///<returns type="String">The value</returns>
		
        return '="' + this.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"';
    };    
    
    wmlAttribute.prototype.serializeContent = function() {
        ///<summary>Serialize the value</summary>
        ///<returns type="String">The value</returns>
                
        return this.value;
    };
    
    return wmlAttribute;
});

Class("wipeout.wml.wmlComment", function () {
    
    var wmlComment = function wmlComment(commentText) {
        ///<summary>A comment</summary>
        ///<param name="commentText" type="String">The comment</param>
		
        ///<summary type="String">The comment</summary>
        this.commentText = commentText;
		
        ///<summary type="Number">8</summary>
        this.nodeType = 8;
    };
    
    wmlComment.prototype.serialize = function() {
        ///<summary>Serialize</summary>
        ///<returns type="String">The value</returns>
		
        return "<!--" + this.commentText + "-->";
    };
    
    wmlComment.prototype.getParentElement = getParentElement;
    
    return wmlComment;
});

Class("wipeout.wml.wmlString", function () {
    
    var wmlString = function wmlString(text) {
        ///<summary>A text node</summary>
        ///<param name="text" type="String">The value</param>
		
        ///<summary type="String">The text</summary>
        this.text = text;
		
        ///<summary type="Number">3</summary>
        this.nodeType = 3;
    };
    
    wmlString.prototype.serialize = function() {
        ///<summary>Serialize</summary>
        ///<returns type="String">The value</returns>
		
        return this.text;
    }
    
    wmlString.prototype.getParentElement = getParentElement;
    
    return wmlString;
});