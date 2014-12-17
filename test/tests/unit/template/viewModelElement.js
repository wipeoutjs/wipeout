module("wipeout.template.viewModelElement", {
    setup: function() {
    },
    teardown: function() {
    }
});

var viewModelElement = wipeout.template.viewModelElement;

testUtils.testWithUtils("constructor", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "something", vm = {};
    
    // act
    var output = invoker("       " + name + "        ", vm);
    
    //assert
    strictEqual(output.nodeType, 8);
    strictEqual(output.nodeValue, " " + name + " ");
    strictEqual(output.closingTag.nodeType, 8);
    strictEqual(output.closingTag.nodeValue, " /" + name + " ");
    
    strictEqual(output.closingTag.wipeoutClosingTag, true);
    strictEqual(output.wipeoutOpeningTag, true);
    
    strictEqual(output.closingTag.openingTag, output);
    strictEqual(output.closingTag, output.closingTag);
    
    strictEqual(output.viewModel, vm);
});

testUtils.testWithUtils("setName", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
    var name = "something";
    subject = viewModelElement("LKJBLKJB");
    
    // act
    subject.setName(name);
    
    //assert
    strictEqual(subject.nodeValue, " " + name + " ");
    strictEqual(subject.closingTag.nodeValue, " /" + name + " ");
});


testUtils.testWithUtils("dispose", null, false, function(methods, classes, subject, invoker) {
    // arrange
    subject.closingTag = {};
    subject.parentElement = {
        removeChild: methods.method([subject.closingTag])
    };
    subject.viewModel = {
        dispose: methods.method()
    };
                                
    var item = viewModelElement("asd");
    
    // act
    item.dispose.apply(subject);
    
    //assert
    ok(!subject.viewModel);
});

testUtils.testWithUtils("init", "not lastTag", false, function(methods, classes, subject, invoker) {
    // arrange
    var nextSibling = {};
    subject.closingTag = {};
    subject.nextSibling = methods.method([], nextSibling);
    subject.parentElement = {
        insertBefore: methods.method([subject.closingTag, nextSibling])
    };
    subject.viewModel = {
        render: methods.method()
    };
                                
    var item = viewModelElement("asd");
    
    // act
    //assert
    item.init.apply(subject);    
});

testUtils.testWithUtils("init", "lastTag", false, function(methods, classes, subject, invoker) {
    /*
        var next = this.nextSibling();
        next ? this.parentElement.insertBefore(this.closingTag, next) : this.parentElement.appendChild(this.closingTag);
        
        this.viewModel.render();*/
    // arrange
    subject.closingTag = {};
    subject.nextSibling = methods.method([]);
    subject.parentElement = {
        appendChild: methods.method([subject.closingTag])
    };
    subject.viewModel = {
        render: methods.method()
    };
                                
    var item = viewModelElement("asd");
    
    // act
    //assert
    item.init.apply(subject);    
});
