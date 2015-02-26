
module("wipeout.events.routedEventModel, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("routed event, from model", function() {
    // arrange
    var eventArgs = {}, triggered1 = false, triggered2 = false;
    var aRoutedEvent = new wo.routedEvent();
    application.model = {child:{child:{child:new wipeout.events.routedEventModel()}}};
    var open = "<wo.content-control id='item' model='$parent.model.child'><template>", close = "</template></wo.content-control>";
    application.template = open + open + open + "<div>hi</div>" + close + close + close;
	
	application.onRendered = function () {

		// arrange
		var secondDeepest = application.templateItems.item.templateItems.item;
		var deepest = secondDeepest.templateItems.item;

		ok(deepest);
		strictEqual(deepest.model.constructor, wipeout.events.routedEventModel);

		deepest.registerRoutedEvent(aRoutedEvent, function() {
			triggered1 = true;
		});

		secondDeepest.registerRoutedEvent(aRoutedEvent, function() {
			triggered2 = true;
		});

		// act
		deepest.onModelChanged = function () {
			deepest.model.triggerRoutedEvent(aRoutedEvent, eventArgs);

			// assert
			ok(triggered2);
			ok(triggered1);

			start();
		};
	};
	
	stop();
});

test("routed event, to model", function() {
    // arrange
    var model = new wipeout.events.routedEventModel();
    var aRoutedEvent = new wo.routedEvent();
    var open = "<wo.content-control id='item'><template>", close = "</template></wo.content-control>";
    application.template = open + open + open + "<div>hi</div>" + close + close + close;
	
	application.onRendered = function () {
	
		application.registerRoutedEvent(aRoutedEvent, function() { this.__caught = true; }, application);
		model.registerRoutedEvent(aRoutedEvent, function() { this.__caught = true; }, model);
		application.templateItems.item.model = model;

		// act
		application.templateItems.item.templateItems.item.templateItems.item.triggerRoutedEvent(aRoutedEvent, {});

		// assert
		ok(application.__caught);
		ok(model.__caught);
		
		start();
	};
	
	stop();
});