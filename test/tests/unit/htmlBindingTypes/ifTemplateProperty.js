module("wipeout.htmlBindingTypes.ifTemplateProperty", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var output = {},
		vm = new wipeout.viewModels["if"](), 
		set = {},
		rc = {};
	
	vm.reEvaluate = methods.method();
	
	classes.mock("wipeout.htmlBindingTypes.templateProperty", function () {
		methods.method([vm, set, rc]).apply(this, arguments);
		return output;
	}, 1);
	
	// act
	var op = wipeout.htmlBindingTypes.ifTemplateProperty(vm, set, rc);
	
	// assert
	strictEqual(output, op);
});