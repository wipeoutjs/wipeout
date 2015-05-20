module("wipeout.htmlBindingTypes.nb", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, rc = {}, val = {}, setter = {
		getter: methods.method([val], methods.method([], val)),
		name: "AAA"
	};
	
	// act
	wipeout.htmlBindingTypes.nb(vm, setter, rc);
	
	// assert
	strictEqual(vm.AAA, val)
});