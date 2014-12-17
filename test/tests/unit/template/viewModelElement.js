module("wipeout.template.viewModelElement", {
    setup: function() {
    },
    teardown: function() {
    }
});

var viewModelElement = wipeout.template.viewModelElement;

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "something";
    
    // act
    invoker("       " + name + "        ");
    
    //assert
    strictEqual(subject.openingTag.nodeType, 8);
    strictEqual(subject.openingTag.nodeValue, " " + name + " ");
    strictEqual(subject.closingTag.nodeType, 8);
    strictEqual(subject.closingTag.nodeValue, " /" + name + " ");
    
    strictEqual(subject.closingTag.wipeoutClosingTag, true);
    strictEqual(subject.openingTag.wipeoutOpeningTag, true);
    
    strictEqual(subject.closingTag.openingTag, subject.openingTag);
    strictEqual(subject.openingTag.closingTag, subject.closingTag);
});

testUtils.testWithUtils("setName", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "something";
    subject = new viewModelElement("LKJBLKJB");
    
    // act
    subject.setName(name);
    
    //assert
    strictEqual(subject.openingTag.nodeValue, " " + name + " ");
    strictEqual(subject.closingTag.nodeValue, " /" + name + " ");
});
