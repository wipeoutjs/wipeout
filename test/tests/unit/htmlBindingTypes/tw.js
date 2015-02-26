module("wipeout.htmlBindingTypes.tw", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, set = {}, name = {}, rc = {};
	classes.mock("wipeout.htmlBindingTypes.ow", function () {
		methods.method([vm, set, name, rc]).apply(null, arguments);
		return {
			dispose: methods.method()
		};
	}, 1);
	classes.mock("wipeout.htmlBindingTypes.owts", function () {
		methods.method([vm, set, name, rc]).apply(null, arguments);
		return {
			dispose: methods.method()
		};
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.tw(vm, set, name, rc);
	
	// assert - dispose should call other method.methods
	output.dispose();
});