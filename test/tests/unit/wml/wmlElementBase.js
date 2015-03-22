module("wipeout.wml.wmlElementBase", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("push, splice", "no getParentElement", false, function(methods, classes, subject, invoker) {
    
    // arrange
    var subject = new wipeout.wml.wmlElementBase();
    
    // act    
    //assert
    throws(function () {
        subject.push({});
    });
    throws(function () {
        subject.push(0, 0, {});
    });
});


testUtils.testWithUtils("push, splice", "has parent element", false, function(methods, classes, subject, invoker) {
    
    // arrange
    var subject = new wipeout.wml.wmlElementBase();
    var input = {
        getParentElement: wipeout.wml.wmlElement.prototype.getParentElement
    };
    input._parentElement = [input];
    
    // act    
    //assert
    throws(function () {
        subject.push(input);
    });
    throws(function () {
        subject.push(0, 0, input);
    });
});

testUtils.testWithUtils("push, splice", "ok", false, function(methods, classes, subject, invoker) {
    
    // arrange
    var subject = new wipeout.wml.wmlElementBase();
    var input1 = {
        getParentElement: wipeout.wml.wmlElement.prototype.getParentElement
    }, input2 = {
        getParentElement: wipeout.wml.wmlElement.prototype.getParentElement
    }, input3 = {
        getParentElement: wipeout.wml.wmlElement.prototype.getParentElement
    };
    
    // act  
    subject.push(input1);  
    subject.splice(1, 0, input2, input3);  
    
    //assert
    strictEqual(subject[0], input1);
    strictEqual(subject[1], input2);
    strictEqual(subject[2], input3);
    
    strictEqual(input1.getParentElement(), subject);
    strictEqual(input2.getParentElement(), subject);
    strictEqual(input3.getParentElement(), subject);
});

testUtils.testWithUtils("serializeContent", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var string1 = "LKJBLKJBLKJBLKJBKLJBKJ", string2 = "IP*Y(GP(*G:OPG(:P";
    subject[0] = { serialize: function() { return string1; } };
    subject[1] = { serialize: function() { return string2; } };
    subject.length = 2;
    
    // act  
    var output = invoker();
    
    //assert    
    strictEqual(output, string1 + string2);
});