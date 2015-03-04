
module("wipeout.utils.htmlBindingTypes", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("onPropertyChange", "simple", true, function(methods, classes, subject, invoker) {
    // arrange
	var obj = {}, path = "aa.bb", cb = {}, temp;
	classes.mock("obsjs.observeTypes.pathObserver", function () {
		methods.method([obj, path]).apply(null, arguments);
		this.onValueChanged = methods.method([cb, true]);
		temp = this;
	}, 1);
    
    // act
    var output = invoker(obj, path, cb);
    
    // assert
    strictEqual(output, temp);
});

testUtils.testWithUtils("onPropertyChange", "complex not allowed", true, function(methods, classes, subject, invoker) {
    // arrange
	var obj = {}, path = "this.aa + this.bb", cb = {}, temp;
    
    // act
    // assert
	throws(function () {
    	invoker(obj, path, cb);
	});
});

testUtils.testWithUtils("onPropertyChange", "complex", true, function(methods, classes, subject, invoker) {
    // arrange
	var obj = {}, path = "this.aa + this.bb", cb = {}, parser = {};
	
	//wipeout.template.initialization.compiledInitializer.getAutoParser(propertyPath)
	
	classes.mock("wipeout.template.initialization.compiledInitializer.getAutoParser", function () {
		strictEqual(arguments[0], path);
		return parser;
	}, 1);
	
	classes.mock("obsjs.observeTypes.computed", function () {
		strictEqual(arguments[0], parser);
		strictEqual(arguments[1], null);
		
		strictEqual(arguments[2].allowWith, true);		
		strictEqual(arguments[2].watchVariables.renderContext, obj);
		strictEqual(arguments[2].watchVariables.value, path);
		strictEqual(arguments[2].watchVariables.propertyName, "");
		
		this.onValueChanged = methods.method([cb, true]);
		temp = this;
	}, 1);
    
    // act
    var output = invoker(obj, path, cb, true);
    
    // assert
    strictEqual(output, temp);
});

testUtils.testWithUtils("bindOneWay", "complex", true, function(methods, classes, subject, invoker) {
    // arrange
	var bindFrom = {}, bindFromName = {}, bindTo = {}, bindToName = {}, allowComplexProperties = {}, callback = {};
	var watcher = {
		registerDisposable: methods.method([callback])
	};
	
	classes.mock("obsjs.utils.obj.createBindFunction", function () {
		methods.method([bindTo, bindToName]).apply(null, arguments);
		return callback;
	}, 1);
	
	classes.mock("wipeout.utils.htmlBindingTypes.onPropertyChange", function () {
		methods.method([bindFrom, bindFromName, callback, allowComplexProperties]).apply(null, arguments);
		return watcher;
	}, 1);
    
    // act
    var output = invoker(bindFrom, bindFromName, bindTo, bindToName, allowComplexProperties);
    
    // assert
    strictEqual(output, watcher);
});

testUtils.testWithUtils("isSimpleBindingProperty", "complex", true, function(methods, classes, subject, invoker) {
    // arrange
    // act
    // assert
    ok(invoker(" asda .dfgdfg "));
    ok(invoker(" asda .dfgdfg [88] "));
    ok(!invoker(" asda +dfgdfg "));
});