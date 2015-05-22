compiler.registerClass("wipeoutDocs.models.descriptions.property", "wipeoutDocs.models.descriptions.classItem", function() {
    var property = function(constructorFunction, propertyName, classFullName, isStatic) {
		
        this._super(propertyName, property.getPropertySummary(constructorFunction, propertyName, classFullName), isStatic);
        
        this.propertyName = propertyName;
        this.classFullName = classFullName;
        
        this.title = this.propertyName;
        
        var xml = property.getPropertySummaryXml(constructorFunction, propertyName, classFullName);
        this.propertyType = xml ? property.getPropertyType(xml) : null;
                
        this.computed("fullyQualifiedName", function() {
            return this.classFullName + "." + this.propertyName;
        });
    };
    
    var summary = /^\/\/\/<[sS]ummary\s*type=".+".*>.*<\/[sS]ummary>/;
    property.getPropertySummary = function(constructorFunction, propertyName, classFullName) {
        return (property.getPropertySummaryXml(constructorFunction, propertyName, classFullName) || {}).innerHTML;
    };
    
    property.getPropertySummaryXml = function(constructorFunction, propertyName, classFullName) {
        var result;
        if(result = property.getPropertyDescriptionOverride(classFullName + "." + propertyName))
            return new DOMParser().parseFromString(typeof result === "string" ? result : result.description, "application/xml").documentElement;
        
        constructorFunction = constructorFunction.toString();
                
        var search = function(regex) {
            var i = constructorFunction.search(regex);
            if(i !== -1) {
                var func = constructorFunction.substring(0, i);
                var lastLine = func.lastIndexOf("\n");
                if(lastLine > 0) {
                    func = func.substring(lastLine);
                } 
                
                func = func.replace(/^\s+|\s+$/g, '');
                if(summary.test(func)) {
                    return new DOMParser().parseFromString(func.substring(3), "application/xml").documentElement;
                } else {
                    return null;
                }
            }
        }
         
        result = search(new RegExp("\\s*this\\s*\\.\\s*" + propertyName.replace("$", "\\$") + "\\s*="));
        if(result)
            return result;
                
        return search(new RegExp("\\s*this\\s*\\[\\s*\"" + propertyName.replace("$", "\\$") + "\"\\s*\\]\\s*="));
    };
            
    property.getPropertyType = function(xmlDefinition) {
        
        var generics = [];

        var tmp;
        var g = "generic";
        for(var i = 0; tmp = xmlDefinition.getAttribute(g + i); i++) {
            generics.push(tmp);
        }

        return {
            type: xmlDefinition.getAttribute("type"),
            genericTypes: generics
        };  
    };   
    
    property.getPropertyDescriptionOverride = function(classDelimitedPropertyName) {
        
        var current = property.descriptionOverrides;
        enumerate(classDelimitedPropertyName.split("."), function(item) {
            if(!current) return;
            current = current[item];
        });
        
        return current;
    };
	
	property.descriptionOverrides = {
		orienteer: {
			useVirtualCache: {
				description: "<summary type=\"Boolean\">If set to true, pointers to methods called using \"_super\" are cached for faster lookup in the future. Default: true</summary>"
			}
		},
		busybody: {
			callbacks: {
				changeCallback: {
					dispose: "<summary type=\"Object\">A flag to indicate that this flag should be disposed of</summary>"
				}
			},
			utils: {
				observeCycleHandler: {
					instance: "<summary type=\"busybody.utils.observeCycleHandler\">The working observe cycle handler</summary>"
				}
			}
		},
		wipeout: {
			wml: {
				wmlParser: {
					specialTags: "<summary type=\"Object\">Dictionary of tags which cannot be placed within a div, along with the tags they can be placed within</summary>",
					cannotCreateTags: "<summary type=\"Object\">Dictionary of tags which cannot be created by the wipeout template engine</summary>",
					ieReadonlyElements: "<summary type=\"Object\">Dictionary of tags which are readonly once created in IE</summary>"
				}
			},
			template: {
				engine: {
					instance: "<summary type=\"wipeout.template.engine\">The current template engine</summary>"
				}
			},
			settings: {
				asynchronousTemplates: "<summary type=\"Boolean\">Try to load templates from a URL if the template id cannot be found within the DOM</summary>",
				displayWarnings: "<summary type=\"Boolean\">Display wipeout warnings</summary>",
				useElementClassName: "<summary type=\"Object\">Setting this will revert to old HTML class attribute functionality. Exposed for testing purposes only.</summary>"
			},
			utils: {
				find: {
					regex: "<summary type=\"Object\">Collection of regexes used by find.</summary>"
				}
			},
			viewModels: {
				itemsControl: {
					removeItem: "<summary type=\"wo.routedEvent\">If caught by an itemsControl, remove the item in the args from the itemsControl items</summary>"
				}
			}
		},
		wo: {
			bindings:  "<summary type=\"Object\">Collection of wipeout bindings.</summary>"
		}
	};
        
    /*property.descriptionOverrides = {
        wo: {},
        wipeout: {
            base: {
                itemsControl: {
                    removeItem: {
                        description: "<summary type=\"wo.routedEvent\">Routed event. Signals that the model in the routed event args is to be removed from the catching itemsControl</summary>"
                    }
                },
                "if": {
                    blankTemplateId: {
                        description: "<summary type=\"Object\">An id for a blank template.</summary>"
                    }
                },
                visual: {
                    reservedTags: {
                        description: "<summary type=\"Object\">A dictionary of html tags which wipeout will ignore. For example div and span.</summary>"
                    }
                },
                object: {
                    useVirtualCache: {
                        description: "<summary type=\"Boolean\">If set to true, pointers to methods called using \"_super\" are cached for faster lookup in the future. Default: true</summary>"
                    }
                },
                view: {
                    objectParser: {
                        description: "<summary type=\"Object\">A collection of objects to parse from string. These correspond to a the \"constructor\" property used in setting property types. Custom parsers can be added to this list</summary>"
                    },
                    reservedPropertyNames: {
                        description: "<summary type=\"Array\">A list of property names which are not bound or are bound in a different way, e.g. \"constructor\" and \"id\"</summary>"
                    }
                }
            },
            bindings: {
                bindingBase: {
                    dataKey: {
                        description: "<summary type=\"String\">A key for dom data related to wipeout bindings</summary>"
                    },
                    registered: {
                        description: "<summary type=\"Object\">A cache of all bindings created</summary>"
                    }
                },
                itemsControl: {
                    utils: {
                        description: "<summary type=\"Object\">Utils used by the itemsControl binding</summary>"                            
                    }
                },
                wipeout: {
                    utils: {
                        description: "<summary type=\"Object\">Utils used by the wipeout binding</summary>"                            
                    }
                },
                'wipeout-type': {
                    utils: {
                        description: "<summary type=\"Object\">Utils used by the wipeout-type binding</summary>"
                    }
                }
            },
            template: {
                asyncLoader: {                    
                    instance: {
                        description: "<summary type=\"wipeout.template.asyncLoader\">A static instance of the async loader</summary>"
                    }
                },
                engine: {
                    closeCodeTag: { 
                        description: "<summary type=\"String\">Signifies the end of a wipeout code block: \"" + wipeout.template.engine.closeCodeTag.replace("<", "&lt;").replace(">", "&gt;") + "\".</summary>"
                    },
                    instance: { 
                        description: "<summary type=\"wipeout.template.engin\">An instance of a wipeout.template.engine which is used by the render binding.</summary>"
                    },
                    openCodeTag: { 
                        description: "<summary type=\"String\">Signifies the beginning of a wipeout code block: \"" + wipeout.template.engine.openCodeTag.replace("<", "&lt;").replace(">", "&gt;") + "\".</summary>"
                    },
                    scriptCache: { 
                        description: "<summary type=\"Object\">A placeholder for precompiled scripts.</summary>"
                    },
                    scriptHasBeenReWritten: { 
                        description: "<summary type=\"Regexp\">Regex to determine whether knockout has rewritten a template.</summary>"
                    },
                    xmlCache: { 
                        description: "<summary type=\"Object\">A repository for processed templates.</summary>"
                    },
                    prototype: {
                        isTemplateRewritten: {
                            description: "<summary type=\"\">A knockout native function</summary>"
                        },
                        makeTemplateSource: {
                            description: "<summary type=\"\">A knockout native function</summary>"
                        },
                        renderTemplate: {
                            description: "<summary type=\"\">A knockout native function</summary>"
                        }
                    }
                }
            },
            utils: {
                find: {
                    regex: {
                        description: "<summary type=\"Object\">Regular expressions used by $find</summary>"
                    }
                },
                html: {
                    cannotCreateTags: {
                        description: "<summary type=\"Object\">A list of html tags which wipeout refuses to create, for example \"html\".</summary>"
                    },
                    specialTags: {
                        description: "<summary type=\"Object\">A list of html tags which cannot be placed inside a div element.</summary>"
                    }
                },
                ko: {
                    array: {
                        description: "<summary type=\"Object\">Items needed to deal with knockout arrays.</summary>"
                    }
                }
            }
        }
    };
    
    for(var i in property.descriptionOverrides.wipeout.base)
        property.descriptionOverrides.wo[i] = property.descriptionOverrides.wipeout.base[i];
    
    for(var i in property.descriptionOverrides.wipeout.utils)
        property.descriptionOverrides.wo[i] = property.descriptionOverrides.wipeout.utils[i];
    */
    return property;  
}); 