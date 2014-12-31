module("wipeout.base.pathWatch", {
    setup: function() {
    },
    teardown: function() {
    }
});

var pathWatch = wipeout.base.pathWatch;

testUtils.testWithUtils("observe", "path, last element changed", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    subject.aa = wo.watch();
    subject.aa.bb = wo.watch();
    subject.aa.bb.cc = 11;

    //debugger;
    var dispose = new pathWatch(subject, "aa.bb.cc", function(oldVal, newVal) {
        strictEqual(oldVal, 11);
        strictEqual(newVal, 22);
        start();
    });

    // act
    stop();
    subject.aa.bb.cc = 22;        
});


testUtils.testWithUtils("observe", "path, last element changed, has non observable in path", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    subject.aa = {};
    subject.aa.bb = wo.watch();
    subject.aa.bb.cc = 11;

    //debugger;
    var dispose = new pathWatch(subject, "aa.bb.cc", function(oldVal, newVal) {
        strictEqual(oldVal, 11);
        strictEqual(newVal, 22);
        start();
    });

    // act
    stop();
    subject.aa.bb.cc = 22;        
});

testUtils.testWithUtils("observe", "path, mid element nulled then last element changed", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    var aa = subject.aa = wo.watch();
    subject.aa.bb = wo.watch();
    subject.aa.bb.cc = 11;

    var dispose = new pathWatch(subject, "aa.bb.cc", function(oldVal, newVal) {
        strictEqual(oldVal, 11);
        strictEqual(newVal, null);
        start();
        aa.bb.cc = 33; // make sure disposals are activated
    });

    // act
    stop(2);
    subject.aa = null;

    setTimeout(function() {
        start();
    }, 100);
});

testUtils.testWithUtils("observe", "path, mid element changed, null val", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    subject.aa = wo.watch();
    subject.aa.bb = wo.watch();
    subject.aa.bb.cc = 11;

    new pathWatch(subject, "aa.bb.cc", function(oldVal, newVal) {
        strictEqual(oldVal, 11);
        strictEqual(newVal, null);
        start();
    });

    // act
    stop();
    subject.aa = {};

});

testUtils.testWithUtils("observe", "path, mid element and last element changed", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    subject.aa = wo.watch();
    var bb = subject.aa.bb = wo.watch();
    subject.aa.bb.cc = 11;

    var newVal = wo.watch();
    newVal.bb = wo.watch();
    newVal.bb.cc = 22;

    new pathWatch(subject, "aa.bb.cc", function(oldVal, newVal) {
        strictEqual(oldVal, 11);
        strictEqual(newVal, 22);
        start();
    });

    // act
    stop();
    subject.aa = newVal;
    bb.cc = 33;

});

testUtils.testWithUtils("observe", "path, mid element changed, after disposal", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    subject.aa = wo.watch();
    subject.aa.bb = wo.watch();
    subject.aa.bb.cc = 11;

    var newVal = wo.watch();
    newVal.bb = wo.watch();
    newVal.bb.cc = 22;

    var dispose = new pathWatch(subject, "aa.bb.cc", function(oldVal, newVal) {
        ok(false);
    });

    // act
    stop();
    dispose.dispose();
    subject.aa = newVal;

    setTimeout(function() {
        ok(true);
        start();
    }, 100);
});