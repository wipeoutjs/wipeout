module("integration: wipeout.template.initialization.htmlAttributes.wo-foreach", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("foreach", function() {
    
    // arrange
    application.model = busybody.array([1,2,3]);
    
    // act
    application.setTemplate = '<ul wo-foreach="$model">\
    <li wo-attr-id="\'woIfTest\' + $model"></li>\
</ul>';
    
    application.onRendered = function () {
        // assert
        setTimeout(function () {
            ok(document.getElementById("woIfTest1"));
            ok(document.getElementById("woIfTest2"));
            ok(document.getElementById("woIfTest3"));
            
            application.model.splice(1, 1, 6);
            setTimeout(function () {
                ok(document.getElementById("woIfTest1"));
                ok(document.getElementById("woIfTest6"));
                ok(document.getElementById("woIfTest3"));
                ok(!document.getElementById("woIfTest2"));
                start();
            }, 20);
        }, 20);
    }
    
    stop();
});

test("foreach, deep change, with null", function() {
    
    // arrange
    application.model = { prop1: { prop2: busybody.array([1,2,3]) }};
    
    // act
    application.setTemplate = '<ul wo-foreach="$model.prop1.prop2">\
    <li wo-attr-id="\'woIfTest\' + $model"></li>\
</ul>';
    
    application.onRendered = function () {
        // assert
        setTimeout(function () {
            ok(document.getElementById("woIfTest1"));
            ok(document.getElementById("woIfTest2"));
            ok(document.getElementById("woIfTest3"));
            
            application.model = null;
            setTimeout(function () {
                ok(!document.getElementById("woIfTest1"));
                ok(!document.getElementById("woIfTest2"));
                ok(!document.getElementById("woIfTest3"));
                start();
            }, 20);
        }, 20);
    }
    
    stop();
});

test("foreach, deep change, with new array", function() {
    
    // arrange
    var tmp;
    application.model = { prop1: { prop2: tmp = busybody.array([1,2,3]) }};
    
    // act
    application.setTemplate = '<ul wo-foreach="$model.prop1.prop2">\
    <li wo-attr-id="\'woIfTest\' + $model"></li>\
</ul>';
    
    application.onRendered = function () {
        // assert
        setTimeout(function () {
            ok(document.getElementById("woIfTest1"));
            ok(document.getElementById("woIfTest2"));
            ok(document.getElementById("woIfTest3"));
            
            application.model = { prop1: { prop2: [5, 6, 7] }};
            tmp.push(222);
            
            setTimeout(function () {
                ok(!document.getElementById("woIfTest222"));
                ok(document.getElementById("woIfTest5"));
                ok(document.getElementById("woIfTest6"));
                ok(document.getElementById("woIfTest7"));
                start();
            }, 40);
        }, 20);
    }
    
    stop();
});