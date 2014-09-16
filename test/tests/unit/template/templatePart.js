module("wipeout.template.templatePart", {
    setup: function() {
    },
    teardown: function() {
    }
});

var templateParser = wipeout.template.templateParser;

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    
    // arrange    
    var value = {}, escaped = {};
    
    // act    
    invoker(value, escaped);
    
    //assert
    strictEqual(subject.value, value);
    strictEqual(subject.escaped, escaped);
    strictEqual(subject.nextChars.constructor, Array);
});

testUtils.testWithUtils("indexOf", "string, success", false, function(methods, classes, subject, invoker) {
    
    // arrange
    var find = "sadsad", begin = find + "lkjhjh";
    subject.value = find;
    
    // act    
    var output = invoker(begin + find, 1); // skip first
    
    //assert
    strictEqual(output.index, begin.length);
    strictEqual(output.length, find.length);
});

testUtils.testWithUtils("indexOf", "regex, success", false, function(methods, classes, subject, invoker) {
    
    // arrange
    var find = "sadsad", begin = find + "lkjhjh";
    subject.value = new RegExp(find);
    
    // act
    var output = invoker(begin + find, 1); // skip first
    
    //assert
    strictEqual(output.index, begin.length);
    strictEqual(output.length, find.length);
});

testUtils.testWithUtils("indexOf", "string, fail", false, function(methods, classes, subject, invoker) {
    
    // arrange
    subject.value = "X";
    
    // act
    var output = invoker("adfasfasdfsd"); // skip first
    
    //assert
    strictEqual(output, null);
});

testUtils.testWithUtils("indexOf", "regex, fail", false, function(methods, classes, subject, invoker) {
    
    // arrange
    subject.value = new RegExp("X");
    
    // act
    var output = invoker("adfasfasdfsd"); // skip first
    
    //assert
    strictEqual(output, null);
});