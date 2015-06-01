module("integration: wipeout.template.rendering.renderedContentCommentHelper", {
    setup: function () {},
    teardown: function () {}
});

test("init", function() {
	
	// arrange
    var div1 = document.createElement("div"), name = "KJBKJB";
    
    var quf = document.getElementById("qunit-fixture");
    quf.appendChild(div1);
    
	// act
    var op = wipeout.template.rendering.renderedContentCommentHelper.prototype.init(null, div1, name);
	
	// assert
    strictEqual(op.opening.nodeType, 8);
    strictEqual(op.opening.textContent, " " + name + " ");
    strictEqual(op.closing.nodeType, 8);
    strictEqual(op.closing.textContent, " /" + name + " ");
    
    strictEqual(quf.firstChild, op.opening);
    strictEqual(op.opening.nextSibling, op.closing);
    strictEqual(op.closing.nextSibling, null);
    strictEqual(div1.parentElement, null);
});

test("rename", function() {
	
	// arrange
    var name = "KJBKJBB",
        input = {
            openingTag: {},
            closingTag: {}
        };
    
	// act
    wipeout.template.rendering.renderedContentCommentHelper.prototype.rename(input, name);
	
	// assert
    strictEqual(input.openingTag.nodeValue, " " + name + " ");
    strictEqual(input.closingTag.nodeValue, " /" + name + " ");
});

test("empty", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    quf.innerHTML = '<div id="div1"></div><div>asdasd</div>sdsdfsd<!-- asdsad --><div id="div2"></div>';
    
	// act
    wipeout.template.rendering.renderedContentCommentHelper.prototype.empty({
        openingTag: document.getElementById("div1"),
        closingTag: document.getElementById("div2")
    });
	
	// assert
    strictEqual(quf.childNodes.length, 2);
    strictEqual(quf.childNodes[0], document.getElementById("div1"));
    strictEqual(quf.childNodes[1], document.getElementById("div2"));
});

test("empty", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    quf.innerHTML = '<div id="div1"></div><div>asdasd</div>sdsdfsd<!-- asdsad --><div id="div2"></div>';
    
	// act
    wipeout.template.rendering.renderedContentCommentHelper.prototype.empty({
        openingTag: document.getElementById("div1"),
        closingTag: document.getElementById("div2")
    });
	
	// assert
    strictEqual(quf.childNodes.length, 2);
    strictEqual(quf.childNodes[0], document.getElementById("div1"));
    strictEqual(quf.childNodes[1], document.getElementById("div2"));
});

test("dispsoseOf", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    quf.innerHTML = '<div id="div1"></div><div>asdasd</div>sdsdfsd<!-- asdsad --><div id="div2"></div>';
    
	// act
    wipeout.template.rendering.renderedContentCommentHelper.prototype.disposeOf.call({
        empty: wipeout.template.rendering.renderedContentCommentHelper.prototype.empty}, {
        openingTag: document.getElementById("div1"),
        closingTag: document.getElementById("div2")
    });
	
	// assert
    strictEqual(quf.childNodes.length, 0);
});

test("appendHtml, comment", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    var closing = document.createComment("KJBKJBK");
    quf.appendChild(document.createElement("div"));
    quf.appendChild(closing);
    
	// act
    wipeout.template.rendering.renderedContentCommentHelper.prototype.appendHtml({
        closingTag: closing
    }, "<span></span><!--dfdfd-->asdkjbjbasdkjb");
	
	// assert
    strictEqual(closing.previousSibling.previousSibling.previousSibling.nodeType, 1);
    strictEqual(closing.previousSibling.previousSibling.previousSibling.tagName, "SPAN");
    strictEqual(closing.previousSibling.previousSibling.nodeType, 8);
    strictEqual(closing.previousSibling.previousSibling.textContent, "dfdfd");
    strictEqual(closing.previousSibling.nodeType, 3);
    strictEqual(closing.previousSibling.textContent, "asdkjbjbasdkjb");
});

test("appendHtml, element", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    var closing = document.createElement("div");
    quf.appendChild(document.createElement("div"));
    quf.appendChild(closing);
    
	// act
    wipeout.template.rendering.renderedContentCommentHelper.prototype.appendHtml({
        closingTag: closing
    }, "<span></span><!--dfdfd-->asdkjbjbasdkjb");
	
	// assert
    strictEqual(closing.previousSibling.previousSibling.previousSibling.nodeType, 1);
    strictEqual(closing.previousSibling.previousSibling.previousSibling.tagName, "SPAN");
    strictEqual(closing.previousSibling.previousSibling.nodeType, 8);
    strictEqual(closing.previousSibling.previousSibling.textContent, "dfdfd");
    strictEqual(closing.previousSibling.nodeType, 3);
    strictEqual(closing.previousSibling.textContent, "asdkjbjbasdkjb");
});

test("prepend", function() {
	
	// arrange
    var div1 = document.createElement("div"), 
        div2 = document.createElement("div"), 
        comment = document.createComment("asdada"),
        text = document.createTextNode("asasdasd");
    
    document.getElementById("qunit-fixture").appendChild(div1);
    document.getElementById("qunit-fixture").appendChild(document.createElement("div"));
    
	// act
    wipeout.template.rendering.renderedContentCommentHelper.prototype.prepend({openingTag: div1}, [div2, comment, text]);
	
	// assert
    strictEqual(div1.nextSibling, div2);
    strictEqual(div2.nextSibling, comment);
    strictEqual(comment.nextSibling, text);
});

test("detatch", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    quf.innerHTML = '<div id="div1"></div><div>asdasd</div>sdsdfsd<!-- asdsad --><div id="div2"></div><span></span>';
    
	// act
    var op = wipeout.template.rendering.renderedContentCommentHelper.prototype.detatch({
        openingTag: document.getElementById("div1"),
        closingTag: document.getElementById("div2")
    });
	
	// assert
    strictEqual(quf.childNodes.length, 1);
    strictEqual(quf.childNodes[0].tagName, "SPAN");
    
    strictEqual(op.length, 5);
    for (var i = 0, ii = op.length; i < ii; i++)
        strictEqual(op[i].parentNode, null);
});

test("allHtml", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    quf.innerHTML = '<div id="div1"></div><div>asdasd</div>sdsdfsd<!-- asdsad --><div id="div2"></div><span></span>';
    
	// act
    var op = wipeout.template.rendering.renderedContentCommentHelper.prototype.allHtml({
        openingTag: document.getElementById("div1"),
        closingTag: document.getElementById("div2")
    });
	
	// assert
    strictEqual(op.length, 5);
    for (var i = 0, ii = op.length; i < ii; i++)
        strictEqual(op[i].parentNode, quf);
});