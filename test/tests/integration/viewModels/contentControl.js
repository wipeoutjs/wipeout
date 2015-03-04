module("wipeout.viewModels.contentControl, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("setting template inline", function() {
    
    // arrange
    // act
	var innerTemplate = "<wo.content-control xxx='true' a-property='true' id='item'></wo.content-control>";
    application.template = '<wo.content-control id="item" template="' + innerTemplate + '" ></wo.content-control>';
    
    // assert
	application.onRendered = function () {
		ok(application.templateItems.item.templateItems.item.aProperty);		
		start();
	};
	
	stop();
});