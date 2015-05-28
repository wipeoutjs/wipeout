module("wipeout.event", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("event", "constructor, trigger, register, unregister", false, function(methods, classes, subject, invoker) {
    // arrange
    var context = {}, eventArgs = {};
    var called1 = 0, called2 = 0;
    var subject = {}, event = "KJBKJBKJBKJ";
    function callback1() {
        strictEqual(arguments[0], eventArgs);
        strictEqual(this, context);
        called1++;
    }
    function callback2() {
        strictEqual(arguments[0], eventArgs);
        strictEqual(this, context);
        called2++;
    }
    
    // act
    // assert
    
    // inital
    var dispose1 = wipeout.event.instance.register(subject, event, callback1, context);
    var dispose2 = wipeout.event.instance.register(subject, event, callback2, context);
    
    wipeout.event.instance.trigger(subject, event, eventArgs);    
    strictEqual(called1, 1);
    strictEqual(called2, 1);
    
    // unregister
    dispose1.dispose();
    
    wipeout.event.instance.trigger(subject, event, eventArgs);    
    strictEqual(called1, 1);
    
    // returned dispose function
    dispose2.dispose();
    
    wipeout.event.instance.trigger(subject, event, eventArgs);    
    strictEqual(called1, 1);
    strictEqual(called2, 2);
});

testUtils.testWithUtils("event", "dispose is unique", false, function(methods, classes, subject, invoker) {
    // arrange
    var context = {}, eventArgs = {};
    var called1 = 0, called2 = 0;
    var subject = {}, event = "KJBKJBKJBKJ";
    function callback1() {
        strictEqual(arguments[0], eventArgs);
        strictEqual(this, context);
        called1++;
    }
    
    // act
    // assert
    
    // inital
    var dispose1 = wipeout.event.instance.register(subject, event, callback1, context);
    var dispose2 = wipeout.event.instance.register(subject, event, callback1, context);
    
    ok(wipeout.event.instance.dictionary.objects.value(subject));
    
    // unregister
    dispose1.dispose();
    dispose1.dispose();
    
    wipeout.event.instance.trigger(subject, event, eventArgs);    
    strictEqual(called1, 1);
    
    // returned dispose function
    dispose2.dispose();
    
    wipeout.event.instance.trigger(subject, event, eventArgs);    
    strictEqual(called1, 1);
    
    // ensure references is deleted !important
    ok(!wipeout.event.instance.dictionary.objects.value(subject));
});
/*
testUtils.testWithUtils("dispose", null, false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new event();
    function callback() {
        ok(false, "callback should not have been called");
    }
    
    subject.register(callback);
        
    // act
    subject.dispose();
    subject.trigger({});
    
    // assert
    ok(true);
});*/