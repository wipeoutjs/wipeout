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
		methods.method(["model", subject._onModelChanged, subject]).apply(null, Array.prototype.slice.call(arguments, 0, 3));
		ok(arguments[3].activateImmediately);
	});
	
    // act
    invoker(templateId, model);
    
    // assert    
    strictEqual(subject.model, model);
});

testUtils.testWithUtils("dispose", "", false, function (methods, classes, subject, invoker) {
    // arrange
    subject._super = methods.method();
    subject.$routedEventSubscriptions = [{dispose: methods.method()}, {dispose: methods.method()}];
    
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
	
	/*
            if(newValue instanceof wipeout.events.routedEventModel) {
                var d1 = newValue.__triggerRoutedEventOnVM.register(this._onModelRoutedEvent, this);
                this.$modelRoutedEventKey = this.registerDisposable(d1);
            }*/
	
	input.__triggerRoutedEventOnVM = {
		register: methods.method([subject._onModelRoutedEvent, subject], registration)
	};
	
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
	subject.getRenderContext = methods.method([], {$parent: parent, $this: subject});
    
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

testUtils.testWithUtils("unRegisterRoutedEvent", "no event", false, function (methods, classes, subject, invoker) {
    // arrange
    subject.$routedEventSubscriptions = [];
    
    // act
    var actual = invoker();
    
    // assert
    ok(!actual);
});

testUtils.testWithUtils("unRegisterRoutedEvent", "no event", false, function (methods, classes, subject, invoker) {
    // arrange
    var callback = {};
    var context = {};
    var routedEvent = {};
    subject.$routedEventSubscriptions = [{
		routedEvent: routedEvent,
		event: {
			unRegister: methods.method([callback, context])
		}
	}];
    
    // act
    var actual = invoker(routedEvent, callback, context);
    
    // assert
    ok(actual);
});

testUtils.testWithUtils("registerRoutedEvent", "event exists", false, function (methods, classes, subject, invoker) {
    // arrange
    var expected = {};
    var callback = {};
    var context = {};
    var routedEvent = {};
    subject.$routedEventSubscriptions = [{
		routedEvent: routedEvent,
		event: {
			register: methods.method([callback, context], expected)
		}
	}];
    
    // act
    var actual = invoker(routedEvent, callback, context);
    
    // assert
    strictEqual(actual, expected);
});

testUtils.testWithUtils("registerRoutedEvent", "new event", false, function (methods, classes, subject, invoker) {
    // arrange
    var expected = {};
    function callback() {};
    var context = {};
    var routedEvent = {};
    subject.$routedEventSubscriptions = [];
    
    // act
    var actual = invoker(routedEvent, callback, context);
    
    // assert
    strictEqual(subject.$routedEventSubscriptions.length, 1);
    strictEqual(actual.dispose.constructor, Function);
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
