module("wipeout.events.routedEvent", {
    setup: function() {
    },
    teardown: function() {
    }
});

var routedEvent = wipeout.events.routedEvent;

testUtils.testWithUtils("trigger", null, false, function(methods, classes, subject, invoker) {
    // arrange
    var eventArgs = {};
    var triggerOnView = {
        triggerRoutedEvent: methods.customMethod(function() {
            strictEqual(arguments[0], subject);
            strictEqual(arguments[1].constructor, wipeout.events.routedEventArgs);
            strictEqual(arguments[1].data, eventArgs);
            strictEqual(arguments[1].originator, triggerOnView);            
        })
    };
    
    // act
    invoker(triggerOnView, eventArgs);
    
    // assert
});

testUtils.testWithUtils("unRegister", null, false, function(methods, classes, subject, invoker) {
    // arrange
    var callback = {}, context = {}, expected = {};
    var triggerOnView = {
        unRegisterRoutedEvent: methods.method([subject, callback, context], expected)
    };
    
    // act
    var actual = invoker(callback, triggerOnView, context);
    
    // assert
    strictEqual(actual, expected);
});

testUtils.testWithUtils("register", null, false, function(methods, classes, subject, invoker) {
    // arrange
    var callback = {}, context = {}, expected = {};
    var triggerOnView = {
        registerRoutedEvent: methods.method([subject, callback, context], expected)
    };
    
    // act
    var actual = invoker(callback, triggerOnView, context);
    
    // assert
    strictEqual(actual, expected);
});


module("wipeout.events.routedEventArgs", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    // arrange
    var data = {}, originator = {};
    
    // act
    invoker(data, originator);
    
    // assert
    strictEqual(subject.data, data);
    strictEqual(subject.originator, originator);
});