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

test("bug, ensure template rendering is only invoked once ", function() {
    // arrange
    var open1 = "<wo.content-control id='item", open2 = "'><template>", close = "</template></wo.content-control>";
    application.template = open1 + "1" + open2 + open1 + "2" + open2 + "<div>hi</div>" + close + close;
		
	application.onRendered = function () {

		// arrange
		var item1 = application.templateItems.item1;
		var item2 = item1.templateItems.item2;
		ok(item2);
		
		setTimeout(function () {
			var i1 = application.templateItems.item1;
			var i2 = i1.templateItems.item2;
			ok(i2);
			
			strictEqual(i1, item1);
			strictEqual(i2, item2);
			start();
		}, 200);
	};
	
	stop();
});
