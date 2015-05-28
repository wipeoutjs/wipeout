module("wipeout.events.routedEventModel", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("triggerRoutedEvent", null, false, function(methods, classes, subject, invoker) {
    // arrange
    var routedEvent = {}, eventArgs = {};
    classes.mock("wipeout.event.instance.trigger", function () {
        strictEqual(arguments[0], subject);
        strictEqual(arguments[1], "__triggerRoutedEventOnVM");
        strictEqual(arguments[2].routedEvent, routedEvent);
        strictEqual(arguments[2].eventArgs, eventArgs);
    }, 1);
    
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