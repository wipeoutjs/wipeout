
module("wipeout.viewModels.if, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("wipeout.viewModels.if", function() {
    // arrange
    application.hello = obsjs.observe(obsjs.observe({hello: "xxx"}));
    application.template = '<wo.if share-parent-scope="false" condition="$parent.hello" id="target">\
    <template>\
        <div id="myDiv" data-bind="html: $parent.hello().hello"></div>\
    </template>\
</wo.if>';
    
	application.onRendered = function () {
		ok(document.getElementById("myDiv"));

		// act
		application.hello = null;

		// assert
		application.templateItems.target.onRendered = function () {
			ok(!document.getElementById("myDiv"));

			delete application.templateItems.target.onRendered;
			
			start();
		};
	}
	
	stop();
});