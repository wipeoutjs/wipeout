module("wipeout.htmlBindingTypes.owts", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", "", false, function(methods, classes, subject, invoker) {
    
    // arrange
	var val = {},
        setter = {
			setter: methods.method([], methods.method([val])),
			onPropertyChanged: methods.customMethod(function () {
				strictEqual(arguments[1], true);
				arguments[0](null, val);
			})
		};
	
	// act
	wipeout.htmlBindingTypes.owts(null, setter, null);
	
	// assert
});