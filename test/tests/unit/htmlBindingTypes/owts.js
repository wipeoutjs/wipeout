module("wipeout.htmlBindingTypes.owts", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", "", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {},
		rc = {},
		setter = {
			canSet: methods.method([], true),
			onPropertyChanged: methods.customMethod(function () {
				strictEqual(arguments[1], true);
				var val = {};
				setter.set = methods.method([rc, val, vm]);
				arguments[0](null, val);
			})
		};
	
	// act
	wipeout.htmlBindingTypes.owts(vm, setter, rc);
	
	// assert
});

testUtils.testWithUtils("binding", "cannot set", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {},
		setter = {
			canSet: methods.method([], false),
			value: methods.method([])
		};
	
	// act
	// assert
	throws(function () {
		wipeout.htmlBindingTypes.owts(vm, setter);
	});
});