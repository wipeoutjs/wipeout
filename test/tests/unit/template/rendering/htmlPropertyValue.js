module("wipeout.template.rendering.htmlPropertyValue", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("eventBuild", "has existing", false, function(methods, classes, subject, invoker) {
	// arrange
	subject._eventBuilt = {};
	
	// act
	// assert
	strictEqual(subject._eventBuilt, invoker());
});

testUtils.testWithUtils("eventBuild", "create", false, function(methods, classes, subject, invoker) {
	// arrange
	var tmp;
	subject.value = function () { return "$context.theMethod" };
	
	// act
	(tmp = invoker())({theMethod: methods.method()})
	
	// assert
	strictEqual(subject._eventBuilt, tmp);
});

testUtils.testWithUtils("setData, getData", null, true, function(methods, classes, subject, invoker) {
	
	// arrange
	var element = {}, name = "LKJBKJBKJBJK", data = {};
	subject = new wipeout.template.rendering.htmlPropertyValue();
	subject._caching = [];
	
	// act
	subject.setData(element, name, data);
	
	// assert
	ok(subject.dataExists(element, name));
	ok(!subject.dataExists(element, "kjbefbksdjbfs"));
	strictEqual(subject.getData(element, name), data);
	
	subject._caching[0].dispose();
	
	// assert
	strictEqual(subject.getData(element, name), undefined);
});

testUtils.testWithUtils("onElementEvent", null, true, function(methods, classes, subject, invoker) {
	
	// arrange
	subject = new wipeout.template.rendering.htmlPropertyValue();
	var executed = false;	
	$("#qunit-fixture").html("<button></button>");
	var button = $("#qunit-fixture")[0].firstChild;
	var disp = subject.prime(button, new wipeout.template.context({}), function () {
		subject.onElementEvent("click", new wipeout.template.context({}), function () {
			ok(!executed);
			executed = true;
		});
	});
	
	// act
	button.click();
	enumerateArr(disp, function(d){d.dispose();});
	button.click();
	
	// assert
	ok(executed);
});