module("wipeout.template.templateParser", {
    setup: function() {
    },
    teardown: function() {
    }
});

var templateParser = wipeout.template.templateParser;
var templatePart = wipeout.template.templatePart;

testUtils.testWithUtils("findFirstInstance", "char 1", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var part1 = "LKJBLKJBLKJBLKJB", char1 = "!a!", part2 = "jljhlkjhljkhljhljh", char2 = "^6^", part3 = "IUOYUIOYOIUYOUIYOUIY";
    var input = part1 + char1 + part2 + char2 + part3;
    
    char1 = new templatePart(char1);
    char2 = new templatePart(char2);    
    
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
    
    char1 = new templatePart(char1);
    char2 = new templatePart(char2);    
    
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
    
    char1 = new templatePart(char1, escaped);
    char2 = new templatePart(char2);    
    
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
    
    char1 = new templatePart(char1, escape);
    char2 = new templatePart(char2);    
    
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
    
    char1 = new templatePart(char1, escaped);
    charX = new templatePart(charX, escaped);
    
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
    test.push(templateParser.specialTags.openComment);
    test.push(tmp);
    test.push(templateParser.specialTags.closeComment);
    input += "<!--" + tmp + "-->";
    
    // filler with both kinds of quotes
    tmp = "ccc\"ccc'ccc";
    test.push(tmp);
    input += tmp;
    
    // open xml tag with ignorable characters
    tmp = "ddd<ddd<!--ddd";
    test.push(templateParser.specialTags.openTag1);
    test.push(tmp);
    input += "<" + tmp;
    
    // s quote with ignorable and escaped chars
    tmp = "eee<eee<!--eee\"eee\\'eee\\\\";
    test.push(templateParser.specialTags.openSQuote);
    test.push(tmp);
    test.push(templateParser.specialTags.closeSQuote);
    input += "'" + tmp + "'";
    
    // equals
    test.push(templateParser.specialTags.equals);
    input += "      =     ";
    
    // d quote with ignorable and escaped chars
    tmp = 'fff<fff<!--fff\'fff\\"fff\\\\';
    test.push(templateParser.specialTags.openDQuote);
    test.push(tmp);
    test.push(templateParser.specialTags.closeDQuote);
    input += '"' + tmp + '"';
    
    // space
    tmp = " \t\r\n ";
    test.push(templateParser.specialTags.whiteSpace);
    input += tmp;
    
    // close xml tag with space before >
    tmp = "ggg\"ggg'ggg";
    test.push(templateParser.specialTags.closeTag1);
    test.push(tmp);
    input += ' >' + tmp;
    
    // open close element
    tmp = "hhh\"hhh'hhh<!--hhh<hhh</hhh";
    test.push(templateParser.specialTags.openTag2);
    test.push(tmp);
    input += '</' + tmp;
    
    // close close element
    tmp = "iii\"iii'iii";
    test.push(templateParser.specialTags.closeTag1);
    test.push(tmp);
    input += '>' + tmp;
    
    // open and close element
    tmp = "jjj";
    test.push(templateParser.specialTags.openTag1);
    test.push(tmp);
    test.push(templateParser.specialTags.closeTag2);
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

testUtils.testWithUtils("_createAttribute", "no val, empty space next", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh";
    var input = [name, templateParser.specialTags.whiteSpace];
    
    // act
    var output = invoker(input, 0);
    
    //assert
    strictEqual(output.name, name);
    strictEqual(output.index, input.length - 1);
    strictEqual(output.value.value, null);
    strictEqual(output.value.surrounding, null);
});

testUtils.testWithUtils("_createAttribute", "no val, close tag 1 next", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh";
    var input = [name, templateParser.specialTags.closeTag1];
    
    // act
    var output = invoker(input, 0);
    
    //assert
    strictEqual(output.name, name);
    strictEqual(output.index, input.length - 1);
    strictEqual(output.value.value, null);
    strictEqual(output.value.surrounding, null);
});

