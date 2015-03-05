
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
	strictEqual(parser2, wipeout.template.initialization.parsers["regexp"]);
	ok(!parser3);
	strictEqual(parser4, wipeout.template.initialization.parsers["regexp"]);
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

test("addGlobalParser, simple, instance", function() {
    // arrange
	var instance = new class2();
	var p = function () {}
	instance.addGlobalParser("prop", p);
	
	// act
	var parser = instance.getGlobalParser("prop");
	
	// assert
	strictEqual(parser, p);
});

test("addGlobalParser, simple, prototype", function() {
    // arrange
	var instance = new class2();
	var p = function () {}
	class2.prototype.addGlobalParser("prop", p);
	
	// act
	var parser = instance.getGlobalParser("prop");
	
	// assert
	strictEqual(parser, p);
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
	strictEqual(parser1, wipeout.template.initialization.parsers["regexp"]);
	strictEqual(parser2, wipeout.template.initialization.parsers["regexp"]);
	strictEqual(parser3, wipeout.template.initialization.parsers["regexp"]);
	strictEqual(parser4, wipeout.template.initialization.parsers["regexp"]);
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
	class2.addGlobalParser("prop", "string");
	
	// act
	// assert
	throws(function () {
		class2.addGlobalParser("prop", "date");
	});
});

test("addGlobalParser, added same one twice", function() {
    // arrange
	class2.addGlobalParser("prop", "string");
	class2.addGlobalParser("prop", "string");
	ok(true);
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

test("addGlobalParser, simple, instance", function() {
    // arrange
	var instance = new class2();
	instance.addGlobalBindingType("prop", "tw");
	
	// act
	var parser = instance.getGlobalBindingType("prop");
	
	// assert
	strictEqual(parser, "tw");
});

test("addGlobalParser, simple, prototype", function() {
    // arrange
	var instance = new class2();
	class2.prototype.addGlobalBindingType("prop", "tw");
	
	// act
	var parser = instance.getGlobalBindingType("prop");
	
	// assert
	strictEqual(parser, "tw");
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


test("addGlobalBindingType, invalid binding type name", function() {
    // arrange
	// act
	// assert
	throws(function () {
		class2.addGlobalBindingType("prop", "LBBKLBKJB");
	});
});

test("addGlobalBindingType, invalid binding type", function() {
    // arrange
	// act
	// assert
	throws(function () {
		class2.addGlobalBindingType("prop", {});
	});
});

test("addGlobalBindingType, multiple binding types", function() {
    // arrange	
	// act
	// assert
	class2.addGlobalBindingType("prop", "ow");
	class2.addGlobalBindingType("prop", "ow");
	ok(true);
});