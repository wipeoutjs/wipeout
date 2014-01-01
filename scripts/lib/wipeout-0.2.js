(function(){var a=a||{};a.base=a.base||{};(function(){var c=function(d){this._events={};if(d){$.extend(this,d)}};var b={parents:[],children:[]};c.prototype._super=function(){if(arguments.callee===this.constructor){this.constructor.prototype.constructor.apply(this,arguments);return}var m=b.children.indexOf(arguments.callee.caller);var d=m===-1?null:b.parents[m];if(!d){var h=[];var e=this.constructor.prototype;while(e){h.push(e);e=Object.getPrototypeOf(e)}h.reverse();for(var f=0,g=h.length;f<g;f++){for(var l in h[f]){if(h[f][l]===arguments.callee.caller){for(var k=f-1;k>=0;k--){if(h[k][l]!==arguments.callee.caller){d=h[k][l];b.children.push(arguments.callee.caller);b.parents.push(d);break}}break}}}if(!d){throw"Could not find method in parent class"}}return d.apply(this,arguments)};c.extend=function(d){for(var e in this){if(this.hasOwnProperty(e)){d[e]=this[e]}}function f(){this.constructor=d}f.prototype=this.prototype;d.prototype=new f();return d};a.base.object=c})();var a=a||{};a.base=a.base||{};(function(){var b=a.base.object.extend(function(c){this._super();this.templateItems={};this.renderedChildren=[];this._rootHtmlElement=null;this._routedEventSubscriptions=[];this.templateId=ko.observable(c||b.getDefaultTemplateId())});b._afterRendered=function(d,c){var e=c.nodes||[];c.nodes=d;c.rootHtmlChanged(e,d)};b.prototype.dispose=function(){for(var c in this){if(ko.isObservable(this[c])&&this[c].dispose instanceof Function){this[c].dispose()}}for(var c in this.templateItems){if(this.templateItems[c] instanceof b){this.templateItems[c].dispose()}}for(var c=0,d=this.renderedChildren.length;c<d;c++){if(this.renderedChildren[c] instanceof b){this.renderedChildren[c].dispose()}}this._rootHtmlElement=null;for(var c=0,d=this._routedEventSubscriptions.length;c<d;c++){this._routedEventSubscriptions[c].event.dispose()}this._routedEventSubscriptions.length=0};b.getParentElement=function(e){var d=0;var c=e.previousSibling;while(c){if(a.util.ko.virtualElements.isVirtualClosing(c)){d--}if(a.util.ko.virtualElements.isVirtual(c)){if(d===0){return c}d++}c=c.previousSibling}return e.parentElement};b.prototype.getParents=function(){var c=this;var d=[];while(c){d.push(c);c=c.getParent()}return d};b.prototype.getParent=function(){var d;var c=b.getParentElement(this._rootHtmlElement);while(c){if(d=ko.utils.domData.get(c,a.ko.bindings.wpfko.utils.wpfkoKey)){return d}c=b.getParentElement(c)}};b.prototype.unRegisterRoutedEvent=function(g,c,d){for(var e=0,f=this._routedEventSubscriptions.length;e<f;e++){if(this._routedEventSubscriptions[e].routedEvent===g){this._routedEventSubscriptions[e].event.unRegister(c,context);return}}};b.prototype.registerRoutedEvent=function(h,c,d){var g;for(var e=0,f=this._routedEventSubscriptions.length;e<f;e++){if(this._routedEventSubscriptions[e].routedEvent===h){g=this._routedEventSubscriptions[e];break}}if(!g){g=new a.base.routedEventRegistration(h);this._routedEventSubscriptions.push(g)}g.event.register(c,d)};b.prototype.triggerRoutedEvent=function(g,c){if(!(c instanceof a.base.routedEventArgs)){c=new a.base.routedEventArgs(c,this)}for(var d=0,e=this._routedEventSubscriptions.length;d<e;d++){if(c.handled){return}if(this._routedEventSubscriptions[d].routedEvent===g){this._routedEventSubscriptions[d].event.trigger(c)}}if(!c.handled){var f=this.getParent();if(f){f.triggerRoutedEvent(g,c)}}};b.prototype.rootHtmlChanged=function(d,c){};b.getDefaultTemplateId=(function(){var c=null;return function(){if(!c){c=a.base.contentControl.createAnonymousTemplate("<span>No template has been specified</span>")}return c}})();b.getBlankTemplateId=(function(){var c=null;return function(){if(!c){c=a.base.contentControl.createAnonymousTemplate("")}return c}})();b.visualGraph=function(e,c){if(!e){return[]}c=c||function(){return typeof arguments[0]};var d=[];a.util.obj.enumerate(a.util.html.getAllChildren(e),function(g){a.util.obj.enumerate(b.visualGraph(g),d.push,d)});var f=ko.utils.domData.get(e,a.ko.bindings.wpfko.utils.wpfkoKey);if(f){return[{viewModel:f,display:c(f),children:d}]}return d};b.reservedTags=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","command","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","head","header","h1","h2","h3","h4","h5","h6","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","map","mark","menu","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr"];a.base.visual=b})();var a=a||{};a.base=a.base||{};(function(){var d=a.base.visual.extend(function(f,e){this._super(f);this.model=ko.observable(e);var e=null;this.model.subscribe(function(g){try{this.modelChanged(e,g)}finally{e=g}},this);this._bindings={}});var b=function(j,e,f){for(var g=0,h=j.length;g<h;g++){e.call(f,j[g],g)}};var c=function(e,f,g){if(ko.isObservable(e[f])){e[f](ko.utils.unwrapObservable(g))}else{e[f]=ko.utils.unwrapObservable(g)}};d.prototype.onInitialized=function(){};d.prototype.dispose=function(){this._super();for(var e in this._bindings){this._bindings[e].dispose()}};d.prototype.bind=function(e,j,i){if(i&&(!ko.isObservable(this[e])||!ko.isObservable(j()))){throw"Two way bindings must be between 2 observables"}if(this._bindings[e]){this._bindings[e].dispose();delete this._bindings[e]}var h=ko.dependentObservable({read:function(){return ko.utils.unwrapObservable(j())},write:i?function(){var k=j();if(k){j()(arguments[0])}}:undefined});c(this,e,h.peek());var f=h.subscribe(function(k){c(this,e,k)},this);var g=i?this[e].subscribe(function(k){c({x:h},"x",k)},this):null;this._bindings[e]={dispose:function(){if(f){f.dispose();f=null}if(g){g.dispose();g=null}if(h){h.dispose();h=null}}}};d.reservedPropertyNames=["constructor","constructor-tw","id","id-tw"];d.prototype.initialize=function(f,e){if(this._initialized){throw"Cannot call initialize item twice"}this._initialized=true;if(!f){return}if(!a.template.htmlBuilder.elementHasModelBinding(f)&&a.util.ko.peek(this.model)==null){this.bind("model",e.$parent.model)}b(f.attributes,function(g){if(d.reservedPropertyNames.indexOf(g.nodeName)!==-1){return}var h=g.nodeName,i="";if(h.indexOf("-tw")===g.nodeName.length-3){h=h.substr(0,h.length-3);i=",\n\t\t\tfunction(val) {\n\t\t\t\tif(!ko.isObservable("+g.value+"))\n\t\t\t\t\tthrow 'Two way bindings must be between 2 observables';\n\t\t\t\t"+g.value+"(val);\n\t\t\t}"}a.template.engine.createJavaScriptEvaluatorFunction("(function() {\n\t\t\t$data.bind('"+h+"', function() {\n\t\t\t\treturn "+g.value+";\n\t\t\t}"+i+");\n\n\t\t\treturn '';\n\t\t})()")(e)});b(f.childNodes,function(g,h){if(g.nodeType!==1){return}var o="string";for(var l=0,m=g.attributes.length;l<m;l++){if(g.attributes[l].nodeName==="constructor"&&g.attributes[l].nodeValue){o=g.attributes[l].nodeValue;break}}if(d.objectParser[o.replace(/^\s+|\s+$/g,"").toLowerCase()]){var k=[];var n=n||new XMLSerializer();for(var l=0,m=g.childNodes.length;l<m;l++){k.push(n.serializeToString(g.childNodes[l]))}var p=d.objectParser[o.replace(/^\s+|\s+$/g,"").toLowerCase()](k.join(""));if(ko.isObservable(this[g.nodeName])){this[g.nodeName](p)}else{this[g.nodeName]=p}}else{var p=a.util.obj.createObject(o);p.initialize(g,e.createChildContext(p));if(ko.isObservable(this[g.nodeName])){this[g.nodeName](p)}else{this[g.nodeName]=p}}},this)};d.objectParser={json:function(e){return JSON.parse(e)},string:function(e){return e},bool:function(f){var e=f.replace(/^\s+|\s+$/g,"").toLowerCase();return e?e!=="false"&&e!=="0":false},"int":function(e){return parseInt(e.replace(/^\s+|\s+$/g,""))},"float":function(e){return parseFloat(e.replace(/^\s+|\s+$/g,""))},regexp:function(e){return new RegExp(e.replace(/^\s+|\s+$/g,""))},date:function(e){return new Date(e.replace(/^\s+|\s+$/g,""))}};d.prototype.modelChanged=function(f,e){};a.base.view=d})();var a=a||{};a.base=a.base||{};(function(){var b=a.base.view.extend(function(d){this._super(d||a.base.visual.getBlankTemplateId());this.template=ko.dependentObservable({read:function(){var e=document.getElementById(this.templateId());return e?e.textContent:""},write:function(e){this.templateId(a.base.contentControl.createAnonymousTemplate(e))},owner:this})});var c="data-templatehash";b.createAnonymousTemplate=(function(){var e=null;var d=Math.floor(Math.random()*1000000000);return function(k){if(!e){e=a.util.html.createElement("<div style='display: none'></div>");document.body.appendChild(e)}k=k.replace(/^\s+|\s+$/g,"");var f=b.hashCode(k).toString();for(var h=0,i=e.childNodes.length;h<i;h++){if(e.childNodes[h].nodeType===1&&e.childNodes[h].nodeName==="SCRIPT"&&e.childNodes[h].id&&e.childNodes[h].attributes[c]&&e.childNodes[h].attributes[c].nodeValue===f&&e.childNodes[h].innerHTML===k){return e.childNodes[h].id}}var g="AnonymousTemplate"+(++d);e.innerHTML+='<script type="text/xml" id="'+g+'" '+c+'="'+f+'">'+k+"</script>";return g}})();b.hashCode=function(h){var e=0;for(var f=0,g=h.length;f<g;f++){var d=h.charCodeAt(f);e=((e<<5)-e)+d;e=e&e}return e};a.base.contentControl=b})();var a=a||{};a.base=a.base||{};(function(){var b=function(){this._registrations=[]};b.prototype.trigger=function(c){for(var d=0,e=this._registrations.length;d<e;d++){if(c instanceof a.base.routedEventArgs&&c.handled){return}this._registrations[d].callback.call(this._registrations[d].context,c)}};b.prototype.unRegister=function(c,d){d=d==null?window:d;for(var e=0,f=this._registrations.length;e<f;e++){if(this._registrations[e].callback===c&&this._registrations[e].context===d){this._registrations.splice(e,1);e--}}};b.prototype.dispose=function(){this._registrations.length=0};b.prototype.register=function(c,d){if(!(c instanceof Function)){throw"Invalid event callback"}var f=this._registrations;var e={callback:c,context:d==null?window:d,dispose:function(){var g=f.indexOf(e);if(g>=0){f.splice(g,1)}}};this._registrations.push(e);return{callback:e.callback,context:e.context,dispose:e.dispose}};a.base.event=b})();var a=a||{};a.base=a.base||{};(function(){var b;var d=function(){if(b){return}b=a.base.contentControl.createAnonymousTemplate("<div data-bind='itemsControl: null'></div>")};var c=a.base.contentControl.extend(function(){d();this._super(b);this.itemTemplateId=ko.observable();this.itemSource=ko.observableArray([]);this.items=ko.observableArray([]);if(a.util.ko.version()[0]<3){c.subscribeV2.call(this)}else{c.subscribeV3.call(this)}this.items.subscribe(this.syncModelsAndViewModels,this);this.itemTemplate=ko.dependentObservable({read:function(){var f=document.getElementById(this.itemTemplateId());return f?f.textContent:""},write:function(f){this.itemTemplateId(a.base.contentControl.createAnonymousTemplate(f))},owner:this});var e=this.itemTemplateId.peek();this.itemTemplateId.subscribe(function(f){if(e!==f){try{this.reDrawItems()}finally{e=f}}},this)});c.subscribeV2=function(){var e=this.itemSource.peek();this.itemSource.subscribe(function(){try{if(this.modelsAndViewModelsAreSynched()){return}this.itemsChanged(ko.utils.compareArrays(e,arguments[0]||[]))}finally{e=a.util.obj.copyArray(arguments[0]||[])}},this)};c.subscribeV3=function(){this.itemSource.subscribe(this.itemsChanged,this,"arrayChange")};c.prototype.syncModelsAndViewModels=function(){var e=false,h=false;var j=this.itemSource();if(j==null){h=true;j=[]}var k=this.items();if(j.length!==k.length){e=true;j.length=k.length}for(var f=0,g=k.length;f<g;f++){if(k[f].model()!==j[f]){j[f]=k[f].model();e=true}}if(e){if(h){this.itemSource(j)}else{this.itemSource.valueHasMutated()}}};c.prototype.modelsAndViewModelsAreSynched=function(){var g=this.itemSource()||[];var h=this.items()||[];if(g.length!==h.length){return false}for(var e=0,f=g.length;e<f;e++){if(g[e]!==h[e].model()){return false}}return true};c.prototype.itemsChanged=function(f){var l=this.items();var g=[],e=[],m={},h=0;for(var j=0,k=f.length;j<k;j++){if(f[j].status===a.util.ko.array.diff.retained){continue}else{if(f[j].status===a.util.ko.array.diff.deleted){g.push((function(i){return function(){var n=l.splice(i.index+h,1)[0];if(i.moved!=null){m[i.moved+"."+i.index]=n}h--}})(f[j]))}else{if(f[j].status===a.util.ko.array.diff.added){e.push((function(i){return function(){var n=i.moved!=null?m[i.index+"."+i.moved]:this.createItem(i.value);l.splice(i.index,0,n)}})(f[j]))}else{throw"Unsupported status"}}}}for(j=0,k=g.length;j<k;j++){g[j].call(this)}for(j=0,k=e.length;j<k;j++){e[j].call(this)}this.items.valueHasMutated()};c.prototype.createItem=function(e){return new a.base.view(this.itemTemplateId(),e)};c.prototype.reDrawItems=function(){var g=this.itemSource()||[];var h=this.items();h.length=g.length;for(var e=0,f=g.length;e<f;e++){h[e]=this.createItem(g[e])}this.items.valueHasMutated()};a.base.itemsControl=c})();var a=a||{};a.base=a.base||{};(function(){var b=function(){};b.prototype.trigger=function(f,e){f.triggerRoutedEvent(this,new c(e,f))};b.prototype.unRegister=function(e,g,f){g.unRegisterRoutedEvent(this,e,f)};b.prototype.register=function(e,g,f){g.registerRoutedEvent(this,e,f)};a.base.routedEvent=b;var c=function(e,f){this.handled=false;this.data=e;this.originator=f};a.base.routedEventArgs=c;var d=function(e){this.routedEvent=e;this.event=new a.base.event()};a.base.routedEventRegistration=d})();var a=a||{};a.ko=a.ko||{};a.ko.bindings=a.ko.bindings||{};(function(){var c=function(h,i,f,j,g){if(!(j instanceof a.base.itemsControl)){throw"This binding can only be used within the context of a wo.itemsControl"}ko.virtualElements.emptyNode(h);if(a.util.ko.version()[0]<3){e.subscribeV2(h,j,g)}else{e.subscribeV3(h,j,g)}d(h,j,g)(ko.utils.compareArrays([],j.items.peek()))};var d=function(g,h,f){return function(k){var l=[],j=[],p={},m=0;for(var n=0,o=k.length;n<o;n++){if(k[n].status===a.util.ko.array.diff.retained){continue}else{if(k[n].status===a.util.ko.array.diff.deleted){l.push((function(i){return function(){if(i.moved!=null){p[i.moved+"."+i.index]={vm:i.value,elements:i.value._rootHtmlElement.__wpfko.allElements()}}else{ko.virtualElements.emptyNode(i.value._rootHtmlElement)}var q=i.value._rootHtmlElement.__wpfko.allElements();for(var r=0,s=q.length;r<s;r++){q[r].parentNode.removeChild(q[r])}if(i.moved==null){i.value.dispose()}m--}})(k[n]))}else{if(k[n].status===a.util.ko.array.diff.added){j.push((function(i){return function(){var t=h.items.indexOf(i.value);if(i.moved!=null){var u=p[i.index+"."+i.moved];if(t===0){for(var v=u.elements.length-1;v>=0;v--){ko.virtualElements.prepend(g,u.elements[v])}}else{var r=h.items.peek()[t-1];for(var v=u.elements.length-1;v>=0;v--){r._rootHtmlElement.__wpfko.insertAfter(u.elements[v])}}}else{var s=a.util.html.createWpfkoComment();if(t===0){ko.virtualElements.prepend(g,s.close);ko.virtualElements.prepend(g,s.open)}else{h.items.peek()[t-1]._rootHtmlElement.__wpfko.insertAfter(s.close);h.items.peek()[t-1]._rootHtmlElement.__wpfko.insertAfter(s.open)}var q=(function(w){return function(){return i.value}})(n);a.ko.bindings.render.init(s.open,q,q,h,f);a.ko.bindings.render.update(s.open,q,q,h,f)}}})(k[n]))}else{throw"Unsupported status"}}}}for(n=0,o=l.length;n<o;n++){l[n].call(this)}for(n=0,o=j.length;n<o;n++){j[n].call(this)}}};var e={subscribeV2:function(g,j,f){var i=a.util.obj.copyArray(j.items.peek());var h=e.itemsChanged(g,j,f);j.items.subscribe(function(){try{var k=ko.utils.compareArrays(i,arguments[0]||[]);h(k)}finally{i=a.util.obj.copyArray(j.items.peek())}})},subscribeV3:function(g,h,f){h.items.subscribe(e.itemsChanged(g,h,f),window,"arrayChange")},itemsChanged:d};a.ko.bindings.itemsControl={init:c,utils:e};ko.bindingHandlers.itemsControl={};ko.virtualElements.allowedBindings.itemsControl=true;for(var b in a.ko.bindings.itemsControl){if(b!=="utils"){ko.bindingHandlers.itemsControl[b]=a.ko.bindings.itemsControl[b]}}})();var a=a||{};a.ko=a.ko||{};a.ko.bindings=a.ko.bindings||{};(function(){var d=function(h,i,f,j,g){return ko.bindingHandlers.template.init.call(this,h,a.ko.bindings.render.utils.createValueAccessor(i),f,i(),g)};var e=function(j,l,g,m,h){var i=a.util.ko.peek(l());if((m&&!(m instanceof a.base.visual))||(i&&!(i instanceof a.base.visual))){throw"This binding can only be used to render a wo.visual within the context of a wo.visual"}if(i&&i._rootHtmlElement){throw"This visual has already been rendered"}if(i){ko.utils.domData.set(j,a.ko.bindings.wpfko.utils.wpfkoKey,i);i._rootHtmlElement=j;if(m){m.renderedChildren.push(i)}}var f=this;var k=function(){ko.bindingHandlers.template.update.call(f,j,a.ko.bindings.render.utils.createValueAccessor(l),g,i,h)};i.templateId.subscribe(k);k()};var b=function(f){return function(){var h=f();var g=ko.utils.unwrapObservable(h);return{name:g?g.templateId.peek():"",data:h||{},afterRender:g?a.base.visual._afterRendered:undefined}}};a.ko.bindings.render={init:d,update:e,utils:{createValueAccessor:b}};ko.bindingHandlers.render={};ko.virtualElements.allowedBindings.render=true;for(var c in a.ko.bindings.render){if(c!=="utils"){ko.bindingHandlers.render[c]=a.ko.bindings.render[c]}}ko.bindingHandlers.renderChild={init:ko.bindingHandlers.render.init,update:ko.bindingHandlers.render.update}})();var a=a||{};a.ko=a.ko||{};a.ko.bindings=a.ko.bindings||{};(function(){var d=function(g,j,e,l,f){if(ko.utils.domData.get(g,a.ko.bindings.wpfko.utils.wpfkoKey)){throw"This element is already bound to another model"}var i=j();if(!i){throw"Invalid view type"}var k=new i();if(!(k instanceof a.base.view)){throw"Invalid view type"}k.model(l);var h=ko.bindingHandlers.render.init.call(this,g,b(k),e,null,f);ko.bindingHandlers.render.update.call(this,g,b(k),e,null,f);return h};var b=function(e){return function(){return e}};a.ko.bindings.wpfko={init:d,utils:{createValueAccessor:b,wpfkoKey:"__wpfko"}};ko.bindingHandlers.wpfko={};ko.virtualElements.allowedBindings.wpfko=true;for(var c in a.ko.bindings.wpfko){if(c!=="utils"){ko.bindingHandlers.wpfko[c]=a.ko.bindings.wpfko[c]}}})();var a=a||{};a.template=a.template||{};(function(){var b=function(){};b.prototype=new ko.templateEngine();b.createJavaScriptEvaluatorFunction=function(c){return new Function("bindingContext","with(bindingContext) {\n\twith($data) {\n\t\treturn "+c+";\n\t}\n}")};b.createJavaScriptEvaluatorBlock=function(c){var d=b.newScriptId();if(c instanceof Function){b.scriptCache[d]=c}else{b.scriptCache[d]=b.createJavaScriptEvaluatorFunction(c)}return b.openCodeTag+d+b.closeCodeTag};b.prototype.createJavaScriptEvaluatorBlock=function(c){return b.createJavaScriptEvaluatorBlock(c)};b.prototype.isTemplateRewritten=function(d,e){if(d&&d.constructor===String){var c=document.getElementById(d);if(b.scriptHasBeenReWritten.test(c.textContent)){this.makeTemplateSource(d,e).data("isRewritten",true)}}return ko.templateEngine.prototype.isTemplateRewritten.apply(this,arguments)};b.prototype.renderTemplateSource=function(g,c,e){if(!(c.$data instanceof a.base.view)){return[]}var d=g.data("precompiled");if(!d){d=new a.template.xmlTemplate(g.text());g.data("precompiled",d)}var f;ko.dependentObservable(function(){d.rebuild(c);f=d.render(c)},this).dispose();return f};b.newScriptId=(function(){var c=Math.floor(Math.random()*10000);return function(){return(++c).toString()}})();b.scriptCache={};b.openCodeTag="<!-- wpfko_code: {";b.closeCodeTag="} -->";b.scriptHasBeenReWritten=RegExp(b.openCodeTag.replace("{","{")+"[0-9]+"+b.closeCodeTag.replace("}","}"));a.template.engine=b;ko.setTemplateEngine(new b())})();var a=a||{};a.template=a.template||{};(function(){var c=function(d){this.render=c.generateRender(d)};var b=function(h,d,e){for(var f=0,g=h.length;f<g;f++){d.call(e,h[f],f)}};c.elementHasModelBinding=function(d){for(var e=0,f=d.attributes.length;e<f;e++){if(d.attributes[e].nodeName==="model"||d.attributes[e].nodeName==="model-tw"){return true}}for(var e=0,f=d.childNodes.length;e<f;e++){if(d.childNodes[e].nodeType===1&&d.childNodes[e].nodeName==="model"){return true}}return false};c.constructorExists=function(d){d=d.split(".");var e=window;for(var f=0,g=d.length;f<g;f++){e=e[d[f]];if(!e){return false}}return e instanceof Function};c.generateRender=function(k){var g=a.template.engine.openCodeTag;var d=a.template.engine.closeCodeTag;var j=a.template.htmlBuilder.generateTemplate(k);var i,e;var h=[];while((i=j.indexOf(g))!==-1){h.push(j.substr(0,i));j=j.substr(i);e=j.indexOf(d);if(e===-1){throw"Invalid wpfko_code tag."}h.push((function(l){return function(m){return a.template.engine.scriptCache[l](m)}})(j.substr(g.length,e-g.length)));j=j.substr(e+d.length)}h.push(j);var f=h.length;return function(l){var m=[];var p=[];for(var n=0;n<f;n++){if(h[n] instanceof Function){var o=h[n](l);if(o instanceof a.template.switchBindingContext){if(o.bindingContext){m.push(l);l=o.bindingContext}else{l=m.pop()}}else{p.push(o)}}else{p.push(h[n])}}return a.util.html.createElements(p.join(""))}};c.renderFromMemo=function(d){return ko.memoization.memoize(function(h){var f=document.createComment(" ko ");var g=document.createComment(" /ko ");var i=a.util.ko.virtualElements.parentElement(h);ko.virtualElements.insertAfter(i,f,h);ko.virtualElements.insertAfter(i,g,f);var e=function(){return d.$data};a.ko.bindings.render.init(f,e,e,a.util.ko.peek(d.$parentContext.$data),d.$parentContext);a.ko.bindings.render.update(f,e,e,a.util.ko.peek(d.$parentContext.$data),d.$parentContext)})};c.emptySwitchBindingContext=function(d){return new a.template.switchBindingContext()};c.switchBindingContextToTemplateItem=function(d){return function(e){return new a.template.switchBindingContext(e.createChildContext(e.$data.templateItems[d]))}};c.generateTemplate=function(g,d){if(d){d+="."}else{d=""}var e=[];var f=new XMLSerializer();b(g.childNodes,function(j,l){if(a.template.xmlTemplate.isCustomElement(j)){var m=a.template.xmlTemplate.getId(j)||(d+l);e.push(a.template.engine.createJavaScriptEvaluatorBlock(c.switchBindingContextToTemplateItem(m)));e.push(a.template.engine.createJavaScriptEvaluatorBlock(c.renderFromMemo));e.push(a.template.engine.createJavaScriptEvaluatorBlock(c.emptySwitchBindingContext))}else{if(j.nodeType==1){var h=new DOMParser().parseFromString(f.serializeToString(j),"application/xml").documentElement;while(h.childNodes.length){h.removeChild(h.childNodes[0])}var k=a.util.html.createElement(f.serializeToString(h));k.innerHTML=a.template.htmlBuilder.generateTemplate(j,d+l);e.push(a.util.html.outerHTML(k))}else{if(j.nodeType===3){e.push(j.data)}else{e.push(f.serializeToString(j))}}}});return e.join("")};a.template.htmlBuilder=c})();var a=a||{};a.template=a.template||{};(function(){a.template.switchBindingContext=function(b){this.bindingContext=b}})();var a=a||{};a.template=a.template||{};(function(){var c=function(d){this._builders=[];this.elementsWithId=[];this._addBuilders(d)};c.prototype.addReferencedElements=function(e,d){b(this.elementsWithId,function(g){var f={childNodes:d};b(g.split("."),function(j,h){f=f.childNodes[parseInt(j)]});if(!f.id){throw"Unexpected exception, could not find element id"}e.templateItems[f.id]=f})};c.prototype._addBuilders=function(e,d){if(d){d+="."}else{d=""}b(e.childNodes,function(f,g){if(a.template.xmlTemplate.isCustomElement(f)){var h=a.template.xmlTemplate.getId(f)||(d+g);this._builders.push(function(i){i.$data.templateItems[h]=a.util.obj.createObject(f.nodeName);i.$data.templateItems[h].initialize(f,i.createChildContext(i.$data.templateItems[h]))})}else{if(f.nodeType==1){if(a.template.xmlTemplate.getId(f)){this.elementsWithId.push(d+g)}this._addBuilders(f,d+g)}}},this)};c.prototype.rebuild=function(d){for(var e in d.$data.templateItems){if(d.$data.templateItems[e] instanceof a.base.visual){d.$data.templateItems[e].dispose()}delete d.$data.templateItems[e]}for(var e=0,f=this._builders.length;e<f;e++){this._builders[e](d)}};var b=function(h,d,e){for(var f=0,g=h.length;f<g;f++){d.call(e,h[f],f)}};a.template.viewModelBuilder=c})();var a=a||{};a.template=a.template||{};(function(){var b=function(d){d=new DOMParser().parseFromString("<root>"+d+"</root>","application/xml").documentElement;if(d.firstChild&&d.firstChild.nodeName==="parsererror"){var c=new XMLSerializer();throw"Invalid xml template:\n"+c.serializeToString(d.firstChild)}this.viewModelBuilder=new a.template.viewModelBuilder(d);this.htmlBuilder=new a.template.htmlBuilder(d)};b.isCustomElement=function(c){return c.nodeType==1&&a.base.visual.reservedTags.indexOf(c.nodeName.toLowerCase())===-1};b.getId=function(e){for(var c=0,d=e.attributes.length;c<d;c++){if(e.attributes[c].nodeName==="id"){return e.attributes[c].value}}return null};b.prototype.render=function(c){var d=this.htmlBuilder.render(c);this.viewModelBuilder.addReferencedElements(c.$data,d);if(c.$data instanceof a.base.view){c.$data.onInitialized()}return d};b.prototype.rebuild=function(c){this.viewModelBuilder.rebuild(c)};a.template.xmlTemplate=b})();var a=a||{};a.util=a.util||{};(function(){var h=function(m){if(!m){return null}var n=m.nodeType===1?(i[m.tagName.toLowerCase()]||"div"):"div";var l=document.createElement(n);l.innerHTML=m.outerHTML;return l.innerHTML};var b=function(m){if(!m){return null}var n=document.createElement(i[g(m)]||"div");n.innerHTML=m;var l=n.firstChild;n.removeChild(l);return l};var k=/[a-zA-Z0-9]/;var g=function(n){n=n.replace(/^\s+|\s+$/g,"");if(!n||n[0]!=="<"){throw"Invalid html tag"}n=n.substring(1).replace(/^\s+|\s+$/g,"");for(var l=0,m=n.length;l<m;l++){if(!k.test(n[l])){break}}return n.substring(0,l)};var j=/<\!--[^>]*-->/g;var f=function(l){l=l.replace(j,"").replace(/^\s+|\s+$/g,"");var m=0;if((m=l.indexOf("<"))===-1){return null}return g(l.substring(m))};var i={td:"tr",th:"tr",tr:"tbody",tbody:"table",thead:"table",li:"ul"};var c=function(m){if(m==null){return null}var p=f(m)||"div";var o=i[g("<"+p+"/>")]||"div";m="<"+p+"></"+p+">"+m+"<"+p+"></"+p+">";var l=document.createElement(o);l.innerHTML=m;var n=[];while(l.firstChild){n.push(l.firstChild);l.removeChild(l.firstChild)}n.splice(0,1);n.splice(n.length-1,1);return n};var d=function(){var m=document.createComment(" ko ");var l=document.createComment(" /ko ");m.__wpfko={open:m,close:l,"delete":function(){var n=m.__wpfko.allElements();for(var o=0,p=n.length;o<p;o++){n[o].parentNode.removeChild(n[o])}},allElements:function(){var o=[];var n=m;while(true){o.push(n);if(n===l){break}n=n.nextSibling}return o},insertAfter:function(n){return l.nextSibling?l.parentNode.insertBefore(n,l.nextSibling):l.parentNode.appendChild(n)}};return m.__wpfko};var e=function(n){var l=[];if(a.util.ko.virtualElements.isVirtual(n)){var r=a.util.ko.virtualElements.parentElement(n);for(var o=0,p=r.childNodes.length;o<p;o++){if(r.childNodes[o]===n){break}}o++;for(var p=r.childNodes.length;o<p;o++){l.push(r.childNodes[o])}}else{l=n.childNodes}var q=[];var m=0;for(var o=0,p=l.length;o<p;o++){if(a.util.ko.virtualElements.isVirtualClosing(l[o])){m--;if(m<0){return q}continue}if(m>0){continue}q.push(l[o]);if(a.util.ko.virtualElements.isVirtual(l[o])){m++}}return q};a.util.html={specialTags:i,getFirstTagName:f,getTagName:g,getAllChildren:e,outerHTML:h,createElement:b,createElements:c,createWpfkoComment:d}})();var a=a||{};a.util=a.util||{};(function(){var b={};b.version=function(){if(!ko||!ko.version){return null}var e=ko.version.split(".");for(var c=0,d=e.length;c<d;c++){e[c]=parseInt(e[c])}return e};b.peek=function(c){if(ko.isObservable(c)){return c.peek()}else{return c}};b.array={diff:{added:"added",deleted:"deleted",retained:"retained"}};b.isObservableArray=function(c){return ko.isObservable(c)&&c.push&&c.push.constructor===Function};b.virtualElements={parentElement:function(d){var c=d.previousSibling;while(c){if(b.virtualElements.isVirtual(c)){return c}c=c.previousSibling}return d.parentNode},isVirtual:function(c){return c.nodeType===8&&c.nodeValue.replace(/^\s+/,"").indexOf("ko")===0},isVirtualClosing:function(c){return c.nodeType===8&&c.nodeValue.replace(/^\s+|\s+$/g,"")==="/ko"},elementWithChildren:function(e){if(!e){return[]}if(!b.virtualElements.isVirtual(e)){return[e]}var f=[e];var d=1;var c=e.nextSibling;while(d>0){f.push(c);if(b.virtualElements.isVirtualClosing(c)){d--}else{if(b.virtualElements.isVirtual(c)){d++}}c=c.nextSibling}return f}};a.util.ko=b})();var a=a||{};a.util=a.util||{};(function(){var c=function(f,g){if(!g){g=window}var e=f.split(".");for(var h=0,j=e.length;h<j;h++){g=g[e[h]];if(!g){throw'Cannot create object "'+f+'"'}}if(g instanceof Function){return new g()}else{throw f+" is not a valid function."}};var b=function(g){var h=[];for(var e=0,f=g.length;e<f;e++){h.push(g[e])}return h};var d=function(g,e,f){f=f||window;if(g==null){return}if(g instanceof Array){for(var h=0,j=g.length;h<j;h++){e.call(f,g[h],h)}}else{for(var h in g){e.call(f,g[h],h)}}};a.util.obj={enumerate:d,createObject:c,copyArray:b}})();window.wo=a.base})();