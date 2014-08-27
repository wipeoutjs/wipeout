module("wipeout.template.xmlParser", {
    setup: function() {
    },
    teardown: function() {
    }
});

var xmlParser = wipeout.template.xmlParser;

testUtils.testWithUtils("closeComment", "ok", true, function(methods, classes, subject, invoker) {
    // arrange
    var start = "123", comment1 = "<!--", middle =  "lkajsfbdlksdjbf ;dsaonf;sdhfsdflksdjflkj ", comment2 = "-->", end = "546";
    var input = start + comment1 + middle + comment2 + end;
    var parts = [];
    
    // act
    var output = invoker(input, start.length, parts);
    
    //assert
    strictEqual(end, input.substr(output));
    strictEqual(parts[0].value, middle);
});

testUtils.testWithUtils("closeComment", "bad", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    throws(function() {
        invoker("<!-- asdasdkjabdkjabdkjbadkjbakjbd", 0, [])
    });
});

testUtils.testWithUtils("closeQuote", null, true, function(methods, classes, subject, invoker) {
    // arrange
    var start = "123", comment1 = "'", middle =  "lkajsfbdlk\\\\\\'sdjbf\\\\\\\\", comment2 = "'", end = "546";
    var input = start + comment1 + middle + comment2 + end;
    var parts = [];
    
    // act
    var output = invoker(xmlParser.blockTypes.sQuote, input, start.length, parts);
    
    //assert
    strictEqual(end, input.substr(output));
    strictEqual(parts[0].value, middle);
});

testUtils.testWithUtils("closeQuote", "bad", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    throws(function() {
        invoker(xmlParser.blockTypes.sQuote, "'asdasdkjabdkjabdkjbadkjbakjbd", 0, [])
    });
});

testUtils.testWithUtils("firstEscapeChar", "<!--", true, function(methods, classes, subject, invoker) {
    // arrange
    var e1 = "<!--", e2 = "'", e3 = "\"", e4 = "<";
    var start = "123", end = e2 + e3 + e4 + "546";
    var input = start + e1 + end;
    
    // act
    var output = invoker(input, 2, true);
    
    //assert
    strictEqual(output.type, xmlParser.blockTypes.comment);
    strictEqual(output.begin, start.length);
});

testUtils.testWithUtils("firstEscapeChar", "'", true, function(methods, classes, subject, invoker) {
    // arrange
    var e1 = "'", e2 = "<!--", e3 = "\"", e4 = "<";
    var start = "123", end = e2 + e3 + e4 + "546";
    var input = start + e1 + end;
    
    // act
    var output = invoker(input, 2, true);
    
    //assert
    strictEqual(output.type, xmlParser.blockTypes.sQuote);
    strictEqual(output.begin, start.length);
});

testUtils.testWithUtils("firstEscapeChar", "\"", true, function(methods, classes, subject, invoker) {
    // arrange
    var e1 = "\"", e2 = "'", e3 = "<!--", e4 = "<";
    var start = "123", end = e2 + e3 + e4 + "546";
    var input = start + e1 + end;
    
    // act
    var output = invoker(input, 2, true);
    
    //assert
    strictEqual(output.type, xmlParser.blockTypes.dQuote);
    strictEqual(output.begin, start.length);
});

testUtils.testWithUtils("firstEscapeChar", "<", true, function(methods, classes, subject, invoker) {
    // arrange
    var e1 = "<", e2 = "'", e3 = "<!--", e4 = "\"";
    var start = "123", end = e2 + e3 + e4 + "546";
    var input = start + e1 + end;
    
    // act
    var output = invoker(input, 2, true);
    
    //assert
    strictEqual(output.type, xmlParser.blockTypes.beginElementTag);
    strictEqual(output.begin, start.length);
});

testUtils.testWithUtils("firstEscapeChar", "none", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    //assert
    strictEqual(invoker("sdsapouihdoaishdashd;ashd;ashdlashd", 0, true), null);
});

testUtils.testWithUtils("_parseEscapedBlocks", null, true, function(methods, classes, subject, invoker) {
    // arrange   
    var test = [];
    
    var tmp = "KJBKJBKJB>KJLHO*YGKJ>B:O*Y>KJG";
    test.push({
        position: 0,
        type: xmlParser.blockTypes.incomplete,
        value: tmp
    });
    var input = tmp;
    
    tmp = ' dljflkjsdbfls"h\'lzhdisud;ab ';
    test.push({
        type: xmlParser.blockTypes.comment,
        value: tmp
    });
    input += "<!--" + tmp + "-->";
    
    tmp = "oashlashdashdlkshdlakhsd";
    test.push({
        position: input.length,
        type: xmlParser.blockTypes.incomplete,
        value: tmp
    });
    input += tmp;
    
    tmp = "djalskdjalskjdal\"asdasdasd\\'sadsada";
    test.push({
        type: xmlParser.blockTypes.sQuote,
        value: tmp
    });
    input += "'" + tmp + "'";
    
    tmp = 'djalskdjalskjdal\'asdasdasd\\"sadsada';
    test.push({
        type: xmlParser.blockTypes.sQuote,
        value: tmp
    });
    input += '"' + tmp + '"';
    
    tmp = "ihas980oihasdp0987ahd";
    test.push({
        position: input.length,
        type: xmlParser.blockTypes.incomplete,
        value: tmp
    });
    input += tmp;
    
    // act
    var output = invoker(input);
    
    //assert
    strictEqual(output.length, test.length);
    for(var i = 0, ii = output.length; i < ii; i++) {
        deepEqual(output[i], test[i]);
    }
});

testUtils.testWithUtils("_createAttributes", null, true, function(methods, classes, subject, invoker) {
    // arrange   
    var input = [{
        value: "<something blablabla = ",
        type: xmlParser.blockTypes.incomplete
    }, {
        type: xmlParser.blockTypes.sQuote
    }];
    
    // act
    invoker(input);
    
    //assert
    strictEqual(input[0].value, "<something");
    strictEqual(input[1].type, xmlParser.blockTypes.attribute);
    strictEqual(input[1].key, "blablabla");
});