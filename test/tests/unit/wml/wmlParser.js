module("wipeout.wml.wmlParser", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("parse", "elements, multiple levels", true, function(methods, classes, subject, invoker) {
    
    // arrange	
    // act
    var output = wipeout.wml.wmlParser("<form><label>Hello</label></form><span>Not Hello</span>");
	
    //assert
    strictEqual(output.name, "div");
    strictEqual(output.length, 2);
	
    strictEqual(output[0].name, "form");
    strictEqual(output[0].length, 1);
	
    strictEqual(output[0][0].name, "label");
    strictEqual(output[0][0].length, 1);
	
    strictEqual(output[0][0][0].text, "Hello");
	
    strictEqual(output[1].name, "span");
    strictEqual(output[1].length, 1);
	
    strictEqual(output[1][0].text, "Not Hello");
});

testUtils.testWithUtils("parse", "element, text, comment", true, function(methods, classes, subject, invoker) {
    
    // arrange	
    // act
    var output = wipeout.wml.wmlParser("<div></div> something <!-- yep -->");
	
    //assert
	ok(output instanceof wipeout.wml.wmlElement)
    strictEqual(output.name, "div");
    strictEqual(output.length, 3);
	
	ok(output[0] instanceof wipeout.wml.wmlElement)
    strictEqual(output[0].name, "div");
	
    strictEqual(output[1].text, " something ");
	
    strictEqual(output[2].commentText, " yep ");
});

testUtils.testWithUtils("parse", "attributes", true, function(methods, classes, subject, invoker) {
    
    // arrange	
    // act
    var output = wipeout.wml.wmlParser("<div data-a-val='something'></div>");
	
    //assert
	ok(output instanceof wipeout.wml.wmlElement)
    strictEqual(output.name, "div");
    strictEqual(output.length, 1);
	
	ok(output[0] instanceof wipeout.wml.wmlElement)
    strictEqual(output[0].attributes["data-a-val"].value, "something");
});