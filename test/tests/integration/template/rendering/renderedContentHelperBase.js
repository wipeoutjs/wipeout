module("integration: wipeout.template.rendering.renderedContentHelperBase", {
    setup: function () {},
    teardown: function () {}
});

test("insertBefore", function() {
	
	// arrange
    var div1 = document.createElement("div"), 
        div2 = document.createElement("div"), 
        comment = document.createComment("asdada"),
        text = document.createTextNode("asasdasd");
    
    document.getElementById("qunit-fixture").appendChild(div1);
    
	// act
    wipeout.template.rendering.renderedContentHelperBase.prototype.insertBefore({openingTag: div1}, [div2, comment, text]);
	
	// assert
    strictEqual(div1.previousSibling, text);
    strictEqual(text.previousSibling, comment);
    strictEqual(comment.previousSibling, div2);
});

test("insertAfter, is last", function() {
	
	// arrange
    var div1 = document.createElement("div"), 
        div2 = document.createElement("div"), 
        comment = document.createComment("asdada"),
        text = document.createTextNode("asasdasd");
    
    document.getElementById("qunit-fixture").appendChild(div1);
    
	// act
    wipeout.template.rendering.renderedContentHelperBase.prototype.insertAfter({closingTag: div1}, [div2, comment, text]);
	
	// assert
    strictEqual(text.previousSibling, comment);
    strictEqual(comment.previousSibling, div2);
    strictEqual(div2.previousSibling, div1);
});

test("insertAfter, is not last", function() {
	
	// arrange
    var div1 = document.createElement("div"), 
        div2 = document.createElement("div"), 
        comment = document.createComment("asdada"),
        text = document.createTextNode("asasdasd");
    
    document.getElementById("qunit-fixture").appendChild(div1);
    document.getElementById("qunit-fixture").appendChild(document.createElement("div"));
    
	// act
    wipeout.template.rendering.renderedContentHelperBase.prototype.insertAfter({closingTag: div1}, [div2, comment, text]);
	
	// assert
    strictEqual(text.previousSibling, comment);
    strictEqual(comment.previousSibling, div2);
    strictEqual(div2.previousSibling, div1);
});

function a() {
    
    helperBase.prototype.insertBefore = function (renderedContent, content) {
		///<summary>Insert content before the renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content to insert the content before</param>
        ///<param name="content" type="[Element]">The content to insert</param>
		
		enumerateArr(content, function (node) {
			this.parentNode.insertBefore(node, this);
		}, renderedContent.openingTag);
    };
    
    helperBase.prototype.insertAfter = function (renderedContent, content) {
		///<summary>Insert content the renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content to insert the content after</param>
        ///<param name="content" type="[Element]">The content to append</param>
		
		if (renderedContent.closingTag.nextSibling)
			renderedContent.closingTag.parentNode.insertBefore(content[content.length - 1], renderedContent.closingTag.nextSibling);
		else
			renderedContent.closingTag.parentNode.appendChild(content[content.length - 1]);
		
		for (var i = content.length - 2; i >= 0; i--)
			content[i + 1].parentNode.insertBefore(content[i], content[i + 1]);
    };
}