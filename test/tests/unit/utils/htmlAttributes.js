module("wipeout.utils.htmlAttributes", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("onElementEvent", null, true, function(methods, classes, subject, invoker) {
	
	// arrange
	var executed = false;	
	$("#qunit-fixture").html("<button></button>");
	var button = $("#qunit-fixture")[0].firstChild;
	var disp = invoker(button, "click", function () {
		ok(!executed);
		executed = true;
	});
	
	// act
	button.click();
	disp();
	button.click();
	
	// assert
	ok(executed);
});

function ss(methods, classes, subject, invoker) {
    // arrange
	        
	function htmlAttributes () {}
	
	htmlAttributes.onElementEvent = function (element, event, callback) { //TODO error handling
        
        //TODO, third arg in addEventListener (capture)
        element.addEventListener(event, callback);
        
        return function() {
            if (callback) {
                //TODO, third arg (capture)
                element.removeEventListener(event, callback);
                callback = null;
            }
        };
    }
	
	return htmlAttributes;
}