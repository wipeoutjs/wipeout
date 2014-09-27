module("wipeout.base.watched", {
    setup: function() {
    },
    teardown: function() {
    }
});

var watched = wipeout.base.watched;

testUtils.testWithUtils("constructor", "enumerable", false, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    subject = new watched(null, true);
    
    // assert
    ok(subject.__woBag);
    var woBag = false;
    for(var i in subject) {
        if(subject[i] === subject.__woBag)
            woBag = true;
    }
    
    ok(woBag);
});

testUtils.testWithUtils("constructor", "not enumerable", false, function(methods, classes, subject, invoker) {
    // arrange    
    // act
    subject = new watched(null, false);
    
    // assert
    ok(subject.__woBag);
    var woBag = false;
    for(var i in subject) {
        if(subject[i] === subject.__woBag)
            woBag = true;
    }
    
    ok(!woBag);
});

testUtils.testWithUtils("constructor", "initial values", false, function(methods, classes, subject, invoker) {
    // arrange    
    var vals = {aaa:{}, bbb:{}};
    
    // act
    subject = new watched(vals);
    
    // assert
    strictEqual(subject.aaa, vals.aaa);
    strictEqual(subject.bbb, vals.bbb);
});

testUtils.testWithUtils("observe", null, false, function(methods, classes, subject, invoker) {
    // arrange    
    var assertsRun = false, stopped = false;
    subject = new watched({val: "aaa"});
    subject.observe("val", function(oldVal, newVal) {
        strictEqual(oldVal, "aaa");
        strictEqual(newVal, "bbb");
        assertsRun = true;
        if(stopped)
            start();
    });
    
    // act
    subject.val = "bbb";
    
    if (!assertsRun) {
        stop();
        stopped = true;
        setTimeout(function() {
            if(!assertsRun) {
                ok(false, "callback not fired");
                start();
            }
        }, 150);
    }
    
    // assert
    debugger;
});

function aa() {
    var watched = wipeout.base.object.extend(function watched(woBagIsEnumerable) {
        ///<summary>An object whose properties can be subscribed to</summary>   
        this._super();
        
        var woBag = {
            watched: {},
            propertyChanged: wo.event()
        };
            
        // __woBag should be private, however this has performance penalties, especially in IE
        // in practice the woBagIsEnumerable flag will be set by wipeout only
        if(woBagIsEnumerable) {
            this.__woBag = woBag;
        } else {
            Object.defineProperty(this, '__woBag', {
                enumerable: false,
                configurable: false,
                value: woBag,
                writable: false
            });
        }
    });
}