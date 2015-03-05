
module("wipeout.viewModels.itemsControl, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("removeItem routed event", function() {
    
    // arrange    
    var item = {};
    application.items = new obsjs.array([{}, item]);
    application.template = '<wo.items-control id="cc" items--tw="$parent.items"></wo.items-control>';
    
    // act
	application.onRendered = function () {
		
    	application.templateItems.cc.triggerRoutedEvent(wo.itemsControl.removeItem, item);
		
		application.items.observe(function () {
    		strictEqual(application.items.indexOf(item), -1);
			start();
		});
	};
    
    // assert
	stop();
});

test("basic items control. initial, add, remove, re-arrange", function() {
    // arrange
    var id1 = "JBKJBLKJBKJLBLKJB";
    var id2 = "oidshfp9usodnf";
    var item1 = "item1", item2 = "item2", item3 = "item3";
    application.model.items = new obsjs.array([item1, item2, item3]);
    
    var bound = {};
    var assert = function() {
        var reBound = {};
        var $items = $("." + id2);
        strictEqual($items.length, arguments.length, "html length");
        strictEqual(application.templateItems[id1].items.length, arguments.length, "items length");
        for(var i = 0, ii = arguments.length; i < ii; i++) {            
            strictEqual($items[i].innerHTML, arguments[i], "html value");           
            strictEqual(application.templateItems[id1].getItemViewModel(i).model, arguments[i], "item model value");
            reBound[arguments[i]] = $items[i];
            
            if(bound[arguments[i]])
                strictEqual(bound[arguments[i]], $items[i], "template was not re-drawn");
            else
                bound[arguments[i]] = $items[i];
        }
        
        for(var i in bound) {
            if(!reBound[i]) {
                ok(!bound[i].parentElement, "deleted item was removed");
                delete bound[i];
            }
        }
    }
    
    // act
    application.template =
"<wo.items-control items='$this.model.items' id='" + id1 + "'>\
    <item-template>\
        <div class='" + id2 + "' wo-content='$this.model'></div>\
    </item-template>\
</wo.items-control>";
	
	application.onRendered = function () {
    
		// assert
		assert(item1, item2, item3);

		// re-act
		var item4  = "item4";
		application.model.items.push(item4);
		var destroy = application.templateItems[id1].items.observe(function () {
			destroy.dispose();
					
			// re-assert
			ok(true, "added item");
			assert(item1, item2, item3, item4);
			
			
			// re-act
			application.model.items.splice(1, 1);
			destroy = application.templateItems[id1].items.observe(function () {
				destroy.dispose();

				// re-assert
				ok(true, "removed item");
				assert(item1, item3, item4);
				
				
				// re-act
				application.model.items.reverse();
				destroy = application.templateItems[id1].items.observe(function () {
					destroy.dispose();
					
					ok(true, "reversed items");
					assert(item4, item3, item1);
									
					start();
				});
			});
		});
	};
	
	stop();
});