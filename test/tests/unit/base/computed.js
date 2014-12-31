module("wipeout.base.computed", {
    setup: function() {
    },
    teardown: function() {
    }
});

var computed = wipeout.base.computed;

testUtils.testWithUtils("stripFunction", "block comments", true, function(methods, classes, subject, invoker) {
    // arrange
    
    var begin = "begin\n",
        end = "\nend",
        strip = "/* strip */";    
        
    // act
    var output = invoker(begin + strip + end);
    
    // assert
    strictEqual(output, begin + end);
});

testUtils.testWithUtils("stripFunction", "inline comments", true, function(methods, classes, subject, invoker) {
    // arrange
    
    var begin = "begin",
        end = "\nend",
        strip = "//strip"; 
        
    // act
    var output = invoker(begin + strip + end);
    
    // assert
    strictEqual(output, begin + end);
});

testUtils.testWithUtils("stripFunction", "string \"", true, function(methods, classes, subject, invoker) {
    // arrange
    
    var begin = "begin",
        end = "\nend",
        strip = '"strip \' \\""'; 
        
    // act
    var output = invoker(begin + strip + end);
    
    // assert
    strictEqual(output, begin + "#" + end);
});

testUtils.testWithUtils("stripFunction", "string '", true, function(methods, classes, subject, invoker) {
    // arrange
    
    var begin = "begin",
        end = "\nend",
        strip = "'strip \" \\''"; 
        
    // act
    var output = invoker(begin + strip + end);
    
    // assert
    strictEqual(output, begin + "#" + end);
});

testUtils.testWithUtils("integration test", "simple change", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    subject.val1 = wo.watch();
    subject.val1.val2 = "hello";
    subject.val3 = "world";

    new wipeout.base.computed(subject, "comp", function() {
        return this.val1.val2 + " " + this.val3;
    });

    subject.observe("comp", function(oldVal, newVal) {
        strictEqual(oldVal, "hello world");
        strictEqual(newVal, "hello shane");
        start();
    });

    // act
    stop();
    subject.val3 = "shane";

});

testUtils.testWithUtils("integration test", "complex change", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    subject.val1 = wo.watch();
    subject.val1.val2 = "hello";
    subject.val3 = "world";

    new wipeout.base.computed(subject, "comp", function() {            
        return this.val1.val2 + " " + this.val3;
    });

    subject.observe("comp", function(oldVal, newVal) {
        strictEqual(oldVal, "hello world");
        strictEqual(newVal, "goodbye world");
        start();
    });

    // act
    stop();
    subject.val1 = {val2: "goodbye"};

});

testUtils.testWithUtils("integration test", "two changes", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    subject.val1 = wo.watch();
    subject.val1.val2 = "hello";
    subject.val3 = "world";

    new wipeout.base.computed(subject, "comp", function() {
        return this.val1.val2 + " " + this.val3;
    });

    subject.observe("comp", function(oldVal, newVal) {
        strictEqual(oldVal, "hello world");
        strictEqual(newVal, "goodbye shane");
        start();
    });

    // act
    stop();
    subject.val1 = {val2: "goodbye"};
    subject.val3 = "shane";

});

testUtils.testWithUtils("integration test", "strings", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    subject.val1 = 1;

    new wipeout.base.computed(subject, "comp", function() {
        return "this.val1";
    });

    subject.observe("comp", function(oldVal, newVal) {
        ok(false);
    });

    // act
    stop();
    subject.val1 = 44;
    setTimeout(function() {
        ok(true);
        start();
    }, 50);        
});

testUtils.testWithUtils("integration test", "dispose", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    subject.val1 = wo.watch();
    subject.val1.val2 = "hello";
    subject.val3 = "world";

    var disp = new wipeout.base.computed(subject, "comp", function() {
        return this.val1.val2 + " " + this.val3;
    });

    subject.observe("comp", function(oldVal, newVal) {
        ok(false);
    });

    // act
    stop();
    disp.dispose();
    subject.val3 = "shane";

    setTimeout(function() {
        ok(true);
        start();
    }, 100)
});

testUtils.testWithUtils("integration test", "variable change", false, function(methods, classes, subject, invoker) {
    // arrange
    var subject = wo.watch();
    var var1 = wo.watch();
    var1.val1 = wo.watch();
    var1.val1.val2 = "hello";
    var1.val3 = "world";

    new wipeout.base.computed(subject, "comp", function() {
        return var1.val1.val2 + " " + var1.val3;
    }, {
        var1: var1
    });

    subject.observe("comp", function(oldVal, newVal) {
        strictEqual(oldVal, "hello world");
        strictEqual(newVal, "hello shane");
        start();
    });

    // act
    stop();
    var1.val3 = "shane";        
});

testUtils.testWithUtils("integration test", "variable name vs property name", false, function(methods, classes, subject, invoker) {
    // arrange
    subject = wo.watch();
    var var1 = wo.watch({
        var2: wo.watch({
            var3: 44
        })
    });
    
    var var2 = wo.watch();

    new wipeout.base.computed(subject, "comp", function() {
        return var1.
        var2.var3;
    }, {
        var2: var2    // watch var2
    });

    subject.observe("comp", function(oldVal, newVal) {
        ok(false);
    });

    // act
    stop();
    var2.var3 = "shane";
    
    setTimeout(function() {
        ok(true);
        start();
    }, 100);
});

testUtils.testWithUtils("integration test", "variable name with character before", false, function(methods, classes, subject, invoker) {
    // arrange
    subject = wo.watch();
    var var1 = wo.watch({val: 2});    
    var avar1 = wo.watch({val: 3});

    new wipeout.base.computed(subject, "comp", function() {
        return avar1.val;
    }, {
        var1: var1
    });

    subject.observe("comp", function(oldVal, newVal) {
        ok(false);
    });

    // act
    stop();
    var1.val = "shane";
    
    setTimeout(function() {
        ok(true);
        start();
    }, 100);
});

testUtils.testWithUtils("integration test", "variable name with character after", false, function(methods, classes, subject, invoker) {
    // arrange
    subject = wo.watch();
    var var1 = wo.watch({val: 2});    
    var var1a = wo.watch({val: 3});

    new wipeout.base.computed(subject, "comp", function() {
        return var1a.val;
    }, {
        var1: var1
    });

    subject.observe("comp", function(oldVal, newVal) {
        ok(false);
    });

    // act
    stop();
    var1.val = "shane";
    
    setTimeout(function() {
        ok(true);
        start();
    }, 100);
});

testUtils.testWithUtils("integration test", "with args", false, function(methods, classes, subject, invoker) {
    // arrange
    subject = wo.watch();
    var var1 = wo.watch({val: 2});  

    new wipeout.base.computed(subject, "comp", function(var1) {
        return var1.val;
    }, {
        var1: var1
    });

    subject.observe("comp", function(oldVal, newVal) {
        strictEqual(oldVal, 2);
        strictEqual(newVal, 3);
        start();
    });

    // act
    stop();
    var1.val = 3;
});

testUtils.testWithUtils("integration test", "with args, arg not added as watched arg", false, function(methods, classes, subject, invoker) {
    // arrange
    subject = wo.watch();
    var var1 = wo.watch({val: 2});  

    throws(function() {
        new wipeout.base.computed(subject, "comp", function(var1) {
            return var1.val;
        });
    });
});