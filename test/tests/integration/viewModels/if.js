
module("integration: wipeout.viewModels.if", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("shareParentScope", function() {
	
    // arrange
    application.hello = new obsjs.observable({hello: "xxx"});
    application.template = '<wo.if id="blabla" condition="$this.hello">\
    <template>\
        <div id="myDiv" content="$this.hello.hello"></div>\
    </template>\
</wo.if>';
	
	application.onRendered = function () {
		ok(document.getElementById("myDiv"));
		
		// act
		application.hello = null;
		
		application.templateItems.blabla.observe("condition", function () {

			// assert
			ok(!document.getElementById("myDiv"));

			start();
		});
	}
	
	stop();
});

test("elseTemplate", function() {
	
    // arrange
    application.ok = true;
    application.template = '<wo.if id="theIf" condition="$this.ok">\
    <template>\
        <div id="myDiv1"></div>\
    </template>\
	<else-template>\
        <div id="myDiv2"></div>\
	</else-template>\
</wo.if>';
	
	application.onRendered = function () {
		ok(document.getElementById("myDiv1"));
		ok(!document.getElementById("myDiv2"));
		
		application.templateItems.theIf.observe("condition", function () {
			setTimeout(function () {
				ok(!document.getElementById("myDiv1"));
				ok(document.getElementById("myDiv2"));
				start();		
			});
		});
		
		application.ok = false;
	}
	
	stop();
});

test("shareParentScope = false", function() {
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