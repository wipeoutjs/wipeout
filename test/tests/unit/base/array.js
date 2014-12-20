
module("wipeout.base.array", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("observe", "add", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new wipeout.base.array();

    var val = {};
    subject.observe(function(removed, added) {
        strictEqual(removed.length, 0);
        strictEqual(added.length, 1);
        strictEqual(added[0], val);
        start();
    });

    // act
    subject.push(val);

    stop();
});

testUtils.testWithUtils("observe", "length decrease", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new wipeout.base.array([3, 4, 5]);

    subject.observe(function(removed, added) {
        strictEqual(removed.length, 1);
        strictEqual(removed[0], 5);
        
        strictEqual(added.length, 0);
        start();
    });
    
    subject.observe(function(change) {
        strictEqual(change.addedCount, 0);
        strictEqual(change.index, 2);
        strictEqual(change.object, subject);
        strictEqual(change.removed.length, 1);
        strictEqual(change.removed[0], 5);
        strictEqual(change.type, "splice");

        start();
    }, null, true);

    // act
    subject.length = 2;
    strictEqual(subject.length, 2);
    strictEqual(subject[2], undefined);
    
    stop(2);
});

testUtils.testWithUtils("observe", "length increase", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new wipeout.base.array([3, 4, 5]);

    subject.observe(function(removed, added) {
        strictEqual(added.length, 1);
        strictEqual(added[0], undefined);
        
        strictEqual(removed.length, 0);
        start();
    });
    
    subject.observe(function(change) {
        strictEqual(change.addedCount, 1);
        strictEqual(change.index, 3);
        strictEqual(change.object, subject);
        strictEqual(change.removed.length, 0);
        strictEqual(change.type, "splice");

        start();
    }, null, true);

    // act
    subject.length = 4;
    strictEqual(subject.length, 4);
    strictEqual(subject[3], undefined);
    
    stop(2);
});

testUtils.testWithUtils("observe", "splice", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new wipeout.base.array([1, 2, 3]);

    var val = 4;
    subject.observe(function(removed, added) {
        strictEqual(removed.length, 1);
        strictEqual(removed[0], 2);
        strictEqual(added.length, 1);
        strictEqual(added[0], val);
        start();
    });

    // act
    subject.splice(1, 1, val);

    stop();
});

testUtils.testWithUtils("observe", "disposal", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new wipeout.base.array();

    var val = {};
    var dispose = subject.observe(function(removed, added) {
        ok(false, "should not have been called");
    });

    // act
    dispose.dispose();
    subject.push(val);

    stop();
    setTimeout(function(){
        start();
        ok(true);
    }, 10);
});

testUtils.testWithUtils("observe", "two reservations", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new wipeout.base.array();

    var val = {};
    var obs = function(removed, added) {
        strictEqual(removed.length, 0);
        strictEqual(added.length, 1);
        strictEqual(added[0], val);
        start();
    };
    
    subject.observe(obs);
    subject.observe(obs);

    // act
    subject.push(val);

    stop(2);
});

testUtils.testWithUtils("observe", "two changes, two observations, 1 complex, one simple", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new wipeout.base.array();

    var val1 = {}, val2 = {};
    
    var done = 0;
    subject.observe(function(removed, added) {
        strictEqual(removed.length, 0);
        strictEqual(added.length, 2);
        strictEqual(added[0], val1);
        strictEqual(added[1], val2);
        
        strictEqual(done, 2);
        start();
    });
    
    subject.observe(function(change) {
        strictEqual(change.addedCount, 1);
        strictEqual(change.index, done); // hack, "done" is also functioning as index of last item
        strictEqual(change.object, subject);
        strictEqual(change.removed.length, 0);
        strictEqual(change.type, "splice");

        done++;
        start();
    }, null, true);

    // act
    subject.push(val1);
    subject.push(val2);

    stop(3);
});

testUtils.testWithUtils("observe", "pop", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new wipeout.base.array([4, 5]);
    
    subject.observe(function(removed, added) {
        strictEqual(removed.length, 1);
        strictEqual(added.length, 0);
        strictEqual(removed[0], 5);
        start();
    });
    
    subject.observe(function(change) {
        strictEqual(change.addedCount, 0);
        strictEqual(change.object, subject);
        strictEqual(change.removed.length, 1);
        strictEqual(change.removed[0], 5);
        strictEqual(change.index, 1);
        strictEqual(change.type, "splice");
        
        start();
    }, null, true);

    // act
    var result = subject.pop();
    stop(2);

    // assert
    strictEqual(result, 5);
    strictEqual(subject.length, 1);
});

testUtils.testWithUtils("observe", "shift", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new wipeout.base.array([4, 5]);
    
    subject.observe(function(removed, added) {
        strictEqual(removed.length, 1);
        strictEqual(added.length, 0);
        strictEqual(removed[0], 4);
        start();
    });
    
    subject.observe(function(change) {
        strictEqual(change.addedCount, 0);
        strictEqual(change.object, subject);
        strictEqual(change.removed.length, 1);
        strictEqual(change.removed[0], 4);
        strictEqual(change.index, 0);
        strictEqual(change.type, "splice");
        
        start();
    }, null, true);

    // act
    var result = subject.shift();
    stop(2);

    // assert
    strictEqual(result, 4);
    strictEqual(subject.length, 1);
});