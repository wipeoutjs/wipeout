module("wipeout.base.watched", {
    setup: function() {
    },
    teardown: function() {
    }
});

var watched = wipeout.base.watched;

//TODO: test dispose functionality

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    subject = new watched();
    
    // assert
    ok(subject.__woBag);
});

testUtils.testWithUtils("observe", null, false, function(methods, classes, subject, invoker) {
    // arrange    
    var assertsRun = false, stopped = false;
    subject = new watched();
    subject.val = "aaa";
    subject.observe("val", function(oldVal, newVal) {
        strictEqual(oldVal, "aaa");
        strictEqual(newVal, "bbb");
        assertsRun = true;
        if(stopped)
            start();
    });
    
    // act
    subject.val = "bbb";
    
    // Object.observe is async
    if (!assertsRun) {
        stop();
        stopped = true;
        setTimeout(function() {
            if(!assertsRun) {
                ok(false, "callback not fired");
                start();
            }
        }, 150);
    }
    
    // assert
});