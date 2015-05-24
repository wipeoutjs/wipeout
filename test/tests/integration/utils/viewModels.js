module("integration: wipeout.utils.viewModels", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("wo-el", function() {
    
    wo.viewModel("aNameSpace.aViewModel", wo.contentControl).build();

    // arrange
    var viewModel1 = '<div wo-el="aNameSpace.aViewModel" model="{xxx: 567}" id="thediv">\
    <div wo-el="setTemplate">\
        <div wo-el="span" wo-content="$model.xxx" id="thespan"></div>\
    </div>\
</div>', viewModel2 = '<div></div>' + viewModel1, viewModel2Id = "asdasdadsasd";

    wipeout.template.engine.instance.setTemplate(viewModel2Id, viewModel1);

    // act
    $("#qunit-fixture").html(viewModel1);
    var app = wo(null, document.getElementById("thediv"));

    // assert
    function assert () {
        strictEqual(app.createdViewModel.constructor, aNameSpace.aViewModel);
        strictEqual(document.getElementById("thespan").tagName, "SPAN");
        strictEqual(document.getElementById("thespan").innerHTML, "567");
    }

    assert();

    // act again
    app.createdViewModel.templateId = viewModel2Id;
    app.createdViewModel.onRendered = function () {
        // assert again
        assert();
        start();
        
        delete window.aNameSpace;
        setTimeout(function () {
            app.dispose();
        });
    };

    stop();
});