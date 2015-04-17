
module("wipeout.template.initialization.propertySetter", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("value", "has val", false, function(methods, classes, subject, invoker) {
    // arrange
	subject._valueAsString = "LKBLKNLBLJB";
    
	// act
    // assert
    strictEqual(invoker(), subject._valueAsString);
});

testUtils.testWithUtils("value", "no val", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = "KJBKJBKJBKJBJ";
	subject._super = function () {
		return {
			serializeContent: methods.method([], val)
		};
	};
    
	// act
    // assert
    strictEqual(invoker(), val);
    strictEqual(val, subject._valueAsString);
});

testUtils.testWithUtils("onPropertyChanged", "no val", false, function(methods, classes, subject, invoker) {
    // arrange
	subject.propertyOwner = {aaa:{}};
	subject.name = "aaa";
	var obs = {}, cb = methods.method([undefined, subject.propertyOwner.aaa]);
	subject.primed = methods.method();
	subject._caching = [];
    classes.mock("obsjs.tryObserve", function () {
		methods.method([subject.propertyOwner, subject.name, cb]).apply(null, arguments);
		return obs;
	});
	
	// act
    // assert
    ok(invoker(cb, true));
});