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

testUtils.testWithUtils("value", "has cached", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	strictEqual(subject._cachedValue = {}, invoker());
});

testUtils.testWithUtils("value", "no cached", false, function(methods, classes, subject, invoker) {
	// arrange
    subject.getValue = function () {
        return "XYZ";
    };
    
	// act
	// assert
	strictEqual("XYZ", invoker());
	strictEqual(subject._cachedValue, "XYZ");
});

testUtils.testWithUtils("value", "raw, has cached", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	strictEqual(subject._unAlteredCachedValue = {}, invoker(true));
});

testUtils.testWithUtils("value", "raw, no cached", false, function(methods, classes, subject, invoker) {
	// arrange
    subject.getValue = function () {
        return "XYZ";
    };
    
	// act
	// assert
	strictEqual("XYZ", invoker(true));
	strictEqual(subject._unAlteredCachedValue, "XYZ");
});

testUtils.testWithUtils("getValue", null, false, function(methods, classes, subject, invoker) {
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
		downward: methods.method(['hello shane', 'another hello'], op)
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
	subject.value = methods.method([true], val);
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

testUtils.testWithUtils("buildSetter", "invalid filter", false, function(methods, classes, subject, invoker) {
	// arrange
	subject.value = methods.method([], "$context.val => invalid-filter");
	
	// assert
	// act
	throws(function () {
		invoker();
	});
});

testUtils.testWithUtils("buildSetter", "good filter, no to child part", false, function(methods, classes, subject, invoker) {
	// arrange
	var ctxt = {asGetterArgs: function() { return [this]; }}, val = {};
	wo.filters["good-filter"] = {};
	subject.value = methods.method([], "$context.val, 'another hello' => good-filter");
	
	// act
	ok(invoker()(ctxt, val))
	
	// assert
	strictEqual(ctxt.val, val);
	
	delete wo.filters["good-filter"];
});

testUtils.testWithUtils("buildSetter", "good filter, with to child part", false, function(methods, classes, subject, invoker) {
	// arrange
	var ctxt = {asGetterArgs: function() { return [this, null, null, null, null]; }}, input = {}, output = {};
	wo.filters["good-filter"] = {
		upward: methods.method([input, 'another hello'], output)
	};
	subject.value = methods.method([], "$context.val, 'another hello' => good-filter");
	
	// act
	ok(invoker()(ctxt, input));
	
	// assert
	strictEqual(ctxt.val, output);
	
	delete wo.filters["good-filter"];
});

testUtils.testWithUtils("buildSetter", "cannot set", false, function(methods, classes, subject, invoker) {
	// arrange
	subject.value = methods.method([], "$context");
	
	// act
	ok(!invoker());
	
	// assert
	strictEqual(subject._setter, null);
});

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

testUtils.testWithUtils("prime", "already caching", false, function(methods, classes, subject, invoker) {
	// arrange
	subject._caching = true;
	
	// act
	// assert
	throws(function () {
		invoker();
	});
});

testUtils.testWithUtils("prime", "not caching", false, function(methods, classes, subject, invoker) {
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

testUtils.testWithUtils("replace$model", "no $model, with strings and comments", true, function(methods, classes, subject, invoker) {
	// arrange
	var input1 = "//$model\n/*$model*/", input2 = "'$model'\n\"$model\"";
	
	// act
	var output = invoker(input1 + input2);
	
	// assert
    strictEqual("\n" + input2, output);
});

testUtils.testWithUtils("replace$model", "var $model", true, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
    throws(function () {
	   invoker("var $model;");
    });
    throws(function () {
	   invoker(" var $model;");
    });
});

testUtils.testWithUtils("replace$model", "$model", true, function (methods, classes, subject, invoker) {
	// arrange
	var input = "$model"
	
	// act
	var output = invoker(input);
	
	// assert
    strictEqual("$this.model", output);
});

testUtils.testWithUtils("replace$model", ", $model", true, function (methods, classes, subject, invoker) {
	// arrange
	var input = ", $model"
	
	// act
	var output = invoker(input);
	
	// assert
    strictEqual(", $this.model", output);
});

testUtils.testWithUtils("replace$model", "x$model", true, function (methods, classes, subject, invoker) {
	// arrange
	var input = "x$model"
	
	// act
	var output = invoker(input);
	
	// assert
    strictEqual(input, output);
});

testUtils.testWithUtils("replace$model", "x.$model", true, function (methods, classes, subject, invoker) {
	// arrange
	var input = "x.$model"
	
	// act
	var output = invoker(input);
	
	// assert
    strictEqual(input, output);
});

testUtils.testWithUtils("replace$model", "$modelx", true, function (methods, classes, subject, invoker) {
	// arrange
	var input = "$modelx"
	
	// act
	var output = invoker(input);
	
	// assert
    strictEqual(input, output);
});

testUtils.testWithUtils("replace$model", "{$model: 33}", true, function (methods, classes, subject, invoker) {
	// arrange
	var input = "{$model: 33}"
	
	// act
	var output = invoker(input);
	
	// assert
    strictEqual(input, output);
});


testUtils.testWithUtils("replace$model", "{$model : 33}", true, function (methods, classes, subject, invoker) {
	// arrange
	var input = "{$model : 33}"
	
	// act
	var output = invoker(input);
	
	// assert
    strictEqual(input, output);
});