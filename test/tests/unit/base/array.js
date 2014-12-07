
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

    testUtils.testWithUtils("observe", "splice", false, function(methods, classes, subject, invoker) {
        // arrange
        var subject = new wipeout.base.array([1, 2, 3]);
        
        var val = 4;
        subject.observe(function(removed, added) {
            debugger;
            strictEqual(removed.length, 0);
            strictEqual(added.length, 1);
            strictEqual(added[0], val);
            start();
        });

        // act
        debugger;
        subject.splice(1, 1, val);

        stop();
    });

/*
    testUtils.testWithUtils("observe", "2 properties", false, function(methods, classes, subject, invoker) {
        // arrange
        var subject = buildSubject();
        subject.val1 = "aaa";
        subject.val2 = "bbb";
        
        subject.observe("val1", function(oldVal, newVal) {
            strictEqual(oldVal, "aaa");
            strictEqual(newVal, "ccc");
            start();
        });
        
        subject.observe("val2", function(oldVal, newVal) {
            strictEqual(oldVal, "bbb");
            strictEqual(newVal, "ddd");
            start();
        });

        // act
        subject.val1 = "ccc";
        subject.val2 = "ddd";

        stop(2);
    });

    testUtils.testWithUtils("observe", "delete", false, function(methods, classes, subject, invoker) {
        // arrange    
        var subject = buildSubject();
        subject.val = "aaa";
        subject.observe("val", function(oldVal, newVal) {
            strictEqual(oldVal, "aaa");
            strictEqual(newVal, undefined);
            start();
        });

        // act
        subject.del("val");

        stop();
    });

    testUtils.testWithUtils("observe", "multiple changes, 2 registrations", false, function(methods, classes, subject, invoker) {
        // arrange
        var subject = buildSubject();
        subject.val = "aaa";

        var number = 0;
        subject.observe("val", function(oldVal, newVal) {
            if(number === 0) {
                strictEqual(oldVal, "aaa");
                strictEqual(newVal, "bbb");
            } else if(number === 1) {
                strictEqual(oldVal, "bbb");
                strictEqual(newVal, "ccc");
            } else {
                ok(false);
            }

            number++;

            start(1);
        }, null, true);

        // act
        subject.val = "bbb";
        subject.val = "ccc";

        stop(2);
    });

    testUtils.testWithUtils("observe", "disposal", false, function(methods, classes, subject, invoker) {
        // arrange
        var subject = buildSubject();
        subject.val = "aaa";
        var dispose = subject.observe("val", function(oldVal, newVal) {
            ok(false, "should not have been called");
        });

        // act
        dispose.dispose();
        delete subject.val;

        stop();
        setTimeout(function(){
            start();
            ok(true);
        }, 10);
    });*/