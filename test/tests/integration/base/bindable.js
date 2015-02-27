
var class1, class2;
module("wipeout.base.bindable, integaration", {
    setup: function() {
		class1 = wipeout.base.bindable.extend(function () { this._super(); });
		class2 = class1.extend(function () { this._super(); });
    },
    teardown: function() {
    }
});

test("addGlobalParser, simple, string", function() {
    // arrange
	class2.addGlobalParser("prop", "regexp");
	
	// act
	var parser1 = new class1().getGlobalParser("prop");
	var parser2 = new class2().getGlobalParser("prop");
	var parser3 = class1.getGlobalParser("prop");
	var parser4 = class2.getGlobalParser("prop");
	
	// assert
	ok(!parser1);
	strictEqual(parser2, wipeout.template.parsers["regexp"]);
	ok(!parser3);
	strictEqual(parser4, wipeout.template.parsers["regexp"]);
});

test("addGlobalParser, simple, function", function() {
    // arrange
	var p = function () {}
	class2.addGlobalParser("prop", p);
	
	// act
	var parser1 = new class1().getGlobalParser("prop");
	var parser2 = new class2().getGlobalParser("prop");
	var parser3 = class1.getGlobalParser("prop");
	var parser4 = class2.getGlobalParser("prop");
	
	// assert
	ok(!parser1);
	strictEqual(parser2, p);
	ok(!parser3);
	strictEqual(parser4, p);
});

test("addGlobalParser, inheritance", function() {
    // arrange
	class1.addGlobalParser("prop", "regexp");
	
	// act
	var parser1 = new class1().getGlobalParser("prop");
	var parser2 = new class2().getGlobalParser("prop");
	var parser3 = class1.getGlobalParser("prop");
	var parser4 = class2.getGlobalParser("prop");
	
	// assert
	strictEqual(parser1, wipeout.template.parsers["regexp"]);
	strictEqual(parser2, wipeout.template.parsers["regexp"]);
	strictEqual(parser3, wipeout.template.parsers["regexp"]);
	strictEqual(parser4, wipeout.template.parsers["regexp"]);
});

test("addGlobalParser, invalid parser", function() {
    // arrange
	// act
	// assert
	throws(function () {
		class2.addGlobalParser("prop", {});
	});
});


test("addGlobalParser, invalid parser name", function() {
    // arrange
	// act
	// assert
	throws(function () {
		class2.addGlobalParser("prop", "KJBKJBJ");
	});
});

test("addGlobalParser, multiple parsers", function() {
    // arrange
	var input = {}, output1 = {}, output2 = {};
	class2.addGlobalParser("prop", function () {
		strictEqual(input, arguments[0]);
		return output1;
	});
	class2.addGlobalParser("prop", function () {
		strictEqual(output1, arguments[0]);
		return output2;
	});
	
	// act
	var parser1 = new class2().getGlobalParser("prop")(input);
	
	// assert
	strictEqual(parser1, output2);
});

test("addGlobalBindingType, simple", function() {
    // arrange
	class2.addGlobalBindingType("prop", "ow");
	
	// act
	var parser1 = new class1().getGlobalBindingType("prop");
	var parser2 = new class2().getGlobalBindingType("prop");
	var parser3 = class1.getGlobalBindingType("prop");
	var parser4 = class2.getGlobalBindingType("prop");
	
	// assert
	ok(!parser1);
	strictEqual(parser2, "ow");
	ok(!parser3);
	strictEqual(parser4, "ow");
});

test("addGlobalBindingType, inheritance", function() {
    // arrange
	class1.addGlobalBindingType("prop", "ow");
	
	// act
	var parser1 = new class1().getGlobalBindingType("prop");
	var parser2 = new class2().getGlobalBindingType("prop");
	var parser3 = class1.getGlobalBindingType("prop");
	var parser4 = class2.getGlobalBindingType("prop");
	
	// assert
	strictEqual(parser1, "ow");
	strictEqual(parser2, "ow");
	strictEqual(parser3, "ow");
	strictEqual(parser4, "ow");
});


test("addGlobalBindingType, invalid parser name", function() {
    // arrange
	// act
	// assert
	throws(function () {
		class2.addGlobalBindingType("prop", "LBBKLBKJB");
	});
});

test("addGlobalBindingType, invalid parser", function() {
    // arrange
	// act
	// assert
	throws(function () {
		class2.addGlobalBindingType("prop", {});
	});
});

test("addGlobalBindingType, multiple parsers", function() {
    // arrange
	class2.addGlobalBindingType("prop", "ow");
	
	// act
	// assert
	throws(function () {
		class2.addGlobalBindingType("prop", "ow");
	});
});