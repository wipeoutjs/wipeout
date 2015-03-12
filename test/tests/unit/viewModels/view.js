module("wipeout.viewModels.view", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var templateId = {};
    var model = {};
    subject._super = methods.method([templateId]);
    subject.onModelChanged = {};
	subject.observe = methods.customMethod(function () {
		methods.method(["model", subject.onModelChanged, subject]).apply(null, Array.prototype.slice.call(arguments, 0, 3));
		ok(arguments[3].activateImmediately);
	});
	
    // act
    invoker(templateId, model);
    
    // assert    
    strictEqual(subject.model, model);
});

testUtils.testWithUtils("dispose", "", false, function(methods, classes, subject, invoker) {
    // arrange
    subject._super = methods.method();
    subject.$routedEventSubscriptions = [{dispose: methods.method()}, {dispose: methods.method()}];
    
    // act
    invoker();
    
    // assert    
    ok(!subject.$routedEventSubscriptions.length);
});

testUtils.testWithUtils("onModelChanged", "", false, function(methods, classes, subject, invoker) {
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
	invoker(null, input);
    
    // assert   
    strictEqual(subject.$modelRoutedEventKey, key);
});

testUtils.testWithUtils("_onModelRoutedEvent", "", false, function(methods, classes, subject, invoker) {
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

/*testUtils.testWithUtils("getParent", "don't include shareParentScope", false, function(methods, classes, subject, invoker) {
    // arrange
    var expected = {};
    var parentElement = {};
    classes.mock("wipeout.utils.ko.parentElement", function() {
        strictEqual(arguments[0], subject.__woBag.rootHtmlElement);
        return parentElement;
    }, 1);
    
    classes.mock("wipeout.utils.html.getViewModel", function() {
        strictEqual(arguments[0], parentElement);
        return {
            shareParentScope: true,
            getParent: function() {
                ok(!arguments[0]);
                return expected;
            }
        };
    });
    
    subject.__woBag = {
        rootHtmlElement: {}
    };
    
    // act
    var actual = invoker(false);
    
    // assert
    strictEqual(actual, expected);
});

testUtils.testWithUtils("getParent", "include shareParentScope", false, function(methods, classes, subject, invoker) {
    // arrange
    var expected = {};
    var parentElement = {};
    classes.mock("wipeout.utils.ko.parentElement", function() {
        strictEqual(arguments[0], subject.__woBag.rootHtmlElement);
        return parentElement;
    }, 1);
    
    classes.mock("wipeout.utils.html.getViewModel", function() {
        strictEqual(arguments[0], parentElement);
        return expected;
    });
    
    subject.__woBag = {
        rootHtmlElement: {}
    };
    
    // act
    var actual = invoker(false);
    
    // assert
    strictEqual(actual, expected);
});*/

testUtils.testWithUtils("unRegisterRoutedEvent", "no event", false, function(methods, classes, subject, invoker) {
    // arrange
    subject.$routedEventSubscriptions = [];
    
    // act
    var actual = invoker();
    
    // assert
    ok(!actual);
});

testUtils.testWithUtils("unRegisterRoutedEvent", "no event", false, function(methods, classes, subject, invoker) {
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

testUtils.testWithUtils("registerRoutedEvent", "event exists", false, function(methods, classes, subject, invoker) {
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

testUtils.testWithUtils("registerRoutedEvent", "new event", false, function(methods, classes, subject, invoker) {
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

testUtils.testWithUtils("triggerRoutedEvent", "no test here. see integration tests instead", false, function(methods, classes, subject, invoker) {
    // arrange
    ok(true);
});
