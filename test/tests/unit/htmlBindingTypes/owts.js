module("wipeout.htmlBindingTypes.owts", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", "", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {},
		setter = {
			getParser: methods.method([vm], null),
			getValue: methods.method([], "hello"),
			name: "OUOUO"
		},
		rc = {};
		
	var _this;
	classes.mock("obsjs.observeTypes.pathObserver", function () {
		ok(!_this);
		_this = this;
		
		methods.method([vm, setter.name]).apply(null, arguments);
		this.onValueChanged = methods.customMethod(function (oldVal, newVal) {
			var nv = {};
			arguments[0](null, nv);			
			strictEqual(rc.hello, nv);
			strictEqual(arguments[1], true);
		});
	}, 1);
	
	// act
	var op = wipeout.htmlBindingTypes.owts(vm, setter, rc);
	
	// assert
	strictEqual(op, _this);return;
	
	/*
		var watch = new obsjs.observeTypes.pathObserver(viewModel, setter.name);
		watch.onValueChanged(function (oldVal, newVal) {
			wipeout.utils.obj.setObject(val, renderContext, newVal);
		}, true);*/
	
	
    // arrange
	var output = {},
		valAsString = {},
		vm = {},
		name = "POJOIN",
		setter = {
			getParser: methods.method([vm, name], {wipeoutAutoParser: true}),
			valueAsString: methods.method([], valAsString)
		},
		rc = {};
	
	classes.mock("wipeout.utils.htmlBindingTypes.isSimpleBindingProperty", function () {
		strictEqual(arguments[0], valAsString);
		return true;
	}, 1);
	
	classes.mock("wipeout.utils.htmlBindingTypes.bindOneWay", function () {
		methods.method([vm, name, rc, valAsString]).apply(null, arguments);
		return output;
	}, 1);
	
	// act
	var op = wipeout.htmlBindingTypes.owts(vm, setter, name, rc);
	
	// assert
	strictEqual(op, output);
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