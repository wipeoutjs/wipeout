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

testUtils.testWithUtils("registerRoutedEvent", null, false, function(methods, classes, subject, invoker) {
    // arrange
    var expected = {};
    var callback = {};
    var context = {};
    var routedEvent = {};
    subject.__routedEventSubscriptions = {register: methods.method([routedEvent, "routed-event", callback, context], expected)};
    
    // act
    var actual = invoker(routedEvent, callback, context);
    
    // assert
    strictEqual(actual, expected);
});

testUtils.testWithUtils("triggerRoutedEvent", "no test here. see integration tests instead", false, function(methods, classes, subject, invoker) {
    // arrange
    ok(true);
});