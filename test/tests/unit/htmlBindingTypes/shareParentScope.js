module("wipeout.htmlBindingTypes.shareParentScope", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("true", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, setter = {
		value: methods.method([], "true"),
		name: "AAA"
	};
	
	// act
	wipeout.htmlBindingTypes.shareParentScope(vm, setter);
	
	// assert
	strictEqual(vm.AAA, true);
});

testUtils.testWithUtils("false", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, setter = {
		value: methods.method([], " fAlSe "),
		name: "AAA"
	};
	
	// act
	wipeout.htmlBindingTypes.shareParentScope(vm, setter);
	
	// assert
	strictEqual(vm.AAA, false);
});

testUtils.testWithUtils("false", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, setter = {
		value: methods.method([], " fAlSe "),
		name: "AAA"
	};
	
	// act
	wipeout.htmlBindingTypes.shareParentScope(vm, setter);
	
	// assert
	strictEqual(vm.AAA, false);
});

testUtils.testWithUtils("invalid", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, setter = {
		value: methods.method([], "invalid"),
		name: "AAA"
	};
	
	// act
	// assert
	throws(function () {
		wipeout.htmlBindingTypes.shareParentScope(vm, setter);
	});
});