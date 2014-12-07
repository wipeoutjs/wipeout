module("wipeout.base.watch", {
    setup: function() {
    },
    teardown: function() {
    }
});

var watch = wipeout.base.watch;

testUtils.testWithUtils("constructor", "enumerability", false, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    subject = invoker();
    subject.observe("aaa", function() {});
    
    // assert
    for(var i in subject)
        strictEqual(i, "aaa", "[" + i + "], subject should have no properties");
    
    ok(true);
});

testUtils.testWithUtils("observe", null, false, function(methods, classes, subject, invoker) {
    // arrange    
    var assertsRun = false, stopped = false;
    subject = watch({val: "aaa"});
    subject.observe("val", function(oldVal, newVal) {
        strictEqual(oldVal, "aaa");
        strictEqual(newVal, "bbb");
        start();
    });
    
    // act
    subject.val = "bbb";    
    stop();
    
    // assert
});

testUtils.testWithUtils("canWatch", "null", true, function(methods, classes, subject, invoker) {
    // arrange     
    // act    
    // assert
    ok(!invoker());
});

testUtils.testWithUtils("canWatch", "watched", true, function(methods, classes, subject, invoker) {
    // arrange     
    // act    
    // assert
    ok(!invoker({}));
});

testUtils.testWithUtils("canWatch", "watched object type", true, function(methods, classes, subject, invoker) {
    // arrange     
    // act    
    // assert
    ok(invoker(new wipeout.base.watched()));
});

testUtils.testWithUtils("canWatch", "ammended watched object", true, function(methods, classes, subject, invoker) {
    // arrange     
    // act    
    // assert
    ok(invoker(watch()));
});
