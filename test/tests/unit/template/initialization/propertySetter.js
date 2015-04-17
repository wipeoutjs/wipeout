
module("wipeout.template.initialization.propertySetter", {
    setup: function() {
    },
    teardown: function() {
    }
});
/*
testUtils.testWithUtils("constructor", "parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = {}, name = {};
	subject._super = methods.method([name, val, "i"]);
    
	// act
	invoker(name, val, "i");
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
    subject.name = "aaaa";
	
	// act
    // assert
    strictEqual(invoker(new vm()), wipeout.template.initialization.parsers.s);
});

testUtils.testWithUtils("getValue", "has val", false, function(methods, classes, subject, invoker) {
    // arrange
	subject._valueAsString = "LKBLKNLBLJB";
    
	// act
    // assert
    strictEqual(invoker(), subject._valueAsString);
});

testUtils.testWithUtils("getValue", "no val", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = "KJBKJBKJBKJBJ";
	subject._super = function () {
		return {
			serializeContent: methods.method([], val)
		};
	};
    
	// act
    // assert
    strictEqual(invoker(), val);
    strictEqual(val, subject._valueAsString);
});

testUtils.testWithUtils("parseOrExecute", "useRawXmlValue", false, function(methods, classes, subject, invoker) {
    // arrange
	var output = {};
	subject._value = {}, subject.name = {};
	var vm = {}, rc = {}, parser = methods.method([subject._value, subject.name, rc], output);
	subject.getParser = methods.method([vm], parser);
    parser.useRawXmlValue = true;
	
	// act
	var op = invoker(vm, rc);
	
    // assert
    strictEqual(op, output);
});

testUtils.testWithUtils("parseOrExecute", "parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var value = {}, output = {};
	subject.getValue = methods.method([], value)
	subject.name = {};
	var vm = {}, rc = {}, parser = methods.method([value, subject.name, rc], output);
	subject.getParser = methods.method([vm], parser);
	
	// act
	var op = invoker(vm, rc);
	
    // assert
    strictEqual(op, output);
});

testUtils.testWithUtils("parseOrExecute", "no parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var ga = {}, op = {}, built = {
		apply: methods.method([null, ga], op)
	};
	subject.getParser = methods.method();
	subject.build = methods.method([], built);
	
	var vm = {}, rc = {
		asGetterArgs: methods.method([], ga)
	};
	
	// act
	var output = invoker(vm, rc);
	
    // assert
    strictEqual(op, output);
});*/