module("wipeout.viewModels.if", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("if", "and all functionality (kind of an integration test)", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = new wipeout.viewModels["if"]();
    subject.condition = true;
    subject.template = "asdfsdfgkhlsaklksndf";
    subject.elseTemplate = "LAJKISBDKJBASDKJ";
    
    // act
    // assert
    asyncAssert(function() {
        var yes = subject.templateId();
        var no = subject.elseTemplateId;
        
        subject.condition = false;
        asyncAssert(function() {
            strictEqual(no, subject.templateId());
            
            subject.condition = true;
            asyncAssert(function() {
                strictEqual(yes, subject.templateId());
            });
        });
    });
});