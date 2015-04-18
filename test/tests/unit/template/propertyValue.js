module("wipeout.template.propertyValue", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = {}, name = {};
	subject._super = methods.method();
    
	// act
	invoker(name, val, "i");
	
    // assert
    strictEqual(subject.parser("234"), 234);
});

testUtils.testWithUtils("value", null, false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	strictEqual(subject._value = {}, invoker());
});

testUtils.testWithUtils("buildGetter", "has getter", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	strictEqual(subject._getter = {}, invoker());
});

testUtils.testWithUtils("buildGetter", "no filter", false, function(methods, classes, subject, invoker) {
	// arrange
	subject.value = methods.method([], "'hello shane'");
	
	// act
	strictEqual(invoker(), subject._getter);
	
	// assert
	strictEqual(subject._getter(), "hello shane");
});

testUtils.testWithUtils("buildGetter", "invalid filter", false, function(methods, classes, subject, invoker) {
	// arrange
	subject.value = methods.method([], "'hello shane' => invalid-filter");
	
	// assert
	// act
	throws(function () {
		invoker();
	});
});

testUtils.testWithUtils("buildGetter", "good filter, no to child part", false, function(methods, classes, subject, invoker) {
	// arrange
	wo.filters["good-filter"] = {};
	subject.value = methods.method([], "'hello shane', 'another hello' => good-filter");
	
	// assert
	// act
	strictEqual(invoker()(), "hello shane");
	
	delete wo.filters["good-filter"];
});

testUtils.testWithUtils("buildGetter", "good filter, with to child part", false, function(methods, classes, subject, invoker) {
	// arrange
	var op = {};
	wo.filters["good-filter"] = {
		parentToChild: methods.method(['hello shane', 'another hello'], op)
	};
	subject.value = methods.method([], "'hello shane', 'another hello' => good-filter");
	
	// assert
	// act
	strictEqual(invoker()(), op);
	
	delete wo.filters["good-filter"];
});

testUtils.testWithUtils("get", "no parser", false, function(methods, classes, subject, invoker) {
	// arrange
	var op = {}, getterArgs = {};
	subject.getParser = function () {};
	subject.buildGetter = methods.method([], {
		apply: methods.method([null, getterArgs], op)
	});
	var rc = {
		asGetterArgs: methods.method([], getterArgs)
	};
	
	// act
	// assert
	strictEqual(op, invoker(rc));
});

testUtils.testWithUtils("get", "with parser", false, function(methods, classes, subject, invoker) {
	// arrange
	var op = {}, val = {}, rc = {};
	subject.name = {};
	subject.value = methods.method([], val);
	var parser = methods.method([val, subject.name, rc], op);
	subject.getParser = methods.method([], parser);
	
	// act
	// assert
	strictEqual(op, invoker(rc));
});

testUtils.testWithUtils("get", "xml parser", false, function(methods, classes, subject, invoker) {
	// arrange
	var op = {}, val = {}, rc = {};
	subject.name = {};
	subject._value = val;
	var parser = methods.method([val, subject.name, rc], op);
	parser.useRawXmlValue = true;
	subject.getParser = methods.method([], parser);
	
	// act
	// assert
	strictEqual(op, invoker(rc));
});

testUtils.testWithUtils("canSet", "", false, function(methods, classes, subject, invoker) {
	// arrange
	var po = {};
	subject.getParser = methods.method([po], false);
	subject.buildSetter = methods.method([po], true);
	
	// act
	// assert
	ok(invoker(po));
});

testUtils.testWithUtils("getParser", "primed, has parser", false, function(methods, classes, subject, invoker) {
	// arrange
	var po = subject.propertyOwner = {};
	subject.primed = methods.method();
	subject.parser = {}
	
	// act
	// assert
	strictEqual(subject.parser, invoker());
});

testUtils.testWithUtils("getParser", "not primed, has global parser", false, function(methods, classes, subject, invoker) {
	// arrange
	var vm = new (wipeout.base.bindable.extend(function () {this._super();}))();
	vm.constructor.addGlobalParser("aaa", "s");
	subject.name = "aaa";
	
	// act
	// assert
	strictEqual(wo.parsers.s , invoker(vm));
});

testUtils.testWithUtils("buildSetter", "has setter", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	strictEqual(subject._setter = {}, invoker());
});

testUtils.testWithUtils("buildSetter", "no filter", false, function(methods, classes, subject, invoker) {
	// arrange
	var ctxt = {asGetterArgs: function() { return [this]; }};
	subject.value = methods.method([], "$context.val");
	
	// act
	strictEqual(invoker(), subject._setter);
	subject._setter(ctxt, "hello shane");
	
	// assert
	strictEqual(ctxt.val, "hello shane");
});







/*





//Not all tests are present here

testUtils.testWithUtils("buildSetter", "invalid filter", false, function(methods, classes, subject, invoker) {
	// arrange
	subject.value = methods.method([], "$context.val => invalid-filter");
	
	// assert
	// act
	//throws(function () {
		invoker();
	//});
});

testUtils.testWithUtils("buildSetter", "good filter, no to child part", false, function(methods, classes, subject, invoker) {
	// arrange
	wo.filters["good-filter"] = {};
	subject.value = methods.method([], "'hello shane', 'another hello' => good-filter");
	
	// assert
	// act
	strictEqual(invoker()(), "hello shane");
	
	delete wo.filters["good-filter"];
});

testUtils.testWithUtils("buildSetter", "good filter, with to child part", false, function(methods, classes, subject, invoker) {
	// arrange
	var op = {};
	wo.filters["good-filter"] = {
		parentToChild: methods.method(['hello shane', 'another hello'], op)
	};
	subject.value = methods.method([], "'hello shane', 'another hello' => good-filter");
	
	// assert
	// act
	strictEqual(invoker()(), op);
	
	delete wo.filters["good-filter"];
});

*/













testUtils.testWithUtils("set", "cannot set", false, function(methods, classes, subject, invoker) {
	// arrange
	var op = {};
	subject.canSet = methods.method([op], false);
	subject.value = methods.method();
	
	// act
	// assert
	throws(function () {
		invoker(null, null, op);
	});
});

testUtils.testWithUtils("set", "", false, function(methods, classes, subject, invoker) {
	// arrange
	var po = {}, rc = {}, val = {}, op = {};
	subject.canSet = methods.method([po], true);
	subject.buildSetter = methods.method([], methods.method([rc, val], op));
	
	// act
	// assert
	strictEqual(op,	invoker(rc, val, po));
});

testUtils.testWithUtils("watch", "not caching. Other logic tested in integration tests", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	throws(function () {
		invoker();
	});
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
	var output = invoker({}, function () {
		tmp = subject._caching
	});
	
	// assert
	ok(tmp instanceof Array);
	ok(!subject._caching);
});


/*
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
});*/