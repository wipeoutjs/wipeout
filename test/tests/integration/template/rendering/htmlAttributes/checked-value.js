module("integration: wipeout.template.initialization.htmlAttributes.wo-checked-value", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

var check = function (element, check) {
    
    check ? element.setAttribute("checked", "checked") : element.removeAttribute("checked");
    var event = document.createEvent("UIEvents");
    event.initUIEvent("change", true, true, null, 1);
    element.dispatchEvent(event);
};

test("checkbox, no value", function() {
    application.setTemplate = '<input type="checkbox" wo-checked-value="$this.val" id="theCheckbox" />';
    
    application.onRendered = function () {
        strictEqual(application.val, false);
        
        var disp = application.observe("val", function () {
            disp.dispose();
            strictEqual(application.val, true);
            
            disp = application.observe("val", function () {
                disp.dispose();
                strictEqual(application.val, false);
                start();
            });
            check(document.getElementById("theCheckbox"), false);
        });
        check(document.getElementById("theCheckbox"), true);
    };
    
    stop();
});

test("checkbox, html value", function() {
    application.setTemplate = '<input type="checkbox" wo-checked-value="$this.val" value="hello" id="theCheckbox" />';
    
    application.onRendered = function () {
        strictEqual(application.val, null);
        
        var disp = application.observe("val", function () {
            disp.dispose();
            strictEqual(application.val, "hello");
            
            disp = application.observe("val", function () {
                disp.dispose();
                strictEqual(application.val, null);
                start();
            });
            check(document.getElementById("theCheckbox"), false);
        });
        check(document.getElementById("theCheckbox"), true);
    };
    
    stop();
});

test("checkbox, wo-value", function() {
    application.theValue = {};
    application.setTemplate = '<input type="checkbox" wo-checked-value="$this.val" wo-value="$this.theValue" id="theCheckbox" />';
    
    application.onRendered = function () {
        strictEqual(application.val, null);
        
        var disp = application.observe("val", function () {
            disp.dispose();
            strictEqual(application.val, application.theValue);
            
            disp = application.observe("val", function () {
                disp.dispose();
                strictEqual(application.val, null);
                start();
            });
            check(document.getElementById("theCheckbox"), false);
        });
        check(document.getElementById("theCheckbox"), true);
    };
    
    stop();
});

test("checkbox, wo-value changed, checked", function() {
    var val1 = application.theValue = {}, val2 = {};
    application.setTemplate = '<input type="checkbox" wo-checked-value="$this.val" wo-value="$this.theValue" id="theCheckbox" checked="checked" />';
    
    application.onRendered = function () {
        var disp = application.observe("val", function () {
            disp.dispose();
            strictEqual(application.val, application.theValue);
            start();
        });
        
        application.theValue = val2;
    };
    
    stop();
});

test("checkbox, wo-value changed, not checked", function() {
    application.theValue = {};
    application.setTemplate = '<input type="checkbox" wo-checked-value="$this.val" wo-value="$this.theValue" id="theCheckbox" />';
    
    application.onRendered = function () {
        application.theValue = {};
        setTimeout(function () {
            strictEqual(application.val, null);
            start();
        }, 20);
    };
    
    stop();
});

test("radio, 3 types", function() {
    application.theValue = {};
    application.setTemplate = '<input type="radio" wo-checked-value="$this.val" id="theRadio1" />\
<input type="radio" wo-checked-value="$this.val" value="hello" id="theRadio2" />\
<input type="radio" wo-checked-value="$this.val" wo-value="$this.theValue" id="theRadio3" />';
    
    application.onRendered = function () {
        strictEqual(application.val, null);
        
        var disp = application.observe("val", function () {
            disp.dispose();
            strictEqual(application.val, true);
            
            disp = application.observe("val", function () {
                disp.dispose();
                strictEqual(application.val, "hello");
            
                disp = application.observe("val", function () {
                    disp.dispose();
                    strictEqual(application.val, application.theValue);
                    start();
                });
                check(document.getElementById("theRadio3"), true);
            });
            check(document.getElementById("theRadio2"), true);
        });
        check(document.getElementById("theRadio1"), true);
    };
    
    stop();
});