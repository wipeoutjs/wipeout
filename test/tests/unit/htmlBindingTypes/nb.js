module("wipeout.htmlBindingTypes.nb", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, rc = {}, val = {}, setter = {
		get: methods.method([rc], val),
		name: "AAA"
	};
	
	// act
	wipeout.htmlBindingTypes.nb(vm, setter, rc);
	
	// assert
	strictEqual(vm.AAA, val)
});