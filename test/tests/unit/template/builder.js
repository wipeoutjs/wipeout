module("wipeout.template.builder", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
	// arange
	var part1 = "sadsadasdasd", part2 = "KHIUBKJBKJLV", regex = new RegExp("^" + part1 + ' id="wipeout_placeholder_id_(\\d+)"' + part2 + "$");
	var input = {
		html: [part1, {}, part2]
	};
	
	// act
	invoker(input);
	
	// assert
	ok(regex.test(subject.html));
	strictEqual(subject.elements.length, 1);
	strictEqual(subject.elements[0].actions, input.html[1]);
	ok(/^wipeout_placeholder_id_(\d+)$/.test(subject.elements[0].id));
});

testUtils.testWithUtils("execute", null, false, function(methods, classes, subject, invoker) {
	// arange
	var id = "asdasd", rc = {}, val = {};
	$("#qunit-fixture").html('<div id="' + id + '"></div>');
	subject.elements = [{
		id: id,
		actions: [{
			value: val,
			action: methods.method([val, $("#" + id)[0], rc], methods.method())
		}]
	}];
	
	// act
	// assert
	invoker(rc)();
});