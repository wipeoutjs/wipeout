
module("integration: wipeout.events.routedEvent", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("routed event", function() {
    // arrange
    var aRoutedEvent = {};
    var open = "<wo.content-control id='item'><set-template>", close = "</set-template></wo.content-control>";
    application.setTemplate = open + open + open + "<div>hi</div>" + close + close + close;
    
	application.onRendered = function () {
		// arrange
		application.registerRoutedEvent(aRoutedEvent, function() { this.__caught = true; }, application);
		application.templateItems.item.registerRoutedEvent(aRoutedEvent, function() { this.__caught = true; }, application.templateItems.item);
		
		// act
		application.templateItems.item.templateItems.item.templateItems.item.triggerRoutedEvent(aRoutedEvent, {});

		// assert
		ok(application.__caught);
		ok(application.templateItems.item.__caught);
		
		start();
	};
	
	stop();
});
	
test("routed event, handled", function() {
    // arrange
    var aRoutedEvent = {};
    var open = "<wo.content-control id='item'><set-template>", close = "</set-template></wo.content-control>";
    application.setTemplate = open + open + open + "<div>hi</div>" + close + close + close;
	
	application.onRendered = function () {
	
		// arrange
		application.registerRoutedEvent(aRoutedEvent, function() { this.__caught = true; }, application);
		application.templateItems.item.registerRoutedEvent(aRoutedEvent, function() { 
			this.__caught = true; 
			arguments[0].handled = true;
		}, application.templateItems.item);

		// act
		application.templateItems.item.templateItems.item.templateItems.item.triggerRoutedEvent(aRoutedEvent, {});

		// assert
		ok(!application.__caught);
		ok(application.templateItems.item.__caught);
		
		start();
	};
	
	stop();
});