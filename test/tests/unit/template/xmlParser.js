module("wipeout.template.xmlParser", {
    setup: function() {
    },
    teardown: function() {
    }
});

var xmlParser = wipeout.template.xmlParser;
var xmlPart = wipeout.template.xmlPart;

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
    
    var input = "";
    
    // filler with both kinds of quotes
    var tmp = "aaa\"aaa'aaa";
    test.push(tmp);
    input += tmp;
    
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
    
    // space
    tmp = " \t\r\n ";
    test.push(xmlParser.specialTags.whiteSpace);
    input += tmp;
    
    // d quote with ignorable and escaped chars
    tmp = 'fff<fff<!--fff\'fff\\"fff\\\\';
    test.push(xmlParser.specialTags.openDQuote);
    test.push(tmp);
    test.push(xmlParser.specialTags.closeDQuote);
    input += '"' + tmp + '"';
    
    // close xml tag with space before >
    tmp = "ggg\"ggg'ggg";
    test.push(xmlParser.specialTags.whiteSpace);
    test.push(xmlParser.specialTags.closeTag1);
    test.push(tmp);
    input += ' >' + tmp;
    
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

/*
    Key:
    n: name
    e: equals
    s: white space
    q: quotation mark
    v: value
    
    createAttribute tests arbitrarily use " or '
 */

testUtils.testWithUtils("_createAttribute", "ne q v q", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh", value = "uiglghjkgkhjgk";
    var input = [name + "=", xmlParser.specialTags.openSQuote, value, xmlParser.specialTags.closeSQuote];
    
    // act
    var output = invoker(input, 0);
    
    //assert
    strictEqual(output.name, name);
    strictEqual(output.index, input.length);
    strictEqual(output.value.value, value);
    strictEqual(output.value.surrounding, "'");
});

testUtils.testWithUtils("_createAttribute", "ne s q v q", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh", value = "uiglghjkgkhjgk";
    var input = [name + "=", xmlParser.specialTags.whiteSpace, xmlParser.specialTags.openSQuote, value, xmlParser.specialTags.closeSQuote];
    
    // act
    var output = invoker(input, 0);
    
    //assert
    strictEqual(output.name, name);
    strictEqual(output.index, input.length);
    strictEqual(output.value.value, value);
    strictEqual(output.value.surrounding, "'");
});

testUtils.testWithUtils("_createAttribute", "n s e q v q", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh", value = "uiglghjkgkhjgk";
    var input = [name, xmlParser.specialTags.whiteSpace, "=", xmlParser.specialTags.openDQuote, value, xmlParser.specialTags.closeDQuote];
    
    // act
    var output = invoker(input, 0);
    
    //assert
    strictEqual(output.name, name);
    strictEqual(output.index, input.length);
    strictEqual(output.value.value, value);
    strictEqual(output.value.surrounding, '"');
});

testUtils.testWithUtils("_createAttribute", "n s e s q v q", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh", value = "uiglghjkgkhjgk";
    var input = [name, xmlParser.specialTags.whiteSpace, "=", xmlParser.specialTags.whiteSpace, xmlParser.specialTags.openDQuote, value, xmlParser.specialTags.closeDQuote];
    
    // act
    var output = invoker(input, 0);
    
    //assert
    strictEqual(output.name, name);
    strictEqual(output.index, input.length);
    strictEqual(output.value.value, value);
    strictEqual(output.value.surrounding, '"');
});

testUtils.testWithUtils("constructor", "integration test", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var commentText = " hello <!-- &hello& 'hello' ",
        attrText = "a &a& a *%a*% a ***%a***% a <a> a <!-- a --> **",
        sAttrText = attrText.replace(/\%/g, "'").replace(/\&/g, '"').replace(/\*/g, "\\"),
        dAttrText = attrText.replace(/\%/g, '"').replace(/\&/g, "'").replace(/\*/g, "\\"),
        sAttrName = "lkjlhjv",
        sAttr = sAttrName + "='" + sAttrText + "'",
        dAttrName = "gfhgfhgfhfg",
        dAttr = dAttrName + ' = "' + dAttrText + '"',
        text = "d 'd' \"d\" > d "
        tagName1 = "aa", tagName2 = "BB", tagName3 = "c-c", tagName4 = "dd1", tagName5 = "ee1";
    
    var val = "<" + tagName1 + ">\
    <!--" + commentText + "-->\
    b &b& b 'b' b opening quote: &\
    < " + tagName2 + " " + sAttr + " " + dAttr + " >\
        Closing quote: &\
        <" + tagName3 + "\t\n\r " + sAttr + " " + dAttr + ">" + text + "</" + tagName3 + ">\
        <" + tagName4 + "/>\
        < " + tagName5 + "   />\
    </ " + tagName2 + " ></" + tagName1 + ">".replace(/\*/g, "\\").replace(/&/g, "\"");
    
    // act
    var output = xmlParser(val);
    
    strictEqual(output[0].name, tagName1);
    
    strictEqual(output[0][0].constructor, String);
    
    strictEqual(output[0][1].constructor, wipeout.template.xmlComment);
    strictEqual(output[0][1].commentText, commentText);
    
    strictEqual(output[0][2].constructor, String);
    
    strictEqual(output[0][3].constructor, wipeout.template.xmlElement);
    strictEqual(output[0][3].name, tagName2);
    
    strictEqual(output[0][3].attributes[sAttrName].constructor, wipeout.template.xmlAttribute);
    strictEqual(output[0][3].attributes[sAttrName].surrounding, "'");
    strictEqual(output[0][3].attributes[sAttrName].value, sAttrText);
    
    strictEqual(output[0][3].attributes[dAttrName].constructor, wipeout.template.xmlAttribute);
    strictEqual(output[0][3].attributes[dAttrName].surrounding, '"');
    strictEqual(output[0][3].attributes[dAttrName].value, dAttrText);
    
    strictEqual(output[0][3][0].constructor, String);
    
    strictEqual(output[0][3][1].constructor, wipeout.template.xmlElement);
    strictEqual(output[0][3][1].name, tagName3);
    
    strictEqual(output[0][3][1].attributes[sAttrName].constructor, wipeout.template.xmlAttribute);
    strictEqual(output[0][3][1].attributes[sAttrName].surrounding, "'");
    strictEqual(output[0][3][1].attributes[sAttrName].value, sAttrText);
    
    strictEqual(output[0][3][1].attributes[dAttrName].constructor, wipeout.template.xmlAttribute);
    strictEqual(output[0][3][1].attributes[dAttrName].surrounding, '"');
    strictEqual(output[0][3][1].attributes[dAttrName].value, dAttrText);
    
    strictEqual(output[0][3][1][0], text);
    
    strictEqual(output[0][3][2].constructor, String);
    
    strictEqual(output[0][3][3].constructor, wipeout.template.xmlElement);
    strictEqual(output[0][3][3].name, tagName4);
    
    strictEqual(output[0][3][4].constructor, String);
    
    strictEqual(output[0][3][5].constructor, wipeout.template.xmlElement);
    strictEqual(output[0][3][5].name, tagName5);
    
    strictEqual(output[0][3][6].constructor, String);
});



















