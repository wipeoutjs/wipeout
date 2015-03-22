module("wipeout.htmlBindingTypes.setTemplateProperty", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var output = {},
		vm = {}, 
		set = {
			_value: {},
			name: "kjbkjbkjb"
		};
	
	classes.mock("wipeout.viewModels.contentControl.createAnonymousTemplate", function () {
		strictEqual(arguments[0], set._value);
		return output;
	}, 1);
	
	// act
	wipeout.htmlBindingTypes.setTemplateProperty(vm, set);
	
	// assert
	strictEqual(output, vm[set.name + "Id"]);
});