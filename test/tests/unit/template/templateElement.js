module("wipeout.wml.wmlElement", {
    setup: function() {
    },
    teardown: function() {
    }
});

var wmlElement = wipeout.wml.wmlElement;

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
    subject = new wmlElement("name", true);
    subject.attributes["attr"] = {serializeValue: function() { return "Val"; }};
    
    // act
    var output = subject.serialize();
    
    //assert
    strictEqual(output, "<name attrVal />");
});

testUtils.testWithUtils("serialize", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    subject = new wmlElement("name", false);
    subject.attributes["attr"] = {serializeValue: function() { return "Val"; }};
    subject.serializeContent = function() { return "children"; };
    
    // act
    var output = subject.serialize();
    
    //assert
    strictEqual(output, "<name attrVal>children</name>");
});