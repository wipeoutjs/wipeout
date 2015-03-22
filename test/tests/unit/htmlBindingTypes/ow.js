module("wipeout.htmlBindingTypes.ow", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "nb, parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var op = {},
		vm = {},
		setter = {
			getParser: methods.method([vm], {})
		},
		rc = {};
	
	classes.mock("wipeout.htmlBindingTypes.nb", function () {
		methods.method([vm, setter, rc]).apply(this, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.ow(vm, setter, rc);
	
	// assert
	strictEqual(op, output);
});

testUtils.testWithUtils("constructor", "nb, boolNumberOrRegex", false, function(methods, classes, subject, invoker) {
    // arrange
	var op = {},
		vm = {},
		setter = {
			getParser: methods.method([vm], null),
			getValue: methods.method([], "true")
		},
		rc = {};
	
	classes.mock("wipeout.htmlBindingTypes.nb", function () {
		methods.method([vm, setter, rc]).apply(this, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.ow(vm, setter, rc);
	
	// assert
	strictEqual(op, output);
});

/*
		setter.watch(renderContext, function (oldVal, newVal) {
			viewModel[setter.name] = newVal;
		}, true);*/

testUtils.testWithUtils("constructor", "bindOneWay", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {},
		setter = {
			getParser: methods.method([vm], null),
			getValue: methods.method([], "nothing"),
			watch: methods.customMethod(function () {
				strictEqual(arguments[0], rc);
				var newV = {};
				arguments[1](null, newV);
				strictEqual(vm[setter.name], newV);
				strictEqual(arguments[2], true);
			}),
			name: "KBKJB"
		},
		rc = {};
	
	// act
	wipeout.htmlBindingTypes.ow(vm, setter, rc);
	
	// assert
});