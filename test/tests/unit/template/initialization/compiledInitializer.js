module("wipeout.template.initialization.compiledInitializer", {
    setup: function() {
    },
    teardown: function() {
    }
});

var compiledTemplate = wipeout.template.rendering.compiledTemplate;

testUtils.testWithUtils("getPropertyFlags", null, true, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    var output = invoker("value--some-THING");
    
    // assert
    strictEqual(output.name, "value");
    strictEqual(output.flags[0], "some");
    strictEqual(output.flags[1], "thing");
});

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var input = {
		length: 1,
		attributes: {
			"0": {}
		},
		"0": {}
	};
	
	subject.addAttribute = methods.method([input.attributes[0], "0"]);
	subject.addElement = methods.method([input[0], 0]);
	
    // act
	invoker(input);
    
    // assert
	strictEqual(subject.setters.constructor, Object);
	ok(subject.setters.model instanceof wipeout.template.initialization.propertySetter);
	strictEqual(subject.setters.model._value.value,  "$parent ? $parent.model : null");
});

testUtils.testWithUtils("addElement", "has setter already", false, function(methods, classes, subject, invoker) {
    // arrange
	var element = {
		nodeType: 1,
		name: "something"
	};
	
	subject.setters = {
		something: true
	};
	
    // act
    // assert
	throws(function () {
		invoker(element);
	});
});

testUtils.testWithUtils("addElement", "has attribute value with flags", false, function(methods, classes, subject, invoker) {
    // arrange
	var attr = {}, element = {
		nodeType: 1,
		name: "something",
		attributes: {
			"value--f1-f2": attr
		}
	}, setter;
	
	subject.setters = {};
	
	classes.mock("wipeout.template.initialization.propertySetter", function () {
		strictEqual(arguments[0], element.name);
		strictEqual(arguments[1], attr);
		strictEqual(arguments[2][0], "f1");
		strictEqual(arguments[2][1], "f2");
		
		setter = this;
	}, 1);
	
    // act
	invoker(element);
    
    // assert
	strictEqual(subject.setters.something, setter);
});

testUtils.testWithUtils("addElement", "has attribute value with flags, also has inner html", false, function(methods, classes, subject, invoker) {
    // arrange
	var attr = {}, element = {
		nodeType: 1,
		name: "something",
		attributes: {
			"value--f1-f2": attr
		},
		length: 1,
		"0": {nodeType: 1}
	};
	
	subject.setters = {};
	
    // act
    // assert
	throws(function () {
		invoker(element);
	});
});

testUtils.testWithUtils("addElement", "no parser, element setter", false, function(methods, classes, subject, invoker) {
    // arrange
	var element = {
		attributes: {},
		nodeType: 1,
		name: "something",
		length: 1,
		"0": {
			nodeType: 1,
			name: "js-array",
			attributes: {}
		}
	}, setter;
	
	subject.setters = {};
	
	classes.mock("wipeout.template.initialization.propertySetter", function () {
		strictEqual(arguments[0], element.name);
		strictEqual(arguments[1].xml, element[0]);
		strictEqual(arguments[1].constructor, Array);
		strictEqual(arguments[2][0], "templateElementSetter");
		
		setter = this;
	}, 1);
	
    // act
	invoker(element);
    
    // assert
	strictEqual(subject.setters.something, setter);
});

testUtils.testWithUtils("addElement", "no parser, text setter", false, function(methods, classes, subject, invoker) {
    // arrange
	var element = {
		attributes: {},
		nodeType: 1,
		name: "something"
	}, setter;
	
	subject.setters = {};
	
	classes.mock("wipeout.template.initialization.propertySetter", function () {
		strictEqual(arguments[0], element.name);
		strictEqual(arguments[1], element);
		
		setter = this;
	}, 1);
	
    // act
	invoker(element);
    
    // assert
	strictEqual(subject.setters.something, setter);
});

testUtils.testWithUtils("addElement", "with parser function", false, function(methods, classes, subject, invoker) {
	
    // arrange
	var element = {
		attributes: { parser: function () {} },
		nodeType: 1,
		name: "something"
	}, setter;
	
	subject.setters = {};
	
	classes.mock("wipeout.template.initialization.propertySetter", function () {
		strictEqual(arguments[0], element.name);
		strictEqual(arguments[1], element);
		
		setter = this;
	}, 1);
	
    // act
	invoker(element);
    
    // assert
	strictEqual(subject.setters.something, setter);
	strictEqual(subject.setters.something.parser, element.attributes.parser);
});

