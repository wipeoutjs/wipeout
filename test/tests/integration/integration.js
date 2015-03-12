
module("wipeout.tests.integration.integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

/*test("move view model", function() {
    // arrange
    application.template('<wo.content-control id="toMove">\
    <template>\
        <span></span>\
    </template>\
</wo.content-control>\
<wo.content-control id="moveToParent1" share-parent-scope="true">\
    <template>\
        <div id="moveToPosition1"></div>\
    </template>\
</wo.content-control>\
<wo.content-control id="moveToParent2">\
    <template>\
        <div id="moveToPosition2"></div>\
    </template>\
</wo.content-control>');
    
    var toMove = application.templateItems.toMove;
    var moveToParent2 = application.templateItems.moveToParent2;
    strictEqual(toMove.getParent(), application);
    strictEqual(moveToParent2.getParent(), application);
    
    // act
    wo.move(function() {
        $(toMove.entireViewModelHtml()).appendTo("#moveToPosition1");
    });
    stop();
    
    // assert
    setTimeout(function() {
        strictEqual(toMove.getParent(true), application.templateItems.moveToParent1);
        strictEqual(toMove, application.templateItems.toMove);
        
        $(toMove.entireViewModelHtml()).appendTo("#moveToPosition2");        
        setTimeout(function() {
            strictEqual(toMove.getParent(), application.templateItems.moveToParent2);
            
            // test template items have changed
            ok(!application.templateItems.toMove);
            strictEqual(toMove, application.templateItems.moveToParent2.templateItems.toMove);
            
            start();
        }, 150);
    }, 150);    
});*/