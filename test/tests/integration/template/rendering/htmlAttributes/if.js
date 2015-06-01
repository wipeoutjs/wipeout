module("integration: wipeout.template.initialization.htmlAttributes.wo-if", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("if", function() {
    
    // arrange
    application.model = false;
    
    // act
    application.setTemplate = '<div wo-if="$model">\
    <span id="woIfTest"></span>\
</div>';
    
    application.onRendered = function () {
        // assert
        ok(!document.getElementById("woIfTest"));
        
        var disp = application.observe("model", function () {
            disp.dispose();
            ok(document.getElementById("woIfTest"));
        
            disp = application.observe("model", function () {
                disp.dispose();
                ok(!document.getElementById("woIfTest"));
                start();
            });
            
            application.model = false;
        });
            
        application.model = true;
    }
    
    stop();
});