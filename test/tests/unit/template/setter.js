module("wipeout.template.setter", {
    setup: function() {
    },
    teardown: function() {
    }
});
/*
testUtils.testWithUtils("constructor", "parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = {}, name = {};
	subject._super = methods.method();
    
	// act
	invoker(name, val, "i");
	
    // assert
    strictEqual(subject.parser("234"), 234);
});

testUtils.testWithUtils("build", "has existing", false, function(methods, classes, subject, invoker) {
	// arrange
	subject._built = {};
	
	// act
	// assert
	strictEqual(subject._built, invoker());
});

testUtils.testWithUtils("build", "create", false, function(methods, classes, subject, invoker) {
	// arrange
	var tmp;
	subject.getValue = function () { return "555" };
	
	// act
	// assert
	strictEqual(555, (tmp = invoker())({}));
	strictEqual(subject._built, tmp);
});

testUtils.testWithUtils("isSimpleBindingProperty", null, true, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	ok(invoker("ok"));
	ok(invoker("ok.something"));
	ok(invoker("ok[9].something"));
	ok(!invoker("ok(9)"));
	ok(!invoker("ok;"));
	ok(!invoker("ok[a]"));
});

testUtils.testWithUtils("watch", "not caching. Other logic tested in integration tests", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	throws(function () {
		invoker();
	});
});

testUtils.testWithUtils("execute", "tested in integration tests", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	ok(true);
});

testUtils.testWithUtils("execute", "tested in integration tests", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	ok(true);
});

testUtils.testWithUtils("cacheAllWatched", "already caching", false, function(methods, classes, subject, invoker) {
	// arrange
	subject._caching = true;
	
	// act
	// assert
	throws(function () {
		invoker();
	});
});

testUtils.testWithUtils("cacheAllWatched", "not caching", false, function(methods, classes, subject, invoker) {
	// arrange	
	var tmp;
	
	// act
	var output = invoker(function () {
		tmp = subject._caching
	});
	
	// assert
	ok(tmp instanceof Array);
	ok(!subject._caching);
});

testUtils.testWithUtils("getValue", null, false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	strictEqual(subject._value = {}, invoker());
});*/

/*testUtils.testWithUtils("constructor", "parser", false, function(methods, classes, subject, invoker) {
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
});*/

/*testUtils.testWithUtils("parseOrExecute", "useRawXmlValue", false, function(methods, classes, subject, invoker) {
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