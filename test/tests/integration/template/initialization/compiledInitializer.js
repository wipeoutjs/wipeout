module("wipeout.template.initialization.compiledInitializer, integration", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("success", function() {
	// arrange
	var template = wipeout.wml.wmlParser('<object val0="$parent.theValue" val1="true" val2--s="true">\
	<val3 value="true" />\
	<val4 value--s="true" />\
	<val5>true</val5>\
	<val6 parser="s">true</val6>\
	<val7>\
		<js-object>\
			<val1 value="55" />\
			<val2 value="$parent.theValue" />\
		</js-object>\
	</val7>\
<object>')[0];
	
	var theValue = {}, theVm = {};
	var rc = new wipeout.template.context({theValue: theValue}).contextFor(theVm);
	
	// act
	new wipeout.template.initialization.compiledInitializer(template).initialize(theVm, rc);
	
	// assert
	strictEqual(theVm.val0, theValue);
	strictEqual(theVm.val1, true);
	strictEqual(theVm.val2, "true");
	strictEqual(theVm.val3, true);
	strictEqual(theVm.val4, "true");
	strictEqual(theVm.val5, true);
	strictEqual(theVm.val6, "true");
	
	strictEqual(theVm.val7.val1, 55);
	strictEqual(theVm.val7.val2, theValue);
});