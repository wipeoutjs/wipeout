module("wipeout.viewModels.contentControl", {
    setup: function() {
    },
    teardown: function() {
    }
});

var contentControl = wipeout.viewModels.contentControl;

testUtils.testWithUtils("constructor", "and all functionality", false, function(methods, classes, subject, invoker) {
    // arrange
    var template = {}, templateId = {}, model = {};
    subject._super = methods.method([templateId, model]);
    subject.templateId = {};
    classes.mock("wipeout.viewModels.contentControl.createNONOBSERVABLETemplatePropertyFor", function() {
        methods.method([subject, "templateId", "template"])(arguments[0], arguments[1]);
        return template;
    }, 1);
    
    // act
    // assert
    invoker(templateId, model);
});

testUtils.testWithUtils("createNONOBSERVABLETemplatePropertyFor", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var templateValue = "Hi";
    var owner = new wipeout.viewModels.visual();
    var t1 = owner.testTemplateId = contentControl.createAnonymousTemplate(templateValue);
    
    // act
    contentControl.createNONOBSERVABLETemplatePropertyFor(owner, "testTemplateId", "testTemplate");
    
    // assert
    asyncAssert(function() {
        strictEqual($("#" + owner.testTemplateId).html(), owner.testTemplate);
        
        owner.testTemplate = "Bye";
        asyncAssert(function() {
            ok(t1 != owner.testTemplateId);
        
            owner.testTemplateId = t1;
            asyncAssert(function() {
                strictEqual(owner.testTemplate, templateValue);
            });
        });
    });
});

testUtils.testWithUtils("createNONOBSERVABLETemplatePropertyFor", "disposal, dependant on \"createNONOBSERVABLETemplatePropertyFor\" passing", true, function(methods, classes, subject, invoker) {
    // arrange
    var templateValue = "Hi";
    var owner = new wipeout.viewModels.visual();
    var t1 = owner.testTemplateId = contentControl.createAnonymousTemplate(templateValue);
    
    // act
    contentControl.createNONOBSERVABLETemplatePropertyFor(owner, "testTemplateId", "testTemplate").dispose();
    
    // assert
    asyncAssert(function() {
        strictEqual($("#" + owner.testTemplateId).html(), owner.testTemplate);
        
        templateValue = owner.testTemplate = "Bye";
        asyncAssert(function() {
            strictEqual(t1, owner.testTemplateId);
                    
            owner.testTemplateId = contentControl.createAnonymousTemplate("Something else");
            asyncAssert(function() {
                strictEqual(owner.testTemplate, templateValue);
            });
        });
    });
});

testUtils.testWithUtils("createAnonymousTemplate", "Create same template twice", true, function(methods, classes, subject, invoker) {
    // arrange
    var val = "LKJBLKJBKJBLKJBKJBKJB";
        
    // act
    var result1 = invoker(val, false);
    var result2 = invoker(val, false);
    
    // assert
    strictEqual(result1, result2);
    strictEqual($("#" + result1).html(), val);
    ok($("#" + result1).attr("data-templatehash"));
});

testUtils.testWithUtils("createAnonymousTemplate", "Create same template twice, force create", true, function(methods, classes, subject, invoker) {
    // arrange
    var val = "LKJBLKJBKJBLKJBKJBKJB";
        
    // act
    var result1 = invoker(val, false);
    var result2 = invoker(val, true);
    
    // assert
    notEqual(result1, result2);
    strictEqual($("#" + result1).html(), val);
    strictEqual($("#" + result2).html(), val);
    ok($("#" + result1).attr("data-templatehash"));
    ok($("#" + result2).attr("data-templatehash"));
});

testUtils.testWithUtils("deleteAnonymousTemplate", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var result = contentControl.createAnonymousTemplate("asdgdfs");
        
    // act
    invoker(result);
    
    // assert
    strictEqual($("#" + result).length, 0);
});

testUtils.testWithUtils("hashCode", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var str1 = "KJBJBJBJKBJKBJLKJ";
    var str2 = "sdfsdfdfsdfsdfsdf";
    
    // act
    var result1 = invoker(str1);
    var result2 = invoker(str1);
    var result3 = invoker(str2);
    
    // assert
    strictEqual(result1, result2);
    notEqual(result1, result3);
});

testUtils.testWithUtils("templateExists", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var id = "pajslkdjalkjhd";
    $("#qunit-fixture").html("<siv id=\"" + id + "\"></div>");
    
    // act    
    // assert
    ok(invoker(id));
});

testUtils.testWithUtils("createTemplate", "template exists", true, function(methods, classes, subject, invoker) {
    // arrange
    var id = "pajasdasdslkdjalkjhd";
    $("#qunit-fixture").html("<div id=\"" + id + "\"></div>");
        
    // act
    // assert
    throws(function() {
        invoker(id, "asdsad", "sadasd");
    });    
});

testUtils.testWithUtils("createTemplate", "created", true, function(methods, classes, subject, invoker) {
    // arrange
    var id = "pajslkdjalkjhd";
    var content = "LKJBLKUGHLUBK>JHG";
    var hash = "98asd98sdf";
    
    // act
    invoker(id, content, hash);
    
    // assert
    strictEqual($("#" + id + "[data-templatehash=" + hash + "]").html(), content);
    strictEqual($("#" + id + "[data-templatehash=" + hash + "]").parent()[0].style.display, "none");
});