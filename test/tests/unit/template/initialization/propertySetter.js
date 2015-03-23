
module("wipeout.template.initialization.propertySetter", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "2 parsers and a binding type", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = {}, name = {};
	subject._super = methods.method([name, val]);
    
	// act
	invoker(name, val, ["ow", "s", "i"]);
	
    // assert
    strictEqual(subject.bindingType, "ow");
    strictEqual(subject.parser("234"), 234);
});

testUtils.testWithUtils("constructor", "2 binding types", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = {}, name = {};
	subject._super = methods.method([name, val]);
    
	// act
	// assert
	throws(function () {
		invoker(name, val, ["ow", "tw"]);
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
	subject._value = {
		serializeContent: methods.method([], val)
	};
    
	// act
    // assert
    strictEqual(invoker(), val);
    strictEqual(val, subject._valueAsString);
});

testUtils.testWithUtils("parseOrExecute", "xmlParserTempName", false, function(methods, classes, subject, invoker) {
    // arrange
	subject._value = {}, subject.name = {}, output = {};
	var vm = {}, rc = {}, parser = methods.method([subject._value, subject.name, rc], output);
	subject.getParser = methods.method([vm], parser);
    parser.xmlParserTempName = true;
	
	// act
	var op = invoker(vm, rc);
	
    // assert
    strictEqual(op, output);
});

testUtils.testWithUtils("parseOrExecute", "parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var value = {};
	subject.getValue = methods.method([], value)
	subject.name = {}, output = {};
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
});

testUtils.testWithUtils("getBindingType", "has bindingType", false, function(methods, classes, subject, invoker) {
    // arrange
	subject.bindingType = {};
	
	// act
	var output = invoker();
	
    // assert
    strictEqual(subject.bindingType, output);
});

testUtils.testWithUtils("getBindingType", "has global bindingType", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = new (wipeout.base.bindable.extend(function () {}))();
	vm.addGlobalBindingType("aaa", "tw");
	subject.name = "aaa";
	
	// act
	var output = invoker(vm);
	
    // assert
    strictEqual("tw", output);
});

testUtils.testWithUtils("getBindingType", "default", false, function(methods, classes, subject, invoker) {
    // arrange	
	// act
	var output = invoker();
	
    // assert
    strictEqual("ow", output);
});

testUtils.testWithUtils("applyToViewModel", "invalid binding type", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {};
	subject.getBindingType = methods.method([vm], "invalid");
	
	// act
    // assert
	throws(function () {
		invoker(vm);
	});
});

testUtils.testWithUtils("applyToViewModel", "invalid binding type", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, rc = {};
	subject.getBindingType = methods.method([vm], "theBinding");
	classes.mock("wipeout.htmlBindingTypes.theBinding", function () {
		methods.method([vm, subject, rc]).apply(null, arguments);
		return methods.method();
	}, 1);
	subject.cacheAllWatched = function () { arguments[0](); return []; };
	
	// act
	debugger;
	var output = invoker(vm, rc);
	
    // assert
    strictEqual(output.length, 1);
	
	
	output[0].dispose();
});

function sssss () {
	
	propertySetter.prototype.applyToViewModel = function (viewModel, renderContext) {
		
		var bindingType = this.getBindingType(viewModel);
		
		if (!wipeout.htmlBindingTypes[bindingType]) throw "Invalid binding type :\"" + bindingType + "\" for property: \"" + this.name + "\".";
		
		var op = [];
		op.push.apply(op, this.cacheAllWatched((function () {
			var o = wipeout.htmlBindingTypes[bindingType](viewModel, this, renderContext)
			if (o instanceof Function)
				op.push({ dispose: o });
			else if (o && o.dispose instanceof Function)
				op.push(o);
		}).bind(this)));
		
		return op;
	};
	
	return propertySetter;
}













