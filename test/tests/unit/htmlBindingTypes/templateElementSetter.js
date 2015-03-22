module("wipeout.htmlBindingTypes.templateElementSetter", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "", false, function(methods, classes, subject, invoker) {
    // arrange
	ok(true, "Testing all functionality in integration");
	
	// act
	
	// assert
});

testUtils.testWithUtils("binding", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var tmp,
		vm = {}, 
		set = {
			_value: {
				constructor: function () {
					if (tmp) ok(false, "constructor invoked twice");
					tmp = this;
				},
				xml: {}
			},
			name: "kjbkjbkjbkjb"
		},
		rc = {};
	classes.mock("wipeout.template.engine.instance.getVmInitializer", function () {
		strictEqual(arguments[0], set._value.xml);
		return {
			initialize: methods.method([tmp, rc], methods.method())	// will be called by dispose
		};
	}, 1);
	
	// act
	var output = wipeout.htmlBindingTypes.templateElementSetter(vm, set, rc);
	
	// assert
	strictEqual(tmp, vm[set.name]);
	output.dispose();
});