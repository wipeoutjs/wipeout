module("wipeout.htmlBindingTypes.tw", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", "render context has no observable", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, set = {name: {}, getParser:function () {}, getValue: function () {return "$parent.value";}}, rc = {}, op = {};
	classes.mock("obsjs.tryBind", function () {
		methods.method([rc, "$parent.value", vm, set.name, true]).apply(null, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.tw(vm, set, rc);
	
	// assert
	strictEqual(output, op);
});

testUtils.testWithUtils("binding", "render context has an observable", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, set = {name: {}, getParser:function () {}, getValue: function () {return "$parent.value";}}, rc = {$parent: new obsjs.observable()}, op = {};
	classes.mock("obsjs.tryBind", function () {
		methods.method([rc.$parent, "value", vm, set.name, true]).apply(null, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.tw(vm, set, rc);
	
	// assert
	strictEqual(output, op);
});

testUtils.testWithUtils("binding", "render context has $parents observable", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, set = {name: {}, getParser:function () {}, getValue: function () {return "$parents[0].value";}}, rc = {$parents: [new obsjs.observable()]}, op = {};
	classes.mock("obsjs.tryBind", function () {
		methods.method([rc.$parents[0], "value", vm, set.name, true]).apply(null, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.tw(vm, set, rc);
	
	// assert
	strictEqual(output, op);
});

testUtils.testWithUtils("binding", "render context has a deep observable", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, set = {name: {}, getParser:function () {}, getValue: function () {return "$parent.value";}}, rc = {$parent: {value: new obsjs.observable()}}, op = {};
	classes.mock("obsjs.tryBind", function () {
		methods.method([rc, "$parent.value", vm, set.name, true]).apply(null, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.tw(vm, set, rc);
	
	// assert
	strictEqual(output, op);
});