module("wipeout.htmlBindingTypes.nb", {
    setup: function() {
    },
    teardown: function() {
    }
});
/*
        viewModel[setter.name] = setter.parseOrExecute(viewModel, renderContext);*/
testUtils.testWithUtils("binding", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, rc = {}, val = {}, setter = {
		parseOrExecute: methods.method([vm, rc], val),
		name: "AAA"
	};
	
	// act
	wipeout.htmlBindingTypes.nb(vm, setter, rc);
	
	// assert
	strictEqual(vm.AAA, val)
});