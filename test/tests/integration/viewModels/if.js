
module("integration: wipeout.viewModels.if", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("shareParentScope", function() {
	
    // arrange
    application.hello = new busybody.observable({hello: "xxx"});
    application.setTemplate = '<wo.if id="blabla" condition="$this.hello">\
    <if-true>\
        <div id="myDiv" content="$this.hello.hello"></div>\
    </if-true>\
</wo.if>';
	
	application.onRendered = function () {
		ok(document.getElementById("myDiv"));
		
		// act
		application.hello = null;
		
		application.templateItems.blabla.observe("condition", function () {
			// assert
			setTimeout(function () {
				ok(!document.getElementById("myDiv"));
				start();
			});
		});
	}
	
	stop();
});

test("elseTemplate", function() {
	
    // arrange
    application.ok = true;
    application.setTemplate = '<wo.if id="theIf" condition="$this.ok">\
    <if-true>\
        <div id="myDiv1"></div>\
    </if-true>\
	<if-false>\
        <div id="myDiv2"></div>\
	</if-false>\
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
    application.hello = busybody.observe(busybody.observe({hello: "xxx"}));
    application.setTemplate = '<wo.if share-parent-scope="false" condition="$this.hello" id="target">\
    <if-true>\
        <div id="myDiv" wo-content="$this.hello.hello"></div>\
    </if-true>\
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