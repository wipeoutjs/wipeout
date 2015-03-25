module("wipeout.wml.wmlAttribute", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("serializeValue", "inline", false, function(methods, classes, subject, invoker) {
    
	function test (value) {
		// arrange
		subject.value = value;
		var html = document.createElement("div");

		// act
		html.innerHTML = '<div data-attr' + invoker() + '></div>';
		
		//assert
		strictEqual(html.innerHTML, '<div data-attr' + invoker() + '></div>');
		strictEqual(html.childNodes[0].attributes.length, 1);
		strictEqual(value, html.childNodes[0].attributes["data-attr"].value);
	}
	
	test('hello');
	test('asds"');
	test('asds\\"');
	test('asds&');
	test('asds<');
	test('asds&amp;&quot;');
});