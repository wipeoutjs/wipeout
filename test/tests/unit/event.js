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

testUtils.testWithUtils("event", "priority", false, function(methods, classes, subject, invoker) {
    // arrange
    var context = {};
    var subject = {}, event = "KJBKJBKJBKJ", c1 = false, c2 = false, c3 = false;
    var callback1 = methods.customMethod(function () {
        c1 = true;
        ok(!c2);
        ok(!c3);
    }), callback2 = methods.customMethod(function () {
        c2 = true;
        ok(c1);
        ok(!c3);
    }), callback3 = methods.customMethod(function () {
        ok(c1);
        ok(c2);
    });
    
    // act
    // assert
    
    var dispose1 = wipeout.event.instance.register(subject, event, callback3, null, -10);
    var dispose2 = wipeout.event.instance.register(subject, event, callback1, null, 10);
    var dispose3 = wipeout.event.instance.register(subject, event, callback2, null);
    
    wipeout.event.instance.trigger(subject, event);
    
    dispose1.dispose();
    dispose2.dispose();
    dispose3.dispose();
});