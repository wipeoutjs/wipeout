wo.viewModel("wipeoutDocs.viewModels.components.versioned")
/*.templateId(wo.content.createAnonymousTemplate('<fieldset>\
    <legend>version {{$this.version}}</legend>\
    <wo.view template-id="$this.contentTemplateId" share-parent-scope="true"></wo.view>\
</fieldset>'))*/
.initialize(function () {
    wipeout.viewModels.content.createTemplatePropertyFor(this, "contentTemplateId", "contentTemplate");
})
.parser("version", "float")
.parser("contentTemplate", "template")
.binding("contentTemplate", "templateProperty")
.build();