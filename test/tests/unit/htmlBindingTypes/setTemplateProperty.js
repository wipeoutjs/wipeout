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
			value: {}
		}, 
		name = "LBLKBJKBKJB";
	
	classes.mock("wipeout.viewModels.contentControl.createAnonymousTemplate", function () {
		strictEqual(arguments[0], set.value);
		return output;
	}, 1);
	
	// act
	wipeout.htmlBindingTypes.setTemplateProperty(vm, set, name);
	
	// assert
	strictEqual(output, vm[name + "Id"]);
});