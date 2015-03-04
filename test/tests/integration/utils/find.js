module("wipeout.utils.find, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

var find = wipeout.utils.find;

test("wipeout.utils.find", function() {
	
    // arrange
    application.template = '<wo.content-control id="me1">\
    <template>\
        <wo.content-control id="me2">\
            <template>\
                <wo.content-control id="me3"\
                    parent="$find(\'parent\')" grandParent="$find({$a:\'grandParent\'})" greatGrandParent="$find({$a:\'greatGrandParent\'})"\
                    cc0="$find(wo.contentControl)" cc1="$find({$t:wo.contentControl, $number: 1})"\
                    v0="$find({$i:wo.view})" v1="$find({$instanceof:wo.view, $number: 1})"\
                    f0="$find({id: \'me1\'})" fY="$find({id: \'me1\'}, {$n:1})" fX="$find({id: \'me3\'})">\
                </wo.content-control>\
            </template>\
        </wo.content-control>\
    </template>\
</wo.content-control>';
	
	application.onRendered = function () {
    
		var me = application.templateItems.me1.templateItems.me2.templateItems.me3;
		ok(me);
		
		// act    
		// assert
		strictEqual(me.parent, application.templateItems.me1.templateItems.me2);
		strictEqual(me.grandParent, application.templateItems.me1);
		strictEqual(me.greatGrandParent, application);

		strictEqual(me.cc0, application.templateItems.me1.templateItems.me2);
		strictEqual(me.cc1, application.templateItems.me1);

		strictEqual(me.v0, application.templateItems.me1.templateItems.me2);
		strictEqual(me.v1, application.templateItems.me1);

		strictEqual(me.f0, application.templateItems.me1);
		strictEqual(me.fX, null);
		strictEqual(me.fY, null);
		
		start();
	};
	
	stop();
});

testUtils.testWithUtils("find", "index only", false, function(methods, classes, subject, invoker) {
    
    // arrange
    var bc = {
        $this: {},
        $parentContext: {
            $this: {},
            $parentContext: {
                $this: {},
                $parentContext: {
                    $this: {}
                }
            }
        }
    };
    
    subject = new find(bc);
    
    // act        
    // assert
    strictEqual(subject.find(null, {$number: 1}), bc.$parentContext.$parentContext.$this);
    strictEqual(subject.find(null, {$number: 2}), bc.$parentContext.$parentContext.$parentContext.$this);
});

testUtils.testWithUtils("find", "index and ancestor", false, function(methods, classes, subject, invoker) {
    
    // arrange
    var bc = {
        $this: {},
        $parentContext: {
            $this: {},
            $parentContext: {
                $this: {}
            }
        }
    };
    
    subject = new find(bc);
    
    // act
    var output = subject.find("parent", {$number: 1});
        
    // assert
    strictEqual(output, bc.$parentContext.$parentContext.$this);
});

testUtils.testWithUtils("find", "ancestors", false, function(methods, classes, subject, invoker) {
    
    // arrange
    var bc = {
        $this: {},
        $parentContext: {        
            $this: {},
            $parentContext: {        
                $this: {},
                $parentContext: {
                    $this: {},
                    $parentContext: {
                        $this: {}
                    }
                }
            }
        }
    };
    
    subject = new find(bc);
    
    // act        
    // assert
    strictEqual(subject.find("Parent"), bc.$parentContext.$this);
    strictEqual(subject.find("grandParent"), bc.$parentContext.$parentContext.$this);
    strictEqual(subject.find("greatgrandParent"), bc.$parentContext.$parentContext.$parentContext.$this);
    strictEqual(subject.find("greatgreatgrandParent"), bc.$parentContext.$parentContext.$parentContext.$parentContext.$this);
    strictEqual(subject.find("greatParent"), null);
});

testUtils.testWithUtils("find", "constructor and index", false, function(methods, classes, subject, invoker) {
    function x(){}
    
    // arrange
    var bc = {
        $this: {},
        $parentContext: {        
            $this: {},
            $parentContext: {        
                $this: new x(),
                $parentContext: {
                    $this: {},
                    $parentContext: {
                        $this: new x()
                    }
                }
            }
        }
    };
    
    subject = new find(bc);
    
    // act        
    // assert
    strictEqual(subject.find(x), bc.$parentContext.$parentContext.$this);
    strictEqual(subject.find(x, {$number: 1}), bc.$parentContext.$parentContext.$parentContext.$parentContext.$this);
    strictEqual(subject.find(x, {$number: 2}), null);
});


testUtils.testWithUtils("find", "instanceof and index", false, function(methods, classes, subject, invoker) {
    classes.mock("tests.a.s.d.f.g", function(){this.hello = "sadasds"});
    
    // arrange
    var bc = {
        $this: {},
        $parentContext: {        
            $this: {},
            $parentContext: {        
                $this: new tests.a.s.d.f.g(),
                $parentContext: {
                    $this: {},
                    $parentContext: {
                        $this: new tests.a.s.d.f.g()
                    }
                }
            }
        }
    };
    
    subject = new find(bc);
    
    // act        
    // assert
    strictEqual(subject.find({$instanceOf:tests.a.s.d.f.g}), bc.$parentContext.$parentContext.$this);
    strictEqual(subject.find({$i: tests.a.s.d.f.g, $number: 1}), bc.$parentContext.$parentContext.$parentContext.$parentContext.$this);
    strictEqual(subject.find({$i: tests.a.s.d.f.g, $number: 2}), null);
    delete window.tests;
});



testUtils.testWithUtils("find", "instanceof and model", false, function(methods, classes, subject, invoker) {
    function myClass() {};
    
    // arrange
    var model = new myClass();
    var bc = {
        $this: {},
        $parentContext: {        
            $this: {},
            $parentContext: {        
                $this: new wo.view()
            }
        }
    };
    
    bc.$parentContext.$parentContext.$this.model = model;    
    subject = new find(bc);
    
    // act
    var actual = subject.find({$i:myClass, $m: true});
    
    // assert
    strictEqual(actual, model);
});