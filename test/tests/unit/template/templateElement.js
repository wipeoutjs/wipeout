module("wipeout.template.templateElement", {
    setup: function() {
    },
    teardown: function() {
    }
});

var templateElement = wipeout.template.templateElement;

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = {}, inline = {};
    subject._super = methods.method();
    
    // act    
    invoker(name, inline);
    
    //assert
    strictEqual(subject.name, name);
    ok(subject.attributes);
    strictEqual(subject.inline, true);
    strictEqual(subject.nodeType, 1);
});

testUtils.testWithUtils("serialize", "inline", false, function(methods, classes, subject, invoker) {
    
    // arrange
    subject = new templateElement("name", true);
    subject.attributes["attr"] = {surrounding: "@", value: "val"};
    
    // act
    var output = subject.serialize();
    
    //assert
    strictEqual(output, "<name attr=@val@ />");
});

testUtils.testWithUtils("serialize", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    subject = new templateElement("name", false);
    subject.attributes["attr"] = {surrounding: "@", value: "val"};
    subject.serializeChildren = function() { return "children"; };
    
    // act
    var output = subject.serialize();
    
    //assert
    strictEqual(output, "<name attr=@val@>children</name>");
});