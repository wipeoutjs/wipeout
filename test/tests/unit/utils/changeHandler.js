module("wipeout.utils.changeHandler", {
    setup: function() {
    },
    teardown: function() {
    }
});

var changeHandler = wipeout.utils.changeHandler;

testUtils.testWithUtils("constructor", "", false, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    subject = new changeHandler();
    
    // assert    
    strictEqual(subject._objects.constructor, Array);
    strictEqual(subject._properties.constructor, Array);
    strictEqual(subject._changes.constructor, Array);
});

testUtils.testWithUtils("allIndexesOf", "No indexes", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    var output = invoker([1, 2, 3, 1], 5);
    
    // assert
    strictEqual(output.length, 0);
});

testUtils.testWithUtils("allIndexesOf", "2 indexes", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    var output = invoker([1, 2, 3, 1], 1);
    
    // assert
    strictEqual(output.length, 2);
    strictEqual(output[0], 0);
    strictEqual(output[1], 3);
});

testUtils.testWithUtils("lastIndexOf", "No index", false, function(methods, classes, subject, invoker) {
    // arrange
    subject._objects =      [{}, 11, {}, {}, {}, 11, 11, {}];
    subject._properties =   [{}, 22, {}, {}, {}, 22, {}, {}];
    
    // act
    var output = invoker(33, 33);
    
    // assert
    strictEqual(output, -1);
});

testUtils.testWithUtils("lastIndexOf", "Has index", false, function(methods, classes, subject, invoker) {
    // arrange
    subject._objects =      [{}, 11, 11, 11, {}];
    subject._properties =   [{}, 22, 22, {}, {}];
    
    // act
    var output = invoker(11, 22);
    
    // assert
    strictEqual(output, 2);
});

testUtils.testWithUtils("push", "", false, function(methods, classes, subject, invoker) {
    // arrange
    subject._objects = [];
    subject._properties = [];
    subject._changes = [];
    subject.go = function() {
        start();
    };
    
    // act
    var output = invoker(1, 2, 3, 4, 5);
    stop();
    
    // assert
    strictEqual(subject._objects.length, 1);
    strictEqual(subject._objects[0], 1);
    strictEqual(subject._properties.length, 1);
    strictEqual(subject._properties[0], 2);
    strictEqual(subject._changes.length, 1);
    strictEqual(subject._changes[0].woBag, 3);
    strictEqual(subject._changes[0].oldVal, 4);
    strictEqual(subject._changes[0].newVal, 5);
});

testUtils.testWithUtils("shift", "no values", false, function(methods, classes, subject, invoker) {
    // arrange
    subject._objects = [];
    subject._properties = [];
    subject._changes = [];
    
    // act
    var output = invoker();
    
    // assert
    strictEqual(output, undefined);
});

testUtils.testWithUtils("shift", "has values", false, function(methods, classes, subject, invoker) {
    // arrange
    subject._objects = [1, {}];
    subject._properties = [2, {}];
    subject._changes = [{
        oldVal: 3,
        newVal: 4,
        woBag: 5
    },{}];
    
    // act
    var output = invoker();
    
    // assert
    strictEqual(output.object, 1);
    strictEqual(output.property, 2);
    strictEqual(output.oldVal, 3);
    strictEqual(output.newVal, 4);
    strictEqual(output.woBag, 5);
});

testUtils.testWithUtils("go", "does go", false, function(methods, classes, subject, invoker) {
    // arrange
    subject._go = methods.method();
    
    // act
    invoker();
    
    // assert
    strictEqual(subject.__going, true);
});

testUtils.testWithUtils("go", "does not", false, function(methods, classes, subject, invoker) {
    // arrange
    subject.__going = true;
    subject._go = function() { ok(false); };
    
    // act
    invoker();
    
    // assert
    ok(true);
});

testUtils.testWithUtils("_go", "no values", false, function(methods, classes, subject, invoker) {
    // arrange
    subject.__going = true;
    subject.shift = methods.method();
    
    // act
    invoker();
    
    // assert
    strictEqual(subject._going, undefined);
});

testUtils.testWithUtils("_go", "with values", false, function(methods, classes, subject, invoker) {
    // arrange
    var callback1 = function(old, newV) {
        strictEqual(old, 4);
        strictEqual(newV, 5);
        callback1 = null;
    };
    
    callback1.evaluateOnEachChange = true;
    
    var next = 2
    subject.shift = methods.method([], {
        go: function() {
            strictEqual(arguments[0], subject);
            start();
        }
    });
    
    // act
    // assert
    invoker();
    stop();
});