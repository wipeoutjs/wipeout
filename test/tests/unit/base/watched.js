

var watched = wipeout.base.watched;
var watch = wipeout.base.watch;

function testMe (moduleName, buildSubject) {

    module(moduleName, {
        setup: function() {
        },
        teardown: function() {
        }
    });

    /*testUtils.testWithUtils("observe", "suspend", false, function(methods, classes, subject, invoker) {
        
        // arrange
        var subject = buildSubject();
        subject.val = "aaa";
        var tmp = subject.observe("val", function(oldVal, newVal) {
            ok(false);
        });

        // act
        tmp.suspend(function () {
            subject.val = "bbb";
            stop();
        });

        setTimeout(function() {
            ok(true);
            start();
        }, 100);
    });

    
    testUtils.testWithUtils("observe", "suspend, 2 changes. Assert callback only invoked once", false, function(methods, classes, subject, invoker) {
        
        // arrange
        var subject = buildSubject();
        subject.val = "aaa";
        var tmp = subject.observe("val", function(oldVal, newVal) {
            strictEqual(oldVal, "aaa");
            strictEqual(newVal, "ccc");
            start();
        }, null, true);

        // act
        tmp.suspend(function () {
            subject.val = "bbb";
        });
        
        subject.val = "ccc";

        stop();
    });*/

    
    testUtils.testWithUtils("observe", "multiple changes, 1 registration", false, function(methods, classes, subject, invoker) {
        
        // arrange
        var subject = buildSubject();
        subject.val = "aaa";
        subject.observe("val", function(oldVal, newVal) {
            strictEqual(oldVal, "aaa");
            strictEqual(newVal, "ccc");
            start();
        });

        // act
        subject.val = "bbb";
        subject.val = "ccc";

        stop();
    });

    testUtils.testWithUtils("observe", "ensure changes before subscribe are not observed", false, function(methods, classes, subject, invoker) {
        
        // arrange
        var subject = buildSubject();
        subject.observe("val", function() {});    // invoke watch function
        
        subject.val = "www";
        subject.val = "xxx";
        subject.observe("val", function(oldVal, newVal) {
            strictEqual(oldVal, "xxx");
            strictEqual(newVal, "yyy");
            start();
        }, null, true);
        
        subject.observe("val", function(oldVal, newVal) {
            strictEqual(oldVal, "xxx");
            strictEqual(newVal, "yyy");
            start();
        });

        // act
        subject.val = "yyy";

        stop(2);
    });

    testUtils.testWithUtils("observe", "ensure changes before dispose are observed", false, function(methods, classes, subject, invoker) {
        
        // arrange
        var subject = buildSubject();
        subject.val = "xxx";
        var disp = subject.observe("val", function(oldVal, newVal) {
            strictEqual(oldVal, "xxx");
            strictEqual(newVal, "yyy");
            start();
        }, null, true);
        
        subject.val = "yyy"; 
        disp.dispose(true);

        // act
        subject.val = "zzz";

        stop();
    });

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
    });

    testUtils.testWithUtils("observe", "simple change, complex functions are in pathWatch.js", false, function(methods, classes, subject, invoker) {
        // arrange
        var subject = buildSubject();
        subject.aa = buildSubject();
        subject.aa.bb = buildSubject();
        subject.aa.bb.cc = 11;
        
        var disp = subject.observe("aa.bb.cc", function(oldVal, newVal) {
            strictEqual(oldVal, 11);
            strictEqual(newVal, 22);
            start();
        });

        // act
        stop();
        subject.aa.bb.cc = 22;
        ok(disp instanceof wipeout.base.pathWatch);
    });
    
    testUtils.testWithUtils("observeArray", "reverse", false, function(methods, classes, subject, invoker) {
        // arrange
        var subject = buildSubject();
        subject.aa = new wipeout.base.array([1,2,3]);
        subject.observeArray("aa", function(removed, added, moved) {
            strictEqual(removed.length, 0);
            strictEqual(added.length, 0);
            strictEqual(moved.moved.length, 2);
            
            strictEqual(moved.moved[0].from, 0);
            strictEqual(moved.moved[0].to, 2);
            
            strictEqual(moved.moved[1].from, 2);
            strictEqual(moved.moved[1].to, 0);
            start();
        });

        // act
        stop();
        subject.aa.reverse();
    });

    testUtils.testWithUtils("observeArray", "old array does not trigger change", false, function(methods, classes, subject, invoker) {
        // arrange
        var subject = buildSubject();
        var o = subject.aa = new wipeout.base.array([1,2,3]);
        
        subject.observe("aa", function(oldV, newV) {
            strictEqual(oldV, o);
            strictEqual(newV, n);
            
            // strict equals will make sure "push" will not trigger a subscription
            wipeout.base.watched.afterNextObserveCycle(function () {
                o.push(33);
                wipeout.base.watched.afterNextObserveCycle(function () {
                    start();
                });
            });
        });

        // act
        var n = subject.aa = [];
        stop();
    });

    testUtils.testWithUtils("observe", "array, re-assign", false, function(methods, classes, subject, invoker) {
        // arrange
        var subject = buildSubject();
        var o = subject.aa = new wipeout.base.array([1,2,3]);
        var n = [];
        
        subject.observe("aa", function(old, newVal) {
            strictEqual(old, o);
            strictEqual(newVal, n);
            start();
        });

        // act
        stop();
        subject.aa = n;
    });

    testUtils.testWithUtils("computed", "simple change, complex functions are in computed.js", false, function(methods, classes, subject, invoker) {
        // arrange
        var subject = buildSubject();
        subject.val1 = buildSubject();
        subject.val1.val2 = "hello";
        subject.val3 = "world";

        var disp = subject.computed("comp", function() {
            return this.val1.val2 + " " + this.val3;
        });

        subject.observe("comp", function(oldVal, newVal) {
            strictEqual(oldVal, "hello world");
            strictEqual(newVal, "hello shane");
            start();
        });

        // act
        stop();
        subject.val3 = "shane";
        
        // assert
        ok(disp instanceof wipeout.base.computed);
    });

    testUtils.testWithUtils("various disposals", null, false, function(methods, classes, subject, invoker) {
        // arrange
        var subject = buildSubject();
        subject.val1 = buildSubject();
        subject.val1.val2 = "hello";
        subject.val3 = "world";
        subject.val4 = new wipeout.base.array();

        var isOk = true;
        subject.computed("comp", function() {
            ok(isOk, "computed");
            isOk = false;
            
            return this.val1.val2 + " " + this.val3;
        });

        subject.observe("val3", function(oldVal, newVal) {
            ok(false, "observe property");
        });

        subject.observe("val1.val2", function(oldVal, newVal) {
            ok(false, "observe path");
        });

        subject.observeArray("val4", function(oldVal, newVal) {
            ok(false, "observeArray");
        });

        // act
        subject.dispose();
        stop();
        
        subject.val3 = "bad";
        subject.val1.val2 = "bad";
        subject.val4.push("bad");
        
        // assert
        setTimeout(function () {
            ok(true);
            start();
        }, 100);
    });
}

testMe("wipeout.base.watched", function() { return new watched(); });
testMe("wipeout.base.watched, do not use prototype", function() { return watch(); });