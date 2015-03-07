
module("wo.viewModel", {
    setup: function () {
		window.vms = {};
	},
    teardown: function () {
		delete window.vms;
	}
});

test("basic with method, value, dynamic value, static method, static property", function() {
	
	// arrange
	var method = function () {}, 
		value = 234, 
		dynamicValue = function () { return 456 }, 
		staticMethod = function () { },
		staticValue = 678;
	
	var builder = wo.viewModel("vms.test")
		.method("method", method)
		.value("value", value)
		.dynamicValue("dynamicValue", dynamicValue)
		.staticMethod("staticMethod", staticMethod)
		.staticValue("staticValue", staticValue);
		
	// act
	var vm = builder.build();
	
	// assert
	strictEqual(vm, builder.build());
	strictEqual(vm, vms.test.prototype);
	strictEqual(vm.statics, vms.test);
	strictEqual(vms.test.prototype.method, method);
	strictEqual(new vms.test().value, value);
	strictEqual(new vms.test().dynamicValue, dynamicValue());
	strictEqual(vms.test.staticMethod, staticMethod);
	strictEqual(vms.test.staticValue, staticValue);
});

test("convenience methods", function() {
	//arrange
	var functions = {
		onInitialized: function (onInitialized) {
		},
		onModelChanged: function (onModelChanged) {
		},
		onRendered: function (onRendered) {
		},
		onUnrendered: function (onUnrendered) {
		},
		dispose: function (dispose) {
		},
		onApplicationInitialized: function (onApplicationInitialized) {
		}
	};
	
	var builder = wo.viewModel("vms.test");
	for (var i in functions)
		builder[i](functions[i]);
	
	builder.templateId(123);
	
	// act
	var subject = new (builder.build().statics)();

	// assert
	for (var i in functions)
		strictEqual(subject.constructor.prototype[i], functions[i]);
	
	strictEqual(subject.templateId, 123);
});

test("global binding/parser", function() {
	// arrange	
	// act
	var vm = wo.viewModel("vms.test")
		.binding("bla", "tw")
		.parser("bla", "s").build();

	// assert
	strictEqual(vm.getGlobalBindingType("bla"), "tw");
	strictEqual(vm.getGlobalParser("bla"), wipeout.template.initialization.parsers.s);
});