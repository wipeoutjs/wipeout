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
	subject.getValue = function () { return "$context.theMethod" };
	
	// act
	// assert
	strictEqual(555, (tmp = invoker())({theMethod: function () {return 555;}}));
	strictEqual(subject._eventBuilt, tmp);
});

testUtils.testWithUtils("setData, getData", null, true, function(methods, classes, subject, invoker) {
	
	// arrange
	var element = {}, name = "LKJBKJBKJBJK", data = {};
	subject = new wipeout.template.rendering.htmlAttributeSetter();
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
	
testUtils.testWithUtils("splitValue", "no filter", false, function(methods, classes, subject, invoker) {
    // arrange
	var input = "KJBKJBKJB";
	subject.getValue = function () { return input; };
	
	// act
	var output = invoker(input);
	
    // assert
    strictEqual(output.filter, "passthrough");
    strictEqual(output.inputs.length, 1);
    strictEqual(output.inputs[0], input);
});
	
testUtils.testWithUtils("splitValue", "filter and args", false, function(methods, classes, subject, invoker) {
    // arrange
	var input1 = "KJBKJBKJB", input2 = "dada'eterte'sdad", filter = "fdsfsdff";
	subject.getValue = function () { return input1 + ", " + input2 + " => " + filter; };
	
	// act
	var output = invoker();
	
    // assert
    strictEqual(output.filter, filter);
    strictEqual(output.inputs.length, 2);
    strictEqual(output.inputs[0], input1);
    strictEqual(output.inputs[1], input2);
});