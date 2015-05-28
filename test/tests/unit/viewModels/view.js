module("wipeout.viewModels.view", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "", false, function (methods, classes, subject, invoker) {
    // arrange
    var templateId = {};
    var model = {};
    subject._super = methods.method([templateId]);
    subject._onModelChanged = {};
	subject.observe = methods.customMethod(function () {
        strictEqual("model", arguments[0]);
        strictEqual(subject._onModelChanged, arguments[1]);
        strictEqual(subject, arguments[2].context);
        
		ok(arguments[2].activateImmediately);
	});
	
    // act
    invoker(templateId, model);
    
    // assert    
    strictEqual(subject.model, model);
});

testUtils.testWithUtils("dispose", "", false, function (methods, classes, subject, invoker) {
    // arrange
    subject._super = methods.method();
    subject.$routedEventSubscriptions = {
        dispose: methods.method()
    };
    
    // act
    invoker();
    
    // assert    
    ok(!subject.$routedEventSubscriptions.length);
});

testUtils.testWithUtils("onModelChanged", "", false, function (methods, classes, subject, invoker) {
    // arrange
	var registration = {}, key = {};
    subject.$modelRoutedEventKey = {};
    subject.disposeOf = methods.method([subject.$modelRoutedEventKey]);
    subject.registerDisposable = methods.method([registration], key);
    subject._onModelRoutedEvent = {};
	var input = new wipeout.events.routedEventModel();
	
    classes.mock("wipeout.event.instance.register", function () {
        methods.method([input, wipeout.events.routedEventModel.triggerRoutedEvent, subject._onModelRoutedEvent, subject]).apply(null, arguments);
        return registration;
    }, 1);
    
	// act
	invoker(input);
    
    // assert   
    strictEqual(subject.$modelRoutedEventKey, key);
});

testUtils.testWithUtils("getRenderContext", "has render context", false, function (methods, classes, subject, invoker) {
    // arrange
	subject.$domRoot = {renderContext: {}};
    
    // act
    var op = invoker();
    
    // assert
	strictEqual(op, subject.$domRoot.renderContext);
});

testUtils.testWithUtils("getRenderContext", "no render context", false, function (methods, classes, subject, invoker) {
    // arrange
    // act
    var op = invoker();
    
    // assert
	strictEqual(op, null);
});

testUtils.testWithUtils("_onModelRoutedEvent", "", false, function (methods, classes, subject, invoker) {
    // arrange
    var eventArgs = {
        routedEvent: new wipeout.events.routedEvent(),
        eventArgs: {}
    };
    
    subject.triggerRoutedEvent = methods.method([eventArgs.routedEvent, eventArgs.eventArgs]);
    
    // act
    invoker(eventArgs);
    
    // assert    
});

testUtils.testWithUtils("getParent", "no parent", false, function (methods, classes, subject, invoker) {
    // arrange
	subject.getRenderContext = methods.method([], null);
    
    // act
    var actual = invoker();
    
    // assert
    strictEqual(actual, null);
});

testUtils.testWithUtils("getParent", "has parent", false, function (methods, classes, subject, invoker) {
    // arrange
	var parent = {};
	subject.getRenderContext = methods.method([], {$this: parent, $parent: subject});
    
    // act
    var actual = invoker();
    
    // assert
    strictEqual(actual, parent);
});

testUtils.testWithUtils("getParent", "has parent, share parent scope", false, function (methods, classes, subject, invoker) {
    // arrange
	var parent = {};
	subject.getRenderContext = methods.method([], {$this: parent});
    
    // act
    var actual = invoker();
    
    // assert
    strictEqual(actual, parent);
});

testUtils.testWithUtils("getParents", "no parents", false, function (methods, classes, subject, invoker) {
    // arrange
	subject.getRenderContext = methods.method([], null);
    
    // act
    var actual = invoker();
    
    // assert
    strictEqual(actual.length, 0);
});

testUtils.testWithUtils("getParents", "has parent", false, function (methods, classes, subject, invoker) {
    // arrange
	var parent0 = {}, parent1 = {};
	subject.getRenderContext = methods.method([], {$this: subject, $parents: [parent0, parent1]});
    
    // act
    var actual = invoker();
    
    // assert
    strictEqual(actual.length, 2);
    strictEqual(actual[0], parent0);
    strictEqual(actual[1], parent1);
});

testUtils.testWithUtils("getParents", "has parent, share parent scope", false, function (methods, classes, subject, invoker) {
    // arrange
	var parent0 = {}, parent1 = {}, parent2 = {};
	subject.getRenderContext = methods.method([], {$this: parent0, $parents: [parent1, parent2]});
    
    // act
    var actual = invoker();
    
    // assert
    strictEqual(actual.length, 3);
    strictEqual(actual[0], parent0);
    strictEqual(actual[1], parent1);
    strictEqual(actual[2], parent2);
});

testUtils.testWithUtils("registerRoutedEvent", null, false, function (methods, classes, subject, invoker) {
    // arrange
    var expected = {};
    var callback = {};
    var context = {};
    var routedEvent = {};
    subject.$routedEventSubscriptions = {register: methods.method([routedEvent, "routed-event", callback, context], expected)};
    
    // act
    var actual = invoker(routedEvent, callback, context);
    
    // assert
    strictEqual(actual, expected);
});

testUtils.testWithUtils("triggerRoutedEvent", "no test here. see integration tests instead", false, function (methods, classes, subject, invoker) {
    // arrange
    ok(true);
});

testUtils.testWithUtils("onRendered", "", false, function (methods, classes, subject, invoker) {
    // arrange
	subject.$onRendered = [methods.method(), methods.method()];
	
	// act
	// assert
	invoker();
});

testUtils.testWithUtils("onUnrendered", "", false, function (methods, classes, subject, invoker) {
    // arrange
	subject.$onUnrendered = [methods.method(), methods.method()];
	
	// act
	// assert
	invoker();
});

testUtils.testWithUtils("onApplicationInitialized", "", false, function (methods, classes, subject, invoker) {
    // arrange
	subject.$onApplicationInitialized = [methods.method(), methods.method()];
	
	// act
	// assert
	invoker();
});

testUtils.testWithUtils("onInitialized", "", false, function (methods, classes, subject, invoker) {
    // arrange
	subject.$onInitialized = [methods.method(), methods.method()];
	
	// act
	// assert
	invoker();
});
