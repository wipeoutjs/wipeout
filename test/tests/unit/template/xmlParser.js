module("wipeout.template.xmlParser", {
    setup: function() {
    },
    teardown: function() {
    }
});

var xmlParser = wipeout.template.xmlParser;
var xmlPart = wipeout.template.xmlPart;

testUtils.testWithUtils("distillElementName", null, true, function(methods, classes, subject, invoker) {
    
    // arrange    
    var name = "KJBKJB";
    
    // act    
    //assert
    strictEqual(invoker(name), name);
});

testUtils.testWithUtils("distillElementName", null, true, function(methods, classes, subject, invoker) {
    
    // arrange    
    var name = "KJBKJB";
    
    // act    
    //assert
    strictEqual(invoker(name + " "), name);
});

testUtils.testWithUtils("distillElementName", null, true, function(methods, classes, subject, invoker) {
    
    // arrange    
    var name = "KJBKJB";
    
    // act    
    //assert
    strictEqual(invoker(name + " sadasd"), name);
});

testUtils.testWithUtils("distillElementName", "invalid name", true, function(methods, classes, subject, invoker) {
    
    // arrange    
    var name = "KJB=KJB";
    
    // act    
    //assert
    strictEqual(invoker(name), null);
});

testUtils.testWithUtils("distillElementName", "no name", true, function(methods, classes, subject, invoker) {
    
    // arrange    
    var name = "";
    
    // act    
    //assert
    strictEqual(invoker(name), null);
});

testUtils.testWithUtils("distillAttributeName", null, true, function(methods, classes, subject, invoker) {
    
    // arrange    
    var name = "kajsdhajshd";
    
    // act    
    //assert
    strictEqual(invoker(" " + name + "="), name);
});

testUtils.testWithUtils("distillAttributeName", null, true, function(methods, classes, subject, invoker) {
    
    // arrange    
    var name = "kajsdhajshd";
    
    // act    
    //assert
    strictEqual(invoker("asdasdasd " + name + " = "), name);
});

testUtils.testWithUtils("distillAttributeName", "no equals", true, function(methods, classes, subject, invoker) {
    
    // arrange    
    var name = "kajsdhajshd";
    
    // act    
    //assert
    strictEqual(invoker(" " + name), null);
});

testUtils.testWithUtils("distillAttributeName", "no space before", true, function(methods, classes, subject, invoker) {
    
    // arrange    
    var name = "kajsdhajshd";
    
    // act    
    //assert
    strictEqual(invoker(name + "="), null);
});

testUtils.testWithUtils("findFirstInstance", "char 1", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var part1 = "LKJBLKJBLKJBLKJB", char1 = "!a!", part2 = "jljhlkjhljkhljhljh", char2 = "^6^", part3 = "IUOYUIOYOIUYOUIYOUIY";
    var input = part1 + char1 + part2 + char2 + part3;
    
    char1 = new xmlPart(char1);
    char2 = new xmlPart(char2);    
    
    // act
    var output = invoker(input, 0, [char1, char2]);
    
    //assert
    strictEqual(output.type, char1);
    strictEqual(output.index, part1.length);
});

testUtils.testWithUtils("findFirstInstance", "char 2", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var part1 = "LKJBLKJBLKJBLKJB", char1 = "!a!", part2 = "jljhlkjhljkhljhljh", char2 = "^6^", part3 = "IUOYUIOYOIUYOUIYOUIY";
    var input = part1 + char1 + part2 + char2 + part3;
    
    char1 = new xmlPart(char1);
    char2 = new xmlPart(char2);    
    
    // act
    var output = invoker(input, 0, [char2, char1]);
    
    //assert
    strictEqual(output.type, char1);
    strictEqual(output.index, part1.length);
});

testUtils.testWithUtils("findFirstInstance", "escaped char", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var part1 = "LKJBLKJBLKJBLKJB", escaped = "%--", char1 = "!a!", part2 = "jljhlkjhljkhljhljh", char2 = "^6^", part3 = "IUOYUIOYOIUYOUIYOUIY";
    var temp = part1 + escaped + char1 + part2;
    var input = temp + char2 + part3;
    
    char1 = new xmlPart(char1, escaped);
    char2 = new xmlPart(char2);    
    
    // act
    var output = invoker(input, 0, [char1, char2]);
    
    //assert
    strictEqual(output.type, char2);
    strictEqual(output.index, temp.length);
});

