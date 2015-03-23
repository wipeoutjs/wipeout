module("wipeout.template.rendering.htmlAttributeSetter", {
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
	subject.getValue = function () { return "theMethod" };
	
	// act
	// assert
	strictEqual(555, (tmp = invoker())({theMethod: function () {return 555;}}));
	strictEqual(subject._eventBuilt, tmp);
});

testUtils.testWithUtils("onElementEvent", null, true, function(methods, classes, subject, invoker) {
	
	// arrange
	subject = new wipeout.template.rendering.htmlAttributeSetter();
	var executed = false;	
	$("#qunit-fixture").html("<button></button>");
	var button = $("#qunit-fixture")[0].firstChild;
	var disp = subject.cacheAllWatched(function () {
		subject.onElementEvent(button, "click", new wipeout.template.context({}), function () {
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
	
testUtils.testWithUtils("applyToElement", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var element = {}, rc = {};
	subject.action = "theAttr";
	classes.mock("wipeout.template.rendering.htmlAttributes.theAttr", function () {
		methods.method([element, subject, rc]).apply(null, arguments);
		return methods.method();
	}, 1);
	subject.cacheAllWatched = function () { arguments[0](); return []; };
	
	// act
	var output = invoker(element, rc);
	
    // assert
    strictEqual(output.length, 1);
	
	
	output[0].dispose();
});