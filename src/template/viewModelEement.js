
Class("wipeout.template.viewModelElement", function () {
    
    var viewModelElement = wipeout.template.renderedContent.extend(function viewModelElement (element, xmlOverride, parentRenderContext) {
        ///<summary>The begin and end comment tags which surround and render a view model</summary>
        ///<param name="element" type="Element">The html element to replace with the view model</param>
        ///<param name="xmlOverride" type="wipeout.template.templateElement" optional="true">If set, will use this xml to initialize the view model. If not will parse and use the element property</param>
        ///<param name="parentRenderContext" type="wipeout.template.renderContext" optional="true">The render context of the parent view model</param>
        
        var vm = xmlOverride ? {
            constructor: wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(xmlOverride.name)),
            name: xmlOverride.name
        } : getMeAViewModel(element);
        
        if(!vm)
            throw "Invalid view model";
        
        this._super(element, wipeout.utils.obj.trim(vm.name), parentRenderContext);
        
        // create initialization xml
        this.initialization = xmlOverride || wipeout.template.templateParser(wipeout.utils.html.outerHTML(element))[0];
        
        // create actual view model
        this.viewModel = new vm.constructor();
        this.renderContext = new wipeout.template.renderContext(this.viewModel, parentRenderContext);
        
        // initialize the view model
        wipeout.template.engine.instance
            .getVmInitializer(this.initialization)
            .initialize(this.viewModel, this.renderContext);
        
        // run onInitialized after templating is complete
        wipeout.base.watched.afterNextObserveCycle(this.viewModel.onInitialized.bind(this.viewModel));
        
        this.render(this.viewModel);
    });
    
    //TODO: move to parent
    viewModelElement.getParentElement = function(forHtmlElement) {
        var current = forHtmlElement.wipeoutClosing ? forHtmlElement.wipeoutClosing.openingTag : forHtmlElement;
        while (current = current.previousSibling) {
            if (current.wipeoutClosing)
                current = current.wipeoutClosing.openingTag;
            else if (current.wipeoutOpening)
                return current;
        }
        
        return forHtmlElement.parentElement;
    };
    
    return viewModelElement;    
});