testUtils.testWithUtils("findFirstInstance", "double escaped char", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var part1 = "LKJBLKJBLKJBLKJB", escape = "-%-", char1 = "!a!", part2 = "jljhlkjhljkhljhljh", char2 = "^6^", part3 = "IUOYUIOYOIUYOUIYOUIY";
    var input = part1 + escape + escape + char1 + part2 + char2 + part3;
    
    char1 = new xmlPart(char1, escape);
    char2 = new xmlPart(char2);    
    
    // act
    var output = invoker(input, 0, [char1, char2]);
    
    //assert
    strictEqual(output.type, char1);
    strictEqual(output.index, part1.length + (escape.length * 2));
});

testUtils.testWithUtils("findFirstInstance", "escaped char then non escaped", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var part1 = "LKJBLKJBLKJBLKJB", escaped = "%--", char1 = "!a!", part2 = "jljhlkjhljkhljhljh", charX = "-a-", part3 = "IUOYUIOYOIUYOUIYOUIY";
    var temp = part1 + escaped + char1 + part2;
    var input = temp + char1 + part3 + charX;
    
    char1 = new xmlPart(char1, escaped);
    charX = new xmlPart(charX, escaped);
    
    // act
    // want to find char 2 first then go through the char 1 escape rigamarole
    var output = invoker(input, 0, [charX, char1]);
    
    //assert
    strictEqual(output.type, char1);
    strictEqual(output.index, temp.length);
});


testUtils.testWithUtils("preParse", null, true, function(methods, classes, subject, invoker) {
    // arrange   
    var test = [];
    
    // filler with both kinds of quotes
    var tmp = "aaa\"aaa'aaa";
    test.push(tmp);
    var input = tmp;
    
    // enclosed in comment
    tmp = 'bbb"bbb\'bbb';
    test.push(xmlParser.specialTags.openComment);
    test.push(tmp);
    test.push(xmlParser.specialTags.closeComment);
    input += "<!--" + tmp + "-->";
    
    // filler with both kinds of quotes
    tmp = "ccc\"ccc'ccc";
    test.push(tmp);
    input += tmp;
    
    // open xml with ignorable characters
    tmp = "ddd<ddd<!--ddd";
    test.push(xmlParser.specialTags.openTag1);
    test.push(tmp);
    input += "<" + tmp;
    
    // s quote with ignorable and escaped chars
    tmp = "eee<eee<!--eee\"eee\\'eee\\\\";
    test.push(xmlParser.specialTags.openSQuote);
    test.push(tmp);
    test.push(xmlParser.specialTags.closeSQuote);
    input += "'" + tmp + "'";
    
    // d quote with ignorable and escaped chars
    tmp = 'fff<fff<!--fff\'fff\\"fff\\\\';
    test.push(xmlParser.specialTags.openDQuote);
    test.push(tmp);
    test.push(xmlParser.specialTags.closeDQuote);
    input += '"' + tmp + '"';
    
    // close xml tag
    tmp = "ggg\"ggg'ggg";
    test.push(xmlParser.specialTags.closeTag1);
    test.push(tmp);
    input += '>' + tmp;
    
    // open close element
    tmp = "hhh\"hhh'hhh<!--hhh<hhh</hhh";
    test.push(xmlParser.specialTags.openTag2);
    test.push(tmp);
    input += '</' + tmp;
    
    // close close element
    tmp = "iii\"iii'iii";
    test.push(xmlParser.specialTags.closeTag1);
    test.push(tmp);
    input += '>' + tmp;
    
    // open and close element
    tmp = "jjj";
    test.push(xmlParser.specialTags.openTag1);
    test.push(tmp);
    test.push(xmlParser.specialTags.closeTag2);
    input += '<' + tmp + '/>';
    
    // filler with both kinds of quotes
    var tmp = "kkk\"kkk'kkk";
    test.push(tmp);
    input += tmp;
    
    // act
    var output = invoker(input);
    
    //assert
    deepEqual(output, test);
});