testUtils.testWithUtils("addElement", "with global parser", false, function(methods, classes, subject, invoker) {
		
    // arrange
	var element = {
		attributes: {},
		nodeType: 1,
		name: "something",
		_parentElement: {
			name: "tempClass"
		}
	}, parser = function () {}, setter;
	
	window.tempClass = {
		getGlobalParser: methods.method(["something"], parser)
	};
	
	subject.setters = {};
	
	classes.mock("wipeout.template.initialization.propertySetter", function () {
		strictEqual(arguments[0], element.name);
		strictEqual(arguments[1], element);
		
		setter = this;
	}, 1);
	
    // act
	invoker(element);
    
    // assert
	strictEqual(subject.setters.something, setter);
	strictEqual(subject.setters.something.parser, parser);
	
	delete window.tempClass;
});

testUtils.testWithUtils("addAttribute", "attr set twice", false, function(methods, classes, subject, invoker) {
		
    // arrange
	var attr = {}, name = "name--f1-f2";
	
	subject.setters = {name: true};
	
    // act
    // assert
	throws(function () {
		invoker(attr, name);
	});
});

testUtils.testWithUtils("addAttribute", "with global parser", false, function(methods, classes, subject, invoker) {
		
    // arrange
	var attr = {}, name = "name--f1-f2", setter;
	
	subject.setters = {};
	
	classes.mock("wipeout.template.initialization.propertySetter", function () {
		strictEqual(arguments[0], "name");
		strictEqual(arguments[1], attr);
		strictEqual(arguments[2][0], "f1");
		strictEqual(arguments[2][1], "f2");
		
		setter = this;
	}, 1);
	
    // act
	invoker(attr, name);
    
    // assert
	strictEqual(subject.setters.name, setter);
});

testUtils.testWithUtils("initialize", null, false, function(methods, classes, subject, invoker) {
		
    // arrange
	var vm = {}, rc = {};
	
	subject.setters = {
		model: true,
		p1: true
	};
	
	subject.applyToViewModel = methods.customMethod(function () {
		methods.method(["model", vm, rc]).apply(null, arguments);
		subject.applyToViewModel = methods.method(["p1", vm, rc], [{dispose: methods.method()}]);
		return [{dispose: methods.method()}];
	});
	
    // act
    // assert
	invoker(vm, rc)();
});

testUtils.testWithUtils("applyToViewModel", "invalid binding type", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {};
	subject.setters = {
		aaa: {}
	};
	
	classes.mock("wipeout.template.initialization.compiledInitializer.getBindingType", function () {
		methods.method([subject.setters.aaa, vm]).apply(null, arguments);
		return "invalid";
	});
	
	throws(function () {
		invoker("aaa", vm);
	});
});

testUtils.testWithUtils("applyToViewModel", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, rc = {};
	subject.setters = {
		aaa: {
			cacheAllWatched: function (input) { input.apply(this, arguments); }
		}
	};
	
	classes.mock("wipeout.template.initialization.compiledInitializer.getBindingType", function () {
		methods.method([subject.setters.aaa, vm]).apply(null, arguments);
		return "theBinding";
	});
	
	classes.mock("wipeout.htmlBindingTypes.theBinding", function () {
		methods.method([vm, subject.setters.aaa, rc]).apply(null, arguments);
		return methods.method();
	}, 1);
	subject.cacheAllWatched = function () { arguments[0](); return []; };
	
	// act
	var output = invoker("aaa", vm, rc);
	
    // assert
    strictEqual(output.length, 1);
	
	
	output[0].dispose();
});

testUtils.testWithUtils("getBindingType", "has bindingType", true, function(methods, classes, subject, invoker) {
    // arrange
	var setter = {
		$wipeout_binding_type: {}
	};
	
	// act
	var output = invoker(setter);
	
    // assert
    strictEqual(setter.$wipeout_binding_type, output);
});

testUtils.testWithUtils("getBindingType", "has global bindingType", true, function(methods, classes, subject, invoker) {
    // arrange
	var vm = new (wipeout.base.bindable.extend(function () {}))();
	vm.addGlobalBindingType("aaa", "tw");
	
	// act
	var output = invoker({name: "aaa"}, vm);
	
    // assert
    strictEqual("tw", output);
});

testUtils.testWithUtils("getBindingType", "default", true, function(methods, classes, subject, invoker) {
    // arrange	
	// act
	var output = invoker({}, {});
	
    // assert
    strictEqual("ow", output);
});