testUtils.testWithUtils("_createAttribute", "no val, close tag 2 next", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh";
    var input = [name, templateParser.specialTags.closeTag2];
    
    // act
    var output = invoker(input, 0);
    
    //assert
    strictEqual(output.name, name);
    strictEqual(output.index, input.length - 1);
    strictEqual(output.value.value, null);
    strictEqual(output.value.surrounding, null);
});

testUtils.testWithUtils("_createAttribute", "no quotes", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh", value = "asdsdgsd";
    var input = [name, templateParser.specialTags.equals, value];
    
    // act
    var output = invoker(input, 0);
    
    //assert
    strictEqual(output.name, name);
    strictEqual(output.index, input.length);
    strictEqual(output.value.value, value);
    strictEqual(output.value.surrounding, null);
});

testUtils.testWithUtils("_createAttribute", "single quotes", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh", value = "asdsdgsd";
    var input = [name, templateParser.specialTags.equals, templateParser.specialTags.openSQuote, value, templateParser.specialTags.closeSQuote];
    
    // act
    var output = invoker(input, 0);
    
    //assert
    strictEqual(output.name, name);
    strictEqual(output.index, input.length);
    strictEqual(output.value.value, value);
    strictEqual(output.value.surrounding, "'");
});

testUtils.testWithUtils("_createAttribute", "double quotes", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh", value = "asdsdgsd";
    var input = [name, templateParser.specialTags.equals, templateParser.specialTags.openDQuote, value, templateParser.specialTags.closeDQuote];
    
    // act
    var output = invoker(input, 0);
    
    //assert
    strictEqual(output.name, name);
    strictEqual(output.index, input.length);
    strictEqual(output.value.value, value);
    strictEqual(output.value.surrounding, '"');
});

