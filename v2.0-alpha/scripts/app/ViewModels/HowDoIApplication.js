
compiler.registerClass("wipeoutDocs.viewModels.howDoIApplication", "wipeoutDocs.viewModels.application", function() {
    
    var apiTemplateId;
    var staticConstructor= function() {
        if(apiTemplateId)
            return;
        
        apiTemplateId = wo.contentControl.createAnonymousTemplate('<h1 data-bind="text: $context.find(wipeoutDocs.viewModels.howDoIApplication).apiPlaceholderName"></h1>\
<wipeout-docs.view-models.components.dynamic-render model="$context.find(wipeoutDocs.viewModels.howDoIApplication).apiPlaceholder"></wipeout-docs.view-models.components.dynamic-render>');
    };
    
    function HowDoIApplication() {
        staticConstructor();
        
        this._super("wipeoutDocs.viewModels.howDoIApplication");
        
        this.contentTemplate = wo.contentControl.createAnonymousTemplate("");
        
        this.apiPlaceholder = null;
        this.apiPlaceholderName = null;
        
        var placeholder = document.getElementById("headerText");
        var textbox = $('<input style="margin-top: 20px;" type="text" placeholder="Search Docs..."></input>')[0];
        placeholder.parentElement.insertBefore(textbox, placeholder);
        
        var _this = this;
        textbox.addEventListener("keyup", function() {
            _this.model.search(textbox.value);
        });
        
        textbox.addEventListener("change", function() {
            _this.model.search(textbox.value);
        });
    };
    
    HowDoIApplication.prototype.route = function(query) { 
        if(query.article) {
            this.openArticle(query.article);
        } else if (query.type === "api") {
            this.apiPlaceholder = wipeoutDocs.models.apiApplication.getModel(query);
            if(this.apiPlaceholder) {
                this.apiPlaceholderName = this.apiPlaceholder instanceof wipeoutDocs.models.descriptions.class ? this.apiPlaceholder.classFullName : "";
                this.contentTemplate = apiTemplateId;
            }
        } else {
            this.contentTemplate = wo.contentControl.createAnonymousTemplate("");
        }
    };
    
    HowDoIApplication.prototype.openArticle = function(article) {
        $(".list-group-item-info", this.templateItems.leftNav).removeClass("list-group-item-info");
        
        delete window.demoApp;
        this.contentTemplate = "Articles." + article;
        
        var current, groups = this.templateItems.articles.getItemViewModels();
        for(var i = 0, ii = groups.length; i < ii; i++) {
            if(groups[i].templateItems.header && groups[i].templateItems.header.model.header.article === article) {
                this.scrollToArticle(groups[i].templateItems.header);
                return;
            }
            
            var items = groups[i].templateItems.items ? groups[i].templateItems.items.getItemViewModels() : [];
            for (var j = 0, jj = items.length; j < jj; j++) {
                if(items[j].model.article === article) {
                    this.scrollToArticle(items[j]);
                    return;
                }
            }
        }        
    };
    
    HowDoIApplication.prototype.scrollToArticle = function(articleVm) { 
                
        var articleElement = articleVm.$domRoot.openingTag;
        while (articleElement && articleElement.nodeType !== 1)
            articleElement = articleElement.nextSibling;
        
        if(!articleElement) return;
        if(!$(articleElement).hasClass("active"))
            $(articleElement).addClass("list-group-item-info");
        
        var _do = function() {
            window.scrollTo(0, 0);
            $(this.templateItems.leftNav).animate({
                scrollTop: $(articleElement).offset().top + this.templateItems.leftNav.scrollTop - 80
            }, 500);
        };
        
        setTimeout(_do.bind(this), 100);
    };
    
    return HowDoIApplication;
});