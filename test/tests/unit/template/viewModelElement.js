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

testUtils.testWithUtils("init", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var tid1 = {}, tid = 0;
    subject.initialization = {};
    subject.renderContext = {};
    subject.openingTag = document.createElement("div");
    subject.closingTag = document.createElement("div");
    document.getElementById("qunit-fixture").appendChild(subject.openingTag);
    subject.viewModel = {
        templateId: function() {
            tid++;
            return tid1;
        }
    };
    subject.viewModel.templateId.valueHasMutated = methods.method();
    
    classes.mock("wipeout.template.newEngine.instance.getVmInitializer", function () {
        strictEqual(arguments[0], subject.initialization);
        return {
            initialize: methods.method([subject.viewModel, subject.renderContext])
        };
    }, 1);
    
    // act
    invoker();
    
    // assert
    strictEqual(tid, 2);
});

testUtils.testWithUtils("unTemplate", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    subject.disposeOfBindings = methods.method();
    document.getElementById("qunit-fixture").innerHTML = '<div id="opening"></div><div id="rem1"></div><div id="rem2"></div><div id="closing"></div>';
    subject.openingTag = $("#opening", "#qunit-fixture")[0];
    subject.closingTag = $("#closing", "#qunit-fixture")[0];
        
    // act
    invoker();
    
    // assert
    equal(subject.disposeOfBindings, null);
    equal($("#rem1", "#qunit-fixture").length, 0);
    equal($("#rem2", "#qunit-fixture").length, 0);
    
    equal($("#opening", "#qunit-fixture").length, 1);
    equal($("#closing", "#qunit-fixture").length, 1);
});

testUtils.testWithUtils("template", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var templateId = {}, html = "LKJBVJLKHVJKHVK", dob = {};
    subject.unTemplate = methods.method();
    subject.renderContext = {};
    classes.mock("wipeout.template.newEngine.instance.getTemplate", function() {
        strictEqual(templateId, arguments[0]);
        return {
            getBuilder: methods.method([], {
                html: html,
                execute: methods.method([subject.renderContext], dob)
            })
        };
    });
    $("#qunit-fixture").append(subject.closingTag = document.createElement("div"));
    
    // act
    invoker(templateId);
    
    // assert
    strictEqual(subject.closingTag.previousSibling.textContent, html);
    strictEqual(subject.disposeOfBindings, dob);
});

testUtils.testWithUtils("dispose", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    subject.unTemplate = methods.method([undefined]);
    subject.viewModel = {
        dispose: methods.method()
    };
    
    $("#qunit-fixture").append(subject.closingTag = document.createElement("div"));
    $("#qunit-fixture").append(subject.openingTag = document.createElement("div"));
    
    // act
    invoker();
    
    // assert
    strictEqual(subject.viewModel, undefined);
    strictEqual(subject.openingTag.parentElement, null);
    strictEqual(subject.closingTag.parentElement, null);
});