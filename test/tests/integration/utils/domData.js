module("integration: wipeout.utils.domData", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("get, set, clear", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var element = {};
    var key = "JKHBKJHBKJHB";
    var value = {};
	
    // act 1
    var val1 = wipeout.utils.domData.set(element, key, value);
    strictEqual(element["__wipeout_domData"][key], value);
    strictEqual(val1, value);
	
    // act 2
    ok(wipeout.utils.domData.exists(element, key));
    ok(!wipeout.utils.domData.exists(element, "asfdbfalkbflbsaf"));
    
    // act 3
    var val2 = wipeout.utils.domData.get(element, key);
    strictEqual(val2, value);
    
    // act 4
    var val3 = wipeout.utils.domData.get(element);
    strictEqual(val3[key], value);
    
    // act 5
    var val1 = wipeout.utils.domData.set(element, "sadasda", {});	// add random key so clear doesn't destroy data
    wipeout.utils.domData.clear(element, key);
    strictEqual(element["__wipeout_domData"][key], undefined);
    
    // act 6
    wipeout.utils.domData.clear(element);
    strictEqual(element["__wipeout_domData"], undefined);
    
    // act 7
    throws(function() {
        wipeout.utils.domData.get(null);
    });
});