module("wipeout.htmlBindingTypes.owts", {
    setup: function() {
    },
    teardown: function() {
    }
});

/*
        var val;
        if (setter.getParser(viewModel) ||
			!wipeout.template.setter.isSimpleBindingProperty(val = setter.getValue()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
		
		wipeout.utils.obj.setObject(val, renderContext, viewModel[setter.name]);
		return obsjs.tryObserve(viewModel, setter.name, function (oldVal, newVal) {
			wipeout.utils.obj.setObject(val, renderContext, newVal);
		});
    };*/
testUtils.testWithUtils("binding", "", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {OUOUO: {}},
		setter = {
			getParser: methods.method([vm], null),
			getValue: methods.method([], "hello"),
			name: "OUOUO"
		},
		rc = {};
		
	classes.mock("obsjs.tryObserve", function () {
		
		strictEqual(vm, arguments[0]);
		strictEqual(setter.name, arguments[1]);
	}, 1);
	
	// act
	var op = wipeout.htmlBindingTypes.owts(vm, setter, rc);
	
	// assert
	strictEqual(rc.hello, vm.OUOUO);
});

testUtils.testWithUtils("binding", "has parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {},
		setter = {
			getParser: methods.method([vm], {})
		};
	
	// act
	// assert
	throws(function () {
		wipeout.htmlBindingTypes.owts(vm, setter);
	});
});

testUtils.testWithUtils("binding", "not simple binding property", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {},
		setter = {
			getParser: methods.method([vm], null),
			getValue: methods.method([], "(")
		};
	
	// act
	// assert
	throws(function () {
		wipeout.htmlBindingTypes.owts(vm, setter);
	});
});