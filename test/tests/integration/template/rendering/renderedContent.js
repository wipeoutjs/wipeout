module("wipeout.template.rendering.renderedContent, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("un render", function() {
    // arrange
    
    var vms = [application, new wo.contentControl(), new wo.contentControl()];
    
    application.hello = vms[1];
    application.hello.helloAgain = vms[2];
    application.hello.helloAgain.template = 
"<wo.content-control id=\"cc1\">\
	</wo.content-control>\
		<div>Hi</div>\
	<wo.content-control id=\"cc2\">\
</wo.content-control>";
    application.hello.template = "<div wo-render='$this.helloAgain'></div>";
    
    application.template = "<div wo-render='$this.hello'></div>";
	
	application.onRendered = function () {
		vms.push(application.hello.helloAgain.templateItems.cc1);
		vms.push(application.hello.helloAgain.templateItems.cc2);

		// act
		wipeout.utils.obj.enumerateArr(vms, function(item) {
			ok(item.__woBag.domRoot);
		});
		
		application.__woBag.domRoot.unRender();

		// assert
		wipeout.utils.obj.enumerateArr(vms, function(item) {
			ok(!item.__woBag.domRoot);
		});
		
		start();
	};
	
	stop();
});

function disposeTest (act) {
    function disposeFunc() { this.isDisposed = true; this.constructor.prototype.dispose.call(this); };
    application.template = '<wo.view id="i0" />\
<div id="a" something something1=\'aaa\' something2=wer345>\
    <wo.content-control id="i1">\
        <template>\
            <div id="b">\
                <div id="c">\
                    <wo.view inner="true" id="i2" />\
                </div>\
            </div>\
        </template>\
    </wo.content-control>\
    <div id="d">\
        <div id="e">\
            <wo.items-control id="i3" items="[{},{}]">\
                <template>\
                    <div id="f">\
						{{$this.items}}\
                    </div>\
                </template>\
            </wo.items-control>\
        </div\>\
    </div\>\
</div>';
    
	application.onRendered  = function () {
		var i0, i1, i2, i3, i4, i5;
		ok(i0 = application.templateItems.i0);
		ok(i1 = application.templateItems.i1);
		ok(i2 = i1.templateItems.i2);
		ok(i3 = application.templateItems.i3);
		ok(i4 = i3.getItemViewModel(0));
		ok(i5 = i3.getItemViewModel(1));

		i0.dispose = disposeFunc;
		i1.dispose = disposeFunc;
		i2.dispose = disposeFunc;
		i3.dispose = disposeFunc;
		i4.dispose = disposeFunc;
		i5.dispose = disposeFunc;

		// act
		act();

		// assert
		setTimeout(function() {
			ok(i0.isDisposed);
			ok(i1.isDisposed);
			ok(i2.isDisposed);
			ok(i3.isDisposed);
			ok(i4.isDisposed);
			ok(i5.isDisposed);
			start();
		}, 150);
	};
	
	stop();
}

test("dispose", function() {
    disposeTest(function() { 
        application.__woBag.domRoot.dispose();
    });
});
/*
test("remove view model from dom", function() {
    disposeTest(function() {  
        wo.html(function() {
            $("#qunit-fixture").html("");
        });
    });  
});*/