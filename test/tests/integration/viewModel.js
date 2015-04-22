
module("wo.viewModel", {
    setup: function () {
		window.vms = {};
	},
    teardown: function () {
		delete window.vms;
	}
});

test("model and template id via constructor args", function() {
	
	// arrange
	var ok1 = false, mod = {}, tid = {};
	var c1 = function (sadsd, gffdgfg, templateId, ksjbdskjbd, kjb, model) {
		ok1 = true;
		strictEqual(model, mod);
		strictEqual(templateId, tid);
	};
	
	var vm = wo.viewModel("vms.test", c1).build();
		
	// act
	new vm.constructor(tid, mod);
	
	// assert
	ok(ok1);
});

test("computed", function() {
	
	// arrange
	var vm = wo.viewModel("vms.test")
		.computed("theVal", function () {
			
			return this.model ? this.model.hello : null;
			
		}, {hello: true})
		.build();
		
	// act
	var obj = new vm.constructor();
	obj.observe("theVal", function (oldV, newV) {
		strictEqual(newV, 5);
		start();
	});
	
	obj.model = {hello: 5};
	
	// assert
	stop();
});

test("model and template id via constructor args, with comments", function() {
	
	// arrange
	var ok1 = false, mod = {}, tid = {};
	var c1 = function (sadsd, gffdgfg, /*something*/ templateId //else
						, ksjbdskjbd, kjb, model) {
		ok1 = true;
		strictEqual(model, mod);
		strictEqual(templateId, tid);
	};
	
	var vm = wo.viewModel("vms.test", c1).build();
		
	// act
	new vm.constructor(tid, mod);
	
	// assert
	ok(ok1);
});

test("model and template id via constructor args, overriden by value", function() {
	
	// arrange
	var ok1 = false, mod = 123, tid = 234;
	var c1 = function (sadsd, gffdgfg, templateId, ksjbdskjbd, kjb, model) {
		ok1 = true;
		strictEqual(model, mod);
		strictEqual(templateId, tid);
	};
	
	var vm = wo.viewModel("vms.test", c1).value("templateId", tid).value("model", mod).build();
		
	// act
	new vm.constructor(345, 456);
	
	// assert
	ok(ok1);
});

test("model and template id via constructor args, overriden by dynamic value", function() {
	
	// arrange
	var ok1 = false, mod = 123, tid = 234;
	var c1 = function (sadsd, gffdgfg, templateId, ksjbdskjbd, kjb, model) {
		ok1 = true;
		strictEqual(model, mod);
		strictEqual(templateId, tid);
	};
	
	var vm = wo.viewModel("vms.test", c1)
		.dynamicValue("templateId", function () {
			strictEqual(this.constructor, vm.constructor);
			strictEqual(arguments[0], 345);
			strictEqual(arguments[1], 456);
			
			return tid;
		})
		.dynamicValue("model", function () {
			strictEqual(this.constructor, vm.constructor);
			strictEqual(arguments[0], 345);
			strictEqual(arguments[1], 456);
			
			return mod;
		})
		.build();
		
	// act
	new vm.constructor(345, 456);
	
	// assert
	ok(ok1);
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

test("templateId with eager load", function() {
	// arrange
	// act
	wo.viewModel("vms.test").templateId("qunit-fixture", true);
	
	// assert
	ok(wipeout.template.engine.instance.templates["qunit-fixture"])
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