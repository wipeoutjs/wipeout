module("integration: wipeout.template.rendering.htmlPropertyValue", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("prime and other attribute", function() {
	
    wo.addHtmlAttribute("temp-attr", function (element, attr, renderContext) {
        var _ok = false, disp = function () { _ok = true; };
        
        ok(!attr.otherAttribute("not-an-attribute", function(){}));
        
        ok(attr.otherAttribute("visible", function (attr) {
            strictEqual(attr.getter()(), "yes I Am");
            return {dispose: disp};
        }));
        
        setTimeout(function () {
            application.setTemplate = "";
            application.onRendered = function () {
                ok(_ok);
                start();
            };
        }, 10);
    });
    
	// arrange
	// act
    // assert
    application.setTemplate = '<wo.content>\
    <set-template>\
        <div wo-visible--s="yes I Am" wo-temp-attr></div>\
    </set-template>\
</wo.content>';
	stop();
});