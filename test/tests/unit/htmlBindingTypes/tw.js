module("wipeout.htmlBindingTypes.tw", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", "render context has no observable", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, set = {name: {}, getParser:function () {}, value: function () {return "$this.value";}}, rc = {}, op = {};
	classes.mock("busybody.tryBind", function () {
		methods.method([rc, "$this.value", vm, set.name, true]).apply(null, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.tw(vm, set, rc);
	
	// assert
	strictEqual(output, op);
});

testUtils.testWithUtils("binding", "render context has an observable", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, set = {name: {}, getParser:function () {}, value: function () {return "$this.value";}}, rc = {$this: new busybody.observable()}, op = {};
	classes.mock("busybody.tryBind", function () {
		methods.method([rc.$this, "value", vm, set.name, true]).apply(null, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.tw(vm, set, rc);
	
	// assert
	strictEqual(output, op);
});

testUtils.testWithUtils("binding", "render context has $parents observable", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, set = {name: {}, getParser:function () {}, value: function () {return "$parents[0].value";}}, rc = {$parents: [new busybody.observable()]}, op = {};
	classes.mock("busybody.tryBind", function () {
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
	var vm = {}, set = {name: {}, getParser:function () {}, value: function () {return "$this.value";}}, rc = {$this: {value: new busybody.observable()}}, op = {};
	classes.mock("busybody.tryBind", function () {
		methods.method([rc, "$this.value", vm, set.name, true]).apply(null, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.tw(vm, set, rc);
	
	// assert
	strictEqual(output, op);
});