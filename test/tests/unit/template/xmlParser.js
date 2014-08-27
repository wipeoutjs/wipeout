module("wipeout.template.xmlParser", {
    setup: function() {
    },
    teardown: function() {
    }
});

var xmlParser = wipeout.template.xmlParser;

testUtils.testWithUtils("_parseEscapedBlocks", null, true, function(methods, classes, subject, invoker) {
    // arrange   
    var test = [];
    
    var tmp = "KJBKJBKJBKJLHO*YGKJB:O*YKJG";
    test.push({
        position: 0,
        type: xmlParser.preCompileTags.incomplete,
        value: tmp
    });
    var input = tmp;
    
    tmp = ' dljflkjsdbfls"h\'lzhdisud;ab ';
    test.push({
        type: xmlParser.preCompileTags.comment,
        value: tmp
    });
    input += "<!--" + tmp + "-->";
    debugger;
    /*tmp = "oashlashdashdlkshdlakhsd";
    test.push({
        position: input.length,
        type: xmlParser.blockTypes.incomplete,
        value: tmp
    });
    input += tmp;
    
    /*tmp = "djalskdjalskjdal\"asdasdasd\\'sadsada";
    test.push({
        type: xmlParser.blockTypes.sQuote,
        value: tmp
    });
    input += "'" + tmp + "'";
    
    /*tmp = 'djalskdjalskjdal\'asdasdasd\\"sadsada';
    test.push({
        type: xmlParser.blockTypes.sQuote,
        value: tmp
    });
    input += '"' + tmp + '"';
    
    /*tmp = "ihas980oihasdp0987ahd";
    test.push({
        position: input.length,
        type: xmlParser.blockTypes.incomplete,
        value: tmp
    });
    input += tmp;*/
    
    // act
    var output = invoker(input);
    
    //assert
    strictEqual(output.length, test.length);
    for(var i = 0, ii = output.length; i < ii; i++) {
        deepEqual(output[i], test[i]);
    }
});

testUtils.testWithUtils("closeItem", "unescaped", true, function(methods, classes, subject, invoker) {
    // arrange
    var toConfuse = "asdasd", start = "asdasda" + toConfuse + "HOI:H:BJ", open = toConfuse + "!", middle = "G*OG" + toConfuse, close = toConfuse + "!", end = "BKHG";
    var input = start + open + middle + close + end;
    var parts = [];
    
    // act
    var output = invoker(input, {close: close, open: open}, start.length, parts);
    
    //assert
    strictEqual(end, input.substr(output));
    strictEqual(parts[0].value, middle);
});

testUtils.testWithUtils("closeItem", "escaped, no '\\'", true, function(methods, classes, subject, invoker) {
    // arrange
    var toConfuse = "asdasd", start = "asdasda" + toConfuse + "HOI:H:BJ", open = toConfuse + "!", middle = "G*OG" + toConfuse, close = toConfuse + "!", end = "BKHG";
    var input = start + open + middle + close + end;
    var parts = [];
    
    // act
    var output = invoker(input, {close: close, open: open, escaped: true}, start.length, parts);
    
    //assert
    strictEqual(end, input.substr(output));
    strictEqual(parts[0].value, middle);
});

testUtils.testWithUtils("closeItem", "escaped, with '\\'", true, function(methods, classes, subject, invoker) {
    // arrange
    var toConfuse = "asdasd", start = "asdasda" + toConfuse + "HOI:H:BJ", close = toConfuse + "!", open = toConfuse + "!", middle = "G*OG\\" + close + "sasa", end = "BKHG";
    var input = start + open + middle + close + end;
    var parts = [];
    
    // act
    var output = invoker(input, {close: close, open: open, escaped: true}, start.length, parts);
    
    //assert
    strictEqual(end, input.substr(output));
    strictEqual(parts[0].value, middle);
});

testUtils.testWithUtils("closeItem", "bad", true, function(methods, classes, subject, invoker) {
    // arrange
    // act
    //assert
    throws(function() {
        invoker("sadsadasdasdasd", {close: "!", open: "s"}, 0, []);
    });
});

testUtils.testWithUtils("firstEscapeChar", "char 1", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var escapeChar = { open: "!" };
    var part1 = "KJLBLKJBLKJB", part2 = "LHJBLIOG<H>JGBI";
    var input = part1 + escapeChar.open + part2;
    
    // act
    var output = invoker(input, 2, [escapeChar]);
    
    //assert
    strictEqual(output.type, escapeChar);
    strictEqual(output.begin, part1.length);
});

testUtils.testWithUtils("firstEscapeChar", "char 2", true, function(methods, classes, subject, invoker) {
    // arrange
    var common = "LKJBLKJB";
    var escapeChar = { open: common + "!" };
    var part1 = "KJLBLKJBLKJB" + common, part2 = "LHJBLIOG<H>JGBI";
    var input = part1 + escapeChar.open + part2;
    
    // act
    var output = invoker(input, 2, [{open: "$"}, escapeChar]);
    
    //assert
    strictEqual(output.type, escapeChar);
    strictEqual(output.begin, part1.length);
});

testUtils.testWithUtils("_createAttributes", null, true, function(methods, classes, subject, invoker) {
    // arrange   
    var input = [{
        value: "<something blablabla = ",
        type: xmlParser.preCompileTags.incomplete
    }, {
        type: xmlParser.preCompileTags.sQuote
    }];
    
    // act
    invoker(input);
    
    //assert
    strictEqual(input[0].value, "<something");
    strictEqual(input[1].type, xmlParser.preCompileTags.attribute);
    strictEqual(input[1].key, "blablabla");
});