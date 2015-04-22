module("integration: wipeout.template.initialization.compiledInitializer", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("set model", function() {
	// arrange
	var model1 = {model2: {}}, model3 = {};
	views.myView = wo.view.extend(function () {
		this._super(undefined, model3);
	})
	
	application.model = model1;
	application.setTemplate = '<wo.view id="v1"></wo.view>\
<wo.view id="v2" model="$parent.model.model2"></wo.view>\
<views.my-view id="v3"></views.my-view>';
	
	application.onRendered = function () {
		strictEqual(application.model, model1);
		strictEqual(application.templateItems.v1.model, model1);
		strictEqual(application.templateItems.v2.model, model1.model2);
		strictEqual(application.templateItems.v3.model, model3);
		
		start();
	}
	
	stop();
});

test("all property setter types", function() {
	clearIntegrationStuff();
	
	// arrange
	var template = wipeout.wml.wmlParser('<object val0="$parent.theValue" val1="true" val2--s="true">\
	<val3 value="true"></val3>\
	<val4 value--s="true"></val4>\
	<val5>true</val5>\
	<val6 parser="s">true</val6>\
	<val7>\
		<js-object>\
			<val1 value="55"></val1>\
			<val2 value="$parent.theValue"></val2>\
		</js-object>\
	</val7>\
	<div data-wo-element-name="val8">777</div>\
	<div data-wo-element-name="val9" parser="s">777</div>\
<object>')[0];
	
	var theValue = {}, theVm = {};
	var rc = new wipeout.template.context({theValue: theValue}).contextFor(theVm);
	
	// act
	new wipeout.template.initialization.compiledInitializer(template).initialize(theVm, rc);
	
	// assert
	strictEqual(theVm.val0, theValue);
	strictEqual(theVm.val1, true);
	strictEqual(theVm.val2, "true");
	strictEqual(theVm.val3, true);
	strictEqual(theVm.val4, "true");
	strictEqual(theVm.val5, true);
	strictEqual(theVm.val6, "true");
	
	strictEqual(theVm.val7.val1, 55);
	strictEqual(theVm.val7.val2, theValue);
	
	strictEqual(theVm.val8, 777);
	strictEqual(theVm.val9, "777");
});