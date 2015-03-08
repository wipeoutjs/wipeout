module("wipeout.utils.html", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("outerHTML", function() {
    
    // list of html tags which will not be treated as objects
    var tags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "head", "header", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "map", "mark", "menu", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];
    
	// arrange    
    // act    
    //assert
    wipeout.utils.obj.enumerateObj(tags, function(tag) {
        if(tag === "html")
            throws(function() { wipeout.utils.html.outerHTML(document.createElement(tag)); }, tag);
        else
            ok(wipeout.utils.html.outerHTML(document.createElement(tag)), tag);        
    });    
});

testUtils.testWithUtils("getViewModel", "", true, function(methods, classes, subject, invoker) {
    // arrange
	var rc = {viewModel: {}};
    
    // act
	// assert
	strictEqual(invoker(null), null);
	strictEqual(invoker({wipeoutOpening: rc}), rc.viewModel);
	strictEqual(invoker({wipeoutClosing: rc}), rc.viewModel);
	strictEqual(invoker({parentElement: {wipeoutClosing: rc}}), rc.viewModel);
});