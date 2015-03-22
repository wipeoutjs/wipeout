module("wipeout.htmlBindingTypes.tw", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, set = {}, rc = {}, op = {};
	classes.mock("wipeout.htmlBindingTypes.ow", function () {
		methods.method([vm, set, rc]).apply(null, arguments);
	}, 1);
	classes.mock("wipeout.htmlBindingTypes.owts", function () {
		methods.method([vm, set, rc]).apply(null, arguments);
		return op;
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.tw(vm, set, rc);
	
	// assert
	strictEqual(output, op);
});