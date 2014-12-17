module("wipeout.template.viewModelElement", {
    setup: function() {
    },
    teardown: function() {
    }
});

var viewModelElement = wipeout.template.viewModelElement;

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "something", vm = {};
    
    // act
    var output = invoker("       " + name + "        ", vm);
    
    //assert
    strictEqual(output.nodeType, 8);
    strictEqual(output.nodeValue, " " + name + " ");
    strictEqual(output.closingTag.nodeType, 8);
    strictEqual(output.closingTag.nodeValue, " /" + name + " ");
    
    strictEqual(output.closingTag.wipeoutClosingTag, true);
    strictEqual(output.wipeoutOpeningTag, true);
    
    strictEqual(output.closingTag.openingTag, output);
    strictEqual(output.closingTag, output.closingTag);
    
    strictEqual(output.viewModel, vm);
});

testUtils.testWithUtils("setName", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "something";
    subject = viewModelElement("LKJBLKJB");
    
    // act
    subject.setName(name);
    
    //assert
    strictEqual(subject.nodeValue, " " + name + " ");
    strictEqual(subject.closingTag.nodeValue, " /" + name + " ");
});
