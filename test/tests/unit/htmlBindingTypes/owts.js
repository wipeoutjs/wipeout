module("wipeout.htmlBindingTypes.owts", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", "", false, function(methods, classes, subject, invoker) {
    // arrange
	var output = {},
		valAsString = {},
		vm = {},
		name = "POJOIN",
		setter = {
			getParser: methods.method([vm, name], {wipeoutAutoParser: true}),
			valueAsString: methods.method([], valAsString)
		},
		rc = {};
	
	classes.mock("wipeout.utils.htmlBindingTypes.isSimpleBindingProperty", function () {
		strictEqual(arguments[0], valAsString);
		return true;
	}, 1);
	
	classes.mock("wipeout.utils.htmlBindingTypes.bindOneWay", function () {
		methods.method([vm, name, rc, valAsString]).apply(null, arguments);
		return output;
	}, 1);
	
	// act
	var op = wipeout.htmlBindingTypes.owts(vm, setter, name, rc);
	
	// assert
	strictEqual(op, output);
});

testUtils.testWithUtils("binding", "not auto parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {},
		name = "POJOIN",
		setter = {
			getParser: methods.method([vm, name])
		};
	
	// act
	// assert
	throws(function () {
		wipeout.htmlBindingTypes.owts(vm, setter, name);
	});
});

testUtils.testWithUtils("binding", "not simple binding property", false, function(methods, classes, subject, invoker) {
    // arrange
	var valAsString = {},
		vm = {},
		name = "POJOIN",
		setter = {
			getParser: methods.method([vm, name], {wipeoutAutoParser: true}),
			valueAsString: methods.method([], valAsString)
		};
	
	classes.mock("wipeout.utils.htmlBindingTypes.isSimpleBindingProperty", function () {
		strictEqual(arguments[0], valAsString);
		return false;
	}, 1);
	
	// act
	// assert
	throws(function () {
		wipeout.htmlBindingTypes.owts(vm, setter, name);
	});
});