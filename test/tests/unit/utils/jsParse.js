module("wipeout.utils.jsParse", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("removeCommentsTokenStrings", "", true, function(methods, classes, subject, invoker) {
    // arrange
	function tester (arg1, /*something//"'*/arg2) {
		/*and again //'"*/
		
		/*erterter*///asdasdasd
		
		var ttt = "kjsdbkls\"djbfljkb///*";
		var yyy = 'ddsssddkjsdbklsdjbfljkb///*';
	}
    
    // act
    var output = invoker(tester);
	var tokenNumber = parseInt(/\d+/.exec(/##token\d*##/.exec(output.output)[0])[0]);
	var doItMyself = tester.toString()
				.replace("/*something//\"'*/", "")
				.replace("// something \"'/*", "")
				.replace("/*and again //'\"*/", "")
				.replace("/*erterter*///asdasdasd", "")
				.replace('"kjsdbkls\\"djbfljkb///*"', "##token" + tokenNumber + "##")
				.replace("'ddsssddkjsdbklsdjbfljkb///*'", "##token" + (tokenNumber + 1) + "##");
	
	for (var i = 0, ii = output.output.length; i < ii; i++)
		if (output.output[i] !== doItMyself[i]) {
			if (output.output[i] === "\r")
				output.output = output.output.substring(0, i) + output.output.substring(0, i + 1);
			else if (doItMyself[i] === "\r")
				doItMyself = doItMyself.substring(0, i) + doItMyself.substring(i + 1);
			else {
				ok(false, 'Invalid char: output.output[' + i + ']: "' + output.output[i] + '", doItMyself[' + i + ']: ' + doItMyself[i]);
				return;
			}
		}
    
    // assert
    equal(output.output, doItMyself);
    equal(output["##token" + tokenNumber + "##"], '"kjsdbkls\\"djbfljkb///*"');
    equal(output["##token" + (tokenNumber + 1) + "##"], "'ddsssddkjsdbklsdjbfljkb///*'");
});

testUtils.testWithUtils("removeCommentsTokenStringsAndBrackets", "", true, function(methods, classes, subject, invoker) {
	
    // arrange
	var b1 = "{{{hello 'something'}}}", b2 = "(((hello)))", b3 = "[[no no no[]]]";
    
    // act
    var output = invoker(b1 + b2 + b3);
	var tokenNumber = parseInt(/\d+/.exec(/##token\d*##/.exec(output.output)[0])[0]);
    
    // assert
    strictEqual(output.output, "##token" + tokenNumber + "##" + "##token" + (tokenNumber + 1) + "##" + "##token" + (tokenNumber + 2) + "##");
    strictEqual(output["##token" + tokenNumber + "##"], b1);
    strictEqual(output["##token" + (tokenNumber + 1) + "##"], b2);
    strictEqual(output["##token" + (tokenNumber + 2) + "##"], b3);
});