testUtils.testWithUtils("_createAttribute", "double empty", true, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "LKjhblkjhlkjh", value = "";
    var input = [name, templateParser.specialTags.equals, templateParser.specialTags.openDQuote, value, templateParser.specialTags.closeDQuote];
    
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
        quotelessValAttrText = "sadadrthgj",
        emptyAttrName = "lknlk",
        noEqualsAttrName = "34azx3",
        quotelessValAttrName = "34a3",
        sAttrName = "lkjlhjv",
        sAttr = sAttrName + "='" + sAttrText + "'",
        dAttrName = "gfhgfhgfhfg",
        dAttr = dAttrName + ' = "' + dAttrText + '"',
        text = "d 'd' \"d\" > d "
        tagName1 = "aa", tagName2 = "BB", tagName3 = "c-c", tagName4 = "dd1", tagName5 = "ee1";
    
    var val = "<" + tagName1 + ">\
    <!--" + commentText + "-->\
    b &b& b 'b' b opening quote: &\
    < " + tagName2 + " " + sAttr + " " + dAttr + " " + emptyAttrName + "='' " + noEqualsAttrName + " " + quotelessValAttrName + "=" + quotelessValAttrText + " >\
        Closing quote: &\
        <" + tagName3 + ">" + text + "</" + tagName3 + ">\
        <" + tagName4 + "/>\
        < " + tagName5 + "   />\
    </ " + tagName2 + " ></" + tagName1 + ">".replace(/\*/g, "\\").replace(/&/g, "\"");
    
    // act
    var output = templateParser(val);
    
    strictEqual(output[0].name, tagName1);
    
    strictEqual(output[0][0].constructor, wipeout.template.wmlString);
    
    strictEqual(output[0][1].constructor, wipeout.template.wmlComment);
    strictEqual(output[0][1].commentText, commentText);
    
    strictEqual(output[0][2].constructor, wipeout.template.wmlString);
    
    strictEqual(output[0][3].constructor, wipeout.template.wmlElement);
    strictEqual(output[0][3].name, tagName2);
    
    strictEqual(output[0][3].attributes[sAttrName].constructor, wipeout.template.wmlAttribute);
    strictEqual(output[0][3].attributes[sAttrName].surrounding, "'");
    strictEqual(output[0][3].attributes[sAttrName].value, sAttrText);
    
    strictEqual(output[0][3].attributes[dAttrName].constructor, wipeout.template.wmlAttribute);
    strictEqual(output[0][3].attributes[dAttrName].surrounding, '"');
    strictEqual(output[0][3].attributes[dAttrName].value, dAttrText);
    
    strictEqual(output[0][3].attributes[emptyAttrName].constructor, wipeout.template.wmlAttribute);
    strictEqual(output[0][3].attributes[emptyAttrName].surrounding, "'");
    strictEqual(output[0][3].attributes[emptyAttrName].value, "");
    
    strictEqual(output[0][3].attributes[noEqualsAttrName].constructor, wipeout.template.wmlAttribute);
    strictEqual(output[0][3].attributes[noEqualsAttrName].surrounding, null);
    strictEqual(output[0][3].attributes[noEqualsAttrName].value, null);
    
    strictEqual(output[0][3].attributes[quotelessValAttrName].constructor, wipeout.template.wmlAttribute);
    strictEqual(output[0][3].attributes[quotelessValAttrName].surrounding, null);
    strictEqual(output[0][3].attributes[quotelessValAttrName].value, quotelessValAttrText);
    
    strictEqual(output[0][3][0].constructor, wipeout.template.wmlString);
    
    strictEqual(output[0][3][1].constructor, wipeout.template.wmlElement);
    strictEqual(output[0][3][1].name, tagName3);
    
    strictEqual(output[0][3][1][0].constructor, wipeout.template.wmlString);
    strictEqual(output[0][3][1][0].text, text);
    
    strictEqual(output[0][3][2].constructor, wipeout.template.wmlString);
    
    strictEqual(output[0][3][3].constructor, wipeout.template.wmlElement);
    strictEqual(output[0][3][3].name, tagName4);
    
    strictEqual(output[0][3][4].constructor, wipeout.template.wmlString);
    
    strictEqual(output[0][3][5].constructor, wipeout.template.wmlElement);
    strictEqual(output[0][3][5].name, tagName5);
    
    strictEqual(output[0][3][6].constructor, wipeout.template.wmlString);
});

testUtils.testWithUtils("speed test", null, true, function(methods, classes, subject, invoker) {
        
    var factor = 200;
    
    // arrange
    var attrText = "bla bla bla",
        sAttrText = attrText.replace(/\%/g, "'").replace(/\&/g, '"').replace(/\*/g, "\\"),
        dAttrText = attrText.replace(/\%/g, '"').replace(/\&/g, "'").replace(/\*/g, "\\"),
        sAttr = "lkjlhjv='" + sAttrText + "'",
        dAttr = 'dAttrName = "' + dAttrText + '"';
    
    var innerEl = "";
    for(var i = 0; i < factor; i++)
        innerEl+= "<something>";
    for(var i = 0; i < factor; i++)
        innerEl+= "</something>";
    
    var val = ("<aa>\
    <!-- hello &hello& 'hello' -->\
    b &b& b 'b' b opening quote: &\
    <BB " + sAttr + " " + dAttr + " lknlk='' >\
        Closing quote: &\
        <cc>d 'd' \"d\" > d </cc>\
        <dd/>\
        <ee   />" +
        innerEl +
    "</BB></aa>").replace(/\*/g, "\\").replace(/&/g, "\"");
    
    var input = "";
    for(var i = 0; i < factor; i++)
        input+= val;
    
    var begin = new Date();
    
    // act
    var output = templateParser(input);
    var time1 = new Date() - begin;
    
    begin = new Date();
    new DOMParser().parseFromString("<root>" + input + "</root>", "application/xml");
    var time2 = new Date() - begin;
        
    ok(true, "templateParser: " + time1 + ", DOMParser: " + time2);
});