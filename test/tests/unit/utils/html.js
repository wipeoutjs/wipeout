module("wipeout.utils.html", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "", false, function(methods, classes, subject, invoker) {
    // arrange
    classes.mock("wipeout.utils.htmlAsync", function(input) {
        input(methods.method());
    }, 1);
    
    // act
    invoker(methods.method());
    
    // assert
});

test("outerHTML", function() {
    // arrange    
    // act    
    //assert
    wo.obj.enumerateObj(wo.visual.reservedTags, function(tag) {
        if(tag === "html")
            throws(function() { wo.html.outerHTML(document.createElement(tag)); }, tag);
        else
            ok(wo.html.outerHTML(document.createElement(tag)), tag);        
    });    
});

testUtils.testWithUtils("getTagName", "", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act    
    // assert    
    throws(function() { invoker("SAHDAHSVD"); });
    strictEqual(invoker("<asuhdvjauhsvdjhv "), "asuhdvjauhsvdjhv");
    strictEqual(invoker("    <asuhdvjauhsvdjhv "), "asuhdvjauhsvdjhv");
});

testUtils.testWithUtils("getFirstTagName", "", true, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    // assert     
    strictEqual(invoker("SAHDAHSVD"), null);
    strictEqual(invoker("<asuhdvjauhsvdjhv "), "asuhdvjauhsvdjhv");
    strictEqual(invoker("    <asuhdvjauhsvdjhv "), "asuhdvjauhsvdjhv");
    strictEqual(invoker(" sadsad   <asuhdvjauhsvdjhv "), "asuhdvjauhsvdjhv");
});

testUtils.testWithUtils("getViewModel", "", true, function(methods, classes, subject, invoker) {
    // arrange
    var input = {}, output = {wipeoutOpening:{viewModel:{}}};
    classes.mock("wipeout.template.viewModelElement.getParentElement", function() {
        strictEqual(arguments[0], input);
        return output;
    });
    
    // act
    var vm = invoker(input);
    
    // assert
    strictEqual(vm, output.wipeoutOpening.viewModel);
});