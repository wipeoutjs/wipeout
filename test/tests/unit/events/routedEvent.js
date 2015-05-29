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