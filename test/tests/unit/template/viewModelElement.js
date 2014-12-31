module("wipeout.template.viewModelElement", {
    setup: function() {
    },
    teardown: function() {
    }
});

var viewModelElement = wipeout.template.viewModelElement;

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    subject.template = {};
    subject.init = methods.method();
    var xmlOverride = {
        name: "KJBKBJK"
    },
    constructor = function(){
        this.templateId = {
            subscribe: methods.method([subject.template, subject])
        };
    },
    parent = {},
    element;
    
    classes.mock("wipeout.utils.obj.getObject", function() {
        strictEqual(arguments[0], xmlOverride.name);
        return constructor;
    });
    
    document.getElementById("qunit-fixture").appendChild(element = document.createElement("div"));
    
    // act
    invoker(element, xmlOverride, parent);
    
    // assert
    strictEqual(subject.openingTag.constructor, Comment);
    strictEqual(subject.openingTag.textContent, " " + xmlOverride.name + " ");
    strictEqual(subject.openingTag.wipeoutOpening, subject);
    strictEqual(subject.closingTag.constructor, Comment);
    strictEqual(subject.closingTag.textContent, " /" + xmlOverride.name + " ");
    strictEqual(subject.closingTag.wipeoutClosing, subject);
    
    strictEqual(subject.viewModel.constructor, constructor);
    strictEqual(subject.renderContext.constructor, wipeout.template.renderContext);
    
    equal(element.parentElement, undefined);
    strictEqual(subject.openingTag.parentElement, document.getElementById("qunit-fixture"));
});

/*
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


testUtils.testWithUtils("dispose", null, false, function(methods, classes, subject, invoker) {
    // arrange    
    subject.closingTag = {};
    subject.closingTag.parentElement = {
        removeChild: methods.method([subject.closingTag])
    };
    subject.viewModel = {
        dispose: methods.method()
    };
    subject.dispose = {};
                                
    var item = viewModelElement("asd");
    
    // act
    item.dispose.apply(subject);
    
    //assert
    ok(!subject.viewModel);
    ok(!subject.dispose);
});

testUtils.testWithUtils("init", "not lastTag", false, function(methods, classes, subject, invoker) {
    // arrange
    subject.closingTag = {};
    subject.nextSibling = {};
    subject.parentElement = {
        insertBefore: methods.method([subject.closingTag, subject.nextSibling])
    };
    subject.viewModel = {
        render: methods.method()
    };
                           
    subject.init = {};     
    var item = viewModelElement("asd");
    
    // act
    item.init.apply(subject);
    
    //assert
    ok(!subject.init);
});

testUtils.testWithUtils("init", "lastTag", false, function(methods, classes, subject, invoker) {
    // arrange
    subject.closingTag = {};
    subject.parentElement = {
        appendChild: methods.method([subject.closingTag])
    };
    subject.viewModel = {
        render: methods.method()
    };
                           
    subject.init = {};    
                                
    var item = viewModelElement("asd");
    
    // act
    item.init.apply(subject);  
    
    //assert
    ok(!subject.init);  
});

/*
module("xxx", {
    setup: function() {
    },
    teardown: function() {
    }
}); 

test("test", function() {
    window.hello = {yes:{}}
    var ttt = new wipeout.template.compiledTemplate(
        wipeout.template.templateParser("<div><hello.yes /><span /></div>"));
    
    
    debugger;
    ok(true);
});*/