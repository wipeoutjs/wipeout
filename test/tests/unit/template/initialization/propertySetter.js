
module("wipeout.template.initialization.propertySetter", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "2 parsers and a binding type", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = {};
    
	// act
	invoker(val, ["ow", "s", "i"]);
	
    // assert
    strictEqual(subject.value, val);
    strictEqual(subject.bindingType, "ow");
    strictEqual(subject.parser("234"), 234);
});

testUtils.testWithUtils("constructor", "2 binding types", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = {};
    
	// act
	// assert
	throws(function () {
		invoker(val, ["ow", "tw"]);
	});
});

testUtils.testWithUtils("getParser", "has parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var p = subject.parser = {};
    
	// act
    // assert
    strictEqual(invoker(), p);
});

testUtils.testWithUtils("getParser", "has global parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = wipeout.base.bindable.extend(function () { this._super(); });
	vm.addGlobalParser("aaaa", "s");
    
	// act
    // assert
    strictEqual(invoker(new vm(), "aaaa"), wipeout.template.initialization.parsers.s);
    strictEqual(subject.parser, wipeout.template.initialization.parsers.s);
});

testUtils.testWithUtils("getParser", "auto parser", false, function(methods, classes, subject, invoker) {
    // arrange
	subject.valueAsString = methods.method([], "value");
    
	// act
    // assert
    strictEqual(invoker()(234, {}, {}), 234);
    strictEqual(subject.parser.wipeoutAutoParser, true);
});

testUtils.testWithUtils("valueAsString", "has val", false, function(methods, classes, subject, invoker) {
    // arrange
	subject._valueAsString = "LKBLKNLBLJB";
    
	// act
    // assert
    strictEqual(invoker(), subject._valueAsString);
});

testUtils.testWithUtils("valueAsString", "no val", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = "KJBKJBKJBKJBJ";
	subject.value = {
		serializeContent: methods.method([], val)
	};
    
	// act
    // assert
    strictEqual(invoker(), val);
    strictEqual(val, subject._valueAsString);
});