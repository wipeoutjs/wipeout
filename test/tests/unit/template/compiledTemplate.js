module("wipeout.template.compiledTemplate", {
    setup: function() {
    },
    teardown: function() {
    }
});

var compiledTemplate = wipeout.template.compiledTemplate;

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    // arrange
    var template = [{}];
    subject.addNode = methods.customMethod(function (a) {
        methods.method([template][0])(a);
        subject.html.push("a");
        subject.html.push("b");
        subject.html.push("c");
    });
    
    // act
    invoker(template);
    
    // assert
    strictEqual(subject.html.length, 1);
    strictEqual(subject.html[0], "abc");
});

var string = "string", idString = "id";

testUtils.testWithUtils("addNonElement", null, false, function(methods, classes, subject, invoker) {
    // arrange
    subject.html = [];
    var val = "KJBKJB";
    
    // act
    invoker({serialize:function(){return val;}});
    
    // assert
    strictEqual(subject.html.length, 1);
    strictEqual(subject.html[0], val);
});

testUtils.testWithUtils("addViewModel", null, false, function(methods, classes, subject, invoker) {
    // arrange
    subject.html = [];
    var input = {};
    
    // act
    invoker(input);
    
    // assert
    strictEqual(subject.html.length, 3);
    strictEqual(subject.html[0], "<script");
    strictEqual(subject.html[1][0].action, wipeout.template.htmlAttributes.wipeoutCreateViewModel);
    strictEqual(subject.html[1][0].value, input);
    strictEqual(subject.html[2], ' type="placeholder"></script>');
});

testUtils.testWithUtils("addAttributes", "regular attribute", false, function(methods, classes, subject, invoker) {
    // arrange
    var name = "KJBKJB", val = "KHBJKVHV"
    subject.html = {
        push: methods.method([" " + name + val])
    };
    
    // act
    var op = invoker({"KJBKJB":{serializeValue: function() { return val; }}});
    
    // assert
});

testUtils.testWithUtils("addAttributes", "special attribute", false, function(methods, classes, subject, invoker) {
    // arrange
    var name = "KJBKJB", val = {value:{}};
    subject.html = [];
    
    classes.mock("wipeout.template.htmlAttributes." + name, {});
    
    // act
    var op = invoker({"KJBKJB":val});
    
    // assert
    strictEqual(subject.html.length, 1);
    strictEqual(subject.html[0][0].action, wipeout.template.htmlAttributes[name]);
    strictEqual(subject.html[0][0].value, val.value);
});

testUtils.testWithUtils("addElement", "inline", false, function(methods, classes, subject, invoker) {
    // arrange
    var input = {
        name: "lknlknkln",
        attributes: {},
        inline: true
    };
    subject.html = [];
    subject.addAttributes = methods.method([input.attributes]);
    
    // act
    invoker(input);
    
    // assert
    strictEqual(subject.html.length, 2);
    strictEqual(subject.html[0], "<" + input.name);
    strictEqual(subject.html[1], " />");
});

testUtils.testWithUtils("addElement", "not inline", false, function(methods, classes, subject, invoker) {
    // arrange
    var input = {
        name: "lknlknkln",
        attributes: {},
        length: 1,
        "0": {}
    };
    subject.html = [];
    subject.addAttributes = methods.method([input.attributes]);
    subject.addNode = methods.method([input["0"]]);
    
    // act
    invoker(input);
    
    // assert
    strictEqual(subject.html.length, 3);
    strictEqual(subject.html[0], "<" + input.name);
    strictEqual(subject.html[1], ">");
    strictEqual(subject.html[2], "</" + input.name + ">");
});

testUtils.testWithUtils("addNode", "non element", false, function(methods, classes, subject, invoker) {
    // arrange
    var node = {};
    subject._addedElements = [];
    subject.addNonElement = methods.method([node]);
    
    // act
    invoker(node);
    
    // assert
});

testUtils.testWithUtils("addNode", "element", false, function(methods, classes, subject, invoker) {
    // arrange
    var node = {name: "KJBKJBKJB",  nodeType: 1};
    subject._addedElements = [];
    subject.addElement = methods.method([node]);
    
    // act
    invoker(node);
    
    // assert
});

testUtils.testWithUtils("addNode", "view model", false, function(methods, classes, subject, invoker) {
    // arrange
    var name = "JHBKJBKJ", node = {name: name, nodeType: 1};
    subject._addedElements = [];
    subject.addViewModel = methods.method([node]);
    classes.mock(name, {})
    
    // act
    invoker(node);
    
    // assert
});