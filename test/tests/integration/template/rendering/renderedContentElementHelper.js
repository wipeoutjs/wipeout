module("integration: wipeout.template.rendering.renderedContentElementHelper", {
    setup: function () {},
    teardown: function () {}
});

test("init", function() {
	
	// arrange
    var div1 = document.createElement("div"), name = "KJBKJB";
    
    var quf = document.getElementById("qunit-fixture");
    quf.appendChild(div1);
    
	// act
    var op = wipeout.template.rendering.renderedContentElementHelper.prototype.init(null, div1, name);
	
	// assert
    strictEqual(op.opening, div1);
    strictEqual(op.closing, div1);
    
    strictEqual(quf.firstChild, op.opening);
    strictEqual(div1.getAttribute("data-wo-view-model"), name);
});

test("rename", function() {
	
	// arrange
    var name = "KJBKJBB",
        input = {
            openingTag: document.createElement("div")
        };
    
	// act
    wipeout.template.rendering.renderedContentElementHelper.prototype.rename(input, name);
	
	// assert
    strictEqual(input.openingTag.getAttribute("data-wo-view-model"), name);
});

test("empty", function() {
	
	// arrange
    var input = {
            openingTag: document.createElement("div")
        };
    
    input.openingTag.innerHTML = "KJBKJBKJBKJBKJBKJQBKJAWDBKJAWDKJAWDKJAWB";
    
	// act
    wipeout.template.rendering.renderedContentElementHelper.prototype.empty(input);
	
	// assert
    strictEqual(input.openingTag.innerHTML, "");
});

test("dispsoseOf", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    quf.innerHTML = '<div id="div1" data-wo-view-model="kjbskjdbas">laskdlaskhdlaksd</div>';
    var div1 = document.getElementById("div1");
    
	// act
    wipeout.template.rendering.renderedContentElementHelper.prototype.disposeOf.call({
        empty: wipeout.template.rendering.renderedContentElementHelper.prototype.empty}, {
        openingTag: document.getElementById("div1")
    });
	
	// assert
    strictEqual(div1.childNodes.length, 0);
    strictEqual(div1.getAttribute("data-wo-view-model"), null);
});

test("appendHtml, comment", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    var opening = document.createElement("div");
    opening.appendChild(document.createElement("div"));
    quf.appendChild(opening);
    
	// act
    wipeout.template.rendering.renderedContentElementHelper.prototype.appendHtml({
        openingTag: opening
    }, "<span></span><!--dfdfd-->asdkjbjbasdkjb");
	
	// assert
    strictEqual(opening.firstChild.nextSibling.nodeType, 1);
    strictEqual(opening.firstChild.nextSibling.tagName, "SPAN");
    strictEqual(opening.firstChild.nextSibling.nextSibling.nodeType, 8);
    strictEqual(opening.firstChild.nextSibling.nextSibling.textContent, "dfdfd");
    strictEqual(opening.firstChild.nextSibling.nextSibling.nextSibling.nodeType, 3);
    strictEqual(opening.firstChild.nextSibling.nextSibling.nextSibling.textContent, "asdkjbjbasdkjb");
});

test("prepend, has firstChild", function() {
	
	// arrange
    var div1 = document.createElement("div"), 
        div2 = document.createElement("div"), 
        comment = document.createComment("asdada"),
        text = document.createTextNode("asasdasd");
    
    document.getElementById("qunit-fixture").appendChild(div1);
    div1.appendChild(document.createElement("div"));
    
	// act
    wipeout.template.rendering.renderedContentElementHelper.prototype.prepend({openingTag: div1}, [div2, comment, text]);
	
	// assert
    strictEqual(div1.firstChild, div2);
    strictEqual(div2.nextSibling, comment);
    strictEqual(comment.nextSibling, text);
    ok(text.nextSibling);
});

test("prepend, no firstChild", function() {
	
	// arrange
    var div1 = document.createElement("div"), 
        div2 = document.createElement("div"), 
        comment = document.createComment("asdada"),
        text = document.createTextNode("asasdasd");
    
    document.getElementById("qunit-fixture").appendChild(div1);
    
	// act
    wipeout.template.rendering.renderedContentElementHelper.prototype.prepend({openingTag: div1}, [div2, comment, text]);
	
	// assert
    strictEqual(div1.firstChild, div2);
    strictEqual(div2.nextSibling, comment);
    strictEqual(comment.nextSibling, text);
    ok(!text.nextSibling);
});

test("detatch", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    quf.innerHTML = '<div id="div1"><div>asdasd</div>sdsdfsd<!-- asdsad --></div><span></span>';
    var div1 = document.getElementById("div1");
    
	// act
    var op = wipeout.template.rendering.renderedContentElementHelper.prototype.detatch({
        openingTag: div1
    });
	
	// assert
    strictEqual(quf.childNodes.length, 1);
    strictEqual(quf.childNodes[0].tagName, "SPAN");
    
    strictEqual(op.length, 1);
    strictEqual(op[0], div1);
    strictEqual(op[0].parentNode, null);
});

test("allHtml", function() {
	
	// arrange
    var quf = document.getElementById("qunit-fixture");
    quf.innerHTML = '<div id="div1"><div>asdasd</div>sdsdfsd<!-- asdsad --></div><span></span>';
    var div1 = document.getElementById("div1");
    
	// act
    var op = wipeout.template.rendering.renderedContentElementHelper.prototype.allHtml({
        openingTag: div1
    });
	
	// assert    
    strictEqual(op.length, 1);
    strictEqual(op[0], div1);
    strictEqual(op[0].parentNode, quf);
});