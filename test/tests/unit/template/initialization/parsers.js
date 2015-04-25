
module("wipeout.template.initialization.parsers", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("template", null, true, function(methods, classes, subject, invoker) {
    // arrange    
    // act    
    // assert   
    strictEqual(invoker("aval"), "aval");
});

testUtils.testWithUtils("string", null, true, function(methods, classes, subject, invoker) {
    // arrange    
    // act    
    // assert   
    strictEqual(invoker("aval"), "aval");
});

testUtils.testWithUtils("bool", null, true, function(methods, classes, subject, invoker) {
    // arrange    
    // act    
    // assert   
    strictEqual(invoker(" tRue "), true);
});

testUtils.testWithUtils("int", null, true, function(methods, classes, subject, invoker) {
    // arrange    
    // act    
    // assert   
    strictEqual(invoker(" 44 "), 44);
});

testUtils.testWithUtils("float", null, true, function(methods, classes, subject, invoker) {
    // arrange    
    // act    
    // assert   
    strictEqual(invoker(" 44.55 "), 44.55);
});

testUtils.testWithUtils("regexp", null, true, function(methods, classes, subject, invoker) {
    // arrange    
    // act    
    // assert   
    ok(invoker("^Hello$").test("Hello"));
});

testUtils.testWithUtils("date", null, true, function(methods, classes, subject, invoker) {
    // arrange    
    // act    
    // assert   
    strictEqual(invoker("2012/01/01") - new Date("2012/01/01"), 0);
});
    
testUtils.testWithUtils("json", null, true, function(methods, classes, subject, invoker) {
    // arrange
    // act    
    var json = invoker('{"val1":8,"val2":"3"}')
    
    // assert   
    strictEqual(json.val1, 8);
    strictEqual(json.val2, "3");
});