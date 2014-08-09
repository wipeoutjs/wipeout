module("wipeout.polyfills.Array", {
    setup: function() {
    },
    teardown: function() {
    }
});

var array = wipeout.polyfills.Array;

testUtils.testWithUtils("indexOf", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var item = {};
    var test = [1, 2, 3, 4, 5, 6, item];
    
    // act
    // assert
    strictEqual(test.indexOf(3), array.prototype.indexOf.call(test, 3));
    strictEqual(test.indexOf(item), array.prototype.indexOf.call(test, item));
    strictEqual(test.indexOf({}), array.prototype.indexOf.call(test, {}));
});