module("wipeout.htmlBindingTypes.ow", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "nb, xmlParserTempName", false, function(methods, classes, subject, invoker) {
    // arrange
	var op = {},
		parser = {xmlParserTempName: true},
		vm = {},
		name = {},
		setter = {
			getParser: methods.method([vm, name], parser)
		},
		rc = {};
	
	classes.mock("wipeout.htmlBindingTypes.nb", function () {
		methods.method([vm, setter, name, rc]).apply(this, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.ow(vm, setter, name, rc);
	
	// assert
	strictEqual(op, output);
});

testUtils.testWithUtils("constructor", "nb, wipeoutAutoParser", false, function(methods, classes, subject, invoker) {
    // arrange
	var op = {},
		parser = {wipeoutAutoParser: false},
		vm = {},
		name = {},
		setter = {
			getParser: methods.method([vm, name], parser)
		},
		rc = {};
	
	classes.mock("wipeout.htmlBindingTypes.nb", function () {
		methods.method([vm, setter, name, rc]).apply(this, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.ow(vm, setter, name, rc);
	
	// assert
	strictEqual(op, output);
});

testUtils.testWithUtils("constructor", "nb, boolNumberOrRegex", false, function(methods, classes, subject, invoker) {
    // arrange
	var op = {},
		parser = {wipeoutAutoParser: true},
		vm = {},
		name = {},
		setter = {
			getParser: methods.method([vm, name], parser),
			valueAsString: methods.method([], "true")
		},
		rc = {};
	
	classes.mock("wipeout.htmlBindingTypes.nb", function () {
		methods.method([vm, setter, name, rc]).apply(this, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.ow(vm, setter, name, rc);
	
	// assert
	strictEqual(op, output);
});

testUtils.testWithUtils("constructor", "bindOneWay", false, function(methods, classes, subject, invoker) {
    // arrange
	var valueAsString = "KJBKJ()",
		op = {},
		parser = {wipeoutAutoParser: true},
		vm = {},
		name = {},
		setter = {
			getParser: methods.method([vm, name], parser),
			valueAsString: methods.method([], valueAsString)
		},
		rc = {};
	
	classes.mock("wipeout.utils.htmlBindingTypes.bindOneWay", function () {
		methods.method([rc, valueAsString, vm, name, true]).apply(this, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.ow(vm, setter, name, rc);
	
	// assert
	strictEqual(op, output);
});