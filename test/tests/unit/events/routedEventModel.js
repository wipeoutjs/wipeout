module("wipeout.events.routedEventModel", {
    setup: function() {
    },
    teardown: function() {
    }
});

var routedEventModel = wipeout.events.routedEventModel;

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    // arrange    
	subject._super = methods.method();
	
    // act
    invoker();
    
    // assert
    strictEqual(subject.__triggerRoutedEventOnVM.constructor, wipeout.events.event);
});

testUtils.testWithUtils("triggerRoutedEvent", null, false, function(methods, classes, subject, invoker) {
    // arrange    
    var routedEvent = {}, eventArgs = {};
    subject.__triggerRoutedEventOnVM = {
        trigger: methods.customMethod(function() {
            strictEqual(arguments[0].routedEvent, routedEvent);
            strictEqual(arguments[0].eventArgs, eventArgs);
        })
    };
    
    // act
    invoker(routedEvent, eventArgs);
    
    // assert
});

testUtils.testWithUtils("unRegisterRoutedEvent", "no event", false, function(methods, classes, subject, invoker) {
    // arrange
    var ev = {};
    subject.__routedEventSubscriptions = {value: methods.method([ev])};
    
    // act
    var actual = invoker(ev);
    
    // assert
    ok(!actual);
});

testUtils.testWithUtils("unRegisterRoutedEvent", null, false, function(methods, classes, subject, invoker) {
    // arrange
    var callback = {};
    var context = {};
    var routedEvent = {};
    subject.__routedEventSubscriptions = {value: methods.method([routedEvent], {
        routedEvent: routedEvent,
        event: {
            unRegister: methods.method([callback, context])
        }
    })};
    
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
    subject.__routedEventSubscriptions = {value: methods.method([routedEvent], {
        routedEvent: routedEvent,
        event: {
            register: methods.method([callback, context], expected)
        }
    })};
    
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
    subject.__routedEventSubscriptions = {value: methods.method([routedEvent]), add: methods.customMethod(function () {
        strictEqual(routedEvent, arguments[0]);
    })};
    
    // act
    var actual = invoker(routedEvent, callback, context);
    
    // assert
    strictEqual(actual.dispose.constructor, Function);
});

testUtils.testWithUtils("triggerRoutedEvent", "no test here. see integration tests instead", false, function(methods, classes, subject, invoker) {
    // arrange
    ok(true);
});