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
	strictEqual(op, _this);
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