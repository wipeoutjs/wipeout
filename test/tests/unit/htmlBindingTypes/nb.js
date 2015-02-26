module("wipeout.htmlBindingTypes.nb", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("binding", "xmlParserTempName", false, function(methods, classes, subject, invoker) {
    // arrange
	var parsed = {}, rc = {}, value = {}, vm = {}, name = "KJBKJBKJB", parser = methods.method([value, name, rc], parsed), setter = {
		getParser: methods.method([vm, name], parser),
		value: value
	};
	parser.xmlParserTempName = true;
	
	// act
	wipeout.htmlBindingTypes.nb(vm, setter, name, rc);
	
	// assert
	strictEqual(vm[name], parsed)
});

testUtils.testWithUtils("binding", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var value = {}, parsed = {}, rc = {}, vm = {}, name = "KJBKJBKJB", parser = methods.method([value, name, rc], parsed), setter = {
		getParser: methods.method([vm, name], parser),
		valueAsString: function () {
			return value;
		}
	};
	
	// act
	wipeout.htmlBindingTypes.nb(vm, setter, name, rc);
	
	// assert
	strictEqual(vm[name], parsed)
});