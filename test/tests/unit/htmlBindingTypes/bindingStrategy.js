module("wipeout.htmlBindingTypes.bindingStrategy", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("all values", null, false, function(methods, classes, subject, invoker) {
    
    function test (value, result) {
        // arrange
        var subject = {}, attribute = {value: function () { return value; }};
        
        // act
        wipeout.htmlBindingTypes.bindingStrategy(subject, attribute);
        
        // assert
        strictEqual(subject.$bindingStrategy, result);
    }
    
    test("  onlyBindObse rvab les", 0);
    test("0", 0);
    test(" bindno   nObservAbles", 1);
    test("1", 1);
    test("createObservablEs", 2);
    test("2", 2);
    
    throws(function () {
        test("JHBJHBKJBBJ");
    });
});