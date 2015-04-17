module("wipeout.htmlBindingTypes.ow", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "bindOneWay", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {},
		setter = {
			watch: methods.customMethod(function () {
				strictEqual(arguments[0], rc);
				var newV = {};
				arguments[1](null, newV);
				strictEqual(vm[setter.name], newV);
				strictEqual(arguments[2], true);
			}),
			name: "KBKJB"
		},
		rc = {};
	
	// act
	wipeout.htmlBindingTypes.ow(vm, setter, rc);
	
	// assert
});