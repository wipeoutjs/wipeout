module("wipeout.utils.obj", {
    setup: function() {
    },
    teardown: function() {
    }
});

var obj = wipeout.utils.obj;

testUtils.testWithUtils("enumerateArr", null, true, function(methods, classes, subject, invoker) {
    // arrange
    var subject = [];
    
    // act    
    invoker([1,2,3,4], function(i, j){this.push({val:i, name:j});}, subject);
    
    // assert    
    strictEqual(subject.length, 4);
    strictEqual(subject[0].name, 0);
    strictEqual(subject[0].val, 1);
    strictEqual(subject[1].name, 1);
    strictEqual(subject[1].val, 2);
    strictEqual(subject[2].name, 2);
    strictEqual(subject[2].val, 3);
    strictEqual(subject[3].name, 3);
    strictEqual(subject[3].val, 4);
});

testUtils.testWithUtils("enumerateObj", null, true, function(methods, classes, subject, invoker) {
    // arrange
    var subject = [];
    
    // act    
    invoker({"a":1,"b": 2,"c": 3,"d": 4}, function(i, j){this.push({val:i, name:j});}, subject);
    
    // assert    
    strictEqual(subject.length, 4);
    strictEqual(subject[0].name, "a");
    strictEqual(subject[0].val, 1);
    strictEqual(subject[1].name, "b");
    strictEqual(subject[1].val, 2);
    strictEqual(subject[2].name, "c");
    strictEqual(subject[2].val, 3);
    strictEqual(subject[3].name, "d");
    strictEqual(subject[3].val, 4);
});

testUtils.testWithUtils("trim", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var string = "JKHVJKHVJKHVH";
    
    // act    
    // assert
    strictEqual(invoker("   \n\r\t" + string + "   \n\r\t"), string);
});

testUtils.testWithUtils("trimToLower", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var string = "JKHVJKHVJKHVH";
    
    // act    
    // assert
    strictEqual(invoker("   \n\r\t" + string + "   \n\r\t"), string.toLowerCase());
});

testUtils.testWithUtils("camelCase", "", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act    
    // assert
    strictEqual(invoker("hello-one"), "helloOne");
    strictEqual(invoker("-hello-one"), "HelloOne");
    strictEqual(invoker("hello-one-"), "helloOne");
    strictEqual(invoker(null), null);
});

testUtils.testWithUtils("parseBool", "", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act    
    // assert    
    strictEqual(invoker("sdasd"), true);    
    strictEqual(invoker("true"), true);      
    strictEqual(invoker("0"), false);  
    strictEqual(invoker(0), false);      
    strictEqual(invoker(""), false);    
    strictEqual(invoker("FalSe"), false);    
});

testUtils.testWithUtils("getObject", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var ctxt = {a:{b:{c:{d:{}}}}};
    
    // act    
    // assert    
    strictEqual(invoker("a.b.c.d", ctxt), ctxt.a.b.c.d);
});

testUtils.testWithUtils("setObject", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var ctxt = {a:{b:{c:{d:{}}}}}, obj = {};
    
    // act
	invoker("a.b.c.d", ctxt, obj);
	
    // assert    
    strictEqual(obj, ctxt.a.b.c.d);
});

testUtils.testWithUtils("splitPropertyName", "", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act	
    // assert    
    deepEqual(invoker("a.b.c[3].t"), ["a", "b", "c", 3, "t"]);
});

testUtils.testWithUtils("joinPropertyName", "", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act	
    // assert    
    deepEqual(invoker(["a", "b", "c", 3, "t"]), "a.b.c[3].t");
});

testUtils.testWithUtils("copyArray", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var expected = [{}, {}, {}];
    
    // act    
    var actual = invoker(expected);
    
    // assert    
    strictEqual(actual.length, expected.length);
    for(var i = 0, ii = actual.length; i < ii; i++)
        strictEqual(actual[i], expected[i]);        
});

testUtils.testWithUtils("extend", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var obj1 = {};
    var obj2 = {aaa:{}};
    
    // act
    var out = invoker(obj1, obj2);
    
    // assert    
    strictEqual(out, obj1);
    strictEqual(out.aaa, obj2.aaa);
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
	var tokenNumber = /\d+/.exec(/##token\d*##/.exec(output.output)[0]);
	var doItMyself = tester.toString()
				.replace("/*something//\"'*/", "")
				.replace("// something \"'/*", "")
				.replace("/*and again //'\"*/", "")
				.replace("/*erterter*///asdasdasd", "")
				.replace('"kjsdbkls\\"djbfljkb///*"', "##token" + tokenNumber[0] + "##")
				.replace("'ddsssddkjsdbklsdjbfljkb///*'", "##token" + (parseInt(tokenNumber[0]) + 1) + "##");
	
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
    equal(output["##token" + tokenNumber[0] + "##"], '"kjsdbkls\\"djbfljkb///*"');
    equal(output["##token" + (parseInt(tokenNumber[0]) + 1) + "##"], "'ddsssddkjsdbklsdjbfljkb///*'");
});

testUtils.testWithUtils("removeCommentsTokenStringsAndBrackets", "", true, function(methods, classes, subject, invoker) {
	
    // arrange
	var b1 = "{{{hello 'something'}}}", b2 = "(((hello)))", b3 = "[[no no no[]]]";
    
    // act
    var output = invoker(b1 + b2 + b3);
	var tokenNumber = /\d+/.exec(/##token\d*##/.exec(output.output)[0]);
    
    // assert
    equal(output.output, "##token" + tokenNumber + "##" + "##token" + (parseInt(tokenNumber) + 1) + "##" + "##token" + (parseInt(tokenNumber) + 2) + "##");
});