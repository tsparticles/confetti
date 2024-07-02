(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['confetti-modes'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <div class=\"container\">\n    <div class=\"group\" data-name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":3,"column":34},"end":{"line":3,"column":40}}}) : helper)))
    + "\">\n      <div class=\"flex-rows\">\n        <div class=\"left\">\n          <h2><a href=\"#"
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":6,"column":24},"end":{"line":6,"column":30}}}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":6,"column":36},"end":{"line":6,"column":42}}}) : helper)))
    + "\" class=\"anchor\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":6,"column":59},"end":{"line":6,"column":67}}}) : helper)))
    + "</a></h2>\n          <button class=\"run\">\n            Run\n            <span class=\"icon\">\n              <svg class=\"icon\"><use xlink:href=\"#run\"></use></svg>\n            </span>\n          </button>\n        </div>\n        <div class=\"description\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"description") : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":10},"end":{"line":19,"column":19}}})) != null ? stack1 : "")
    + "        </div>\n      </div>\n      <div class=\"editor\"></div>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,lookupProperty(helpers,"isCustom").call(alias1,(depth0 != null ? lookupProperty(depth0,"id") : depth0),{"name":"isCustom","hash":{},"data":data,"loc":{"start":{"line":23,"column":12},"end":{"line":23,"column":25}}}),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":6},"end":{"line":31,"column":13}}})) != null ? stack1 : "")
    + "    </div>\n  </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <p class=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"cssClass") || (depth0 != null ? lookupProperty(depth0,"cssClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cssClass","hash":{},"data":data,"loc":{"start":{"line":16,"column":22},"end":{"line":16,"column":34}}}) : helper)))
    + "\">\n              "
    + alias4(((helper = (helper = lookupProperty(helpers,"text") || (depth0 != null ? lookupProperty(depth0,"text") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data,"loc":{"start":{"line":17,"column":14},"end":{"line":17,"column":22}}}) : helper)))
    + "\n            </p>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "        <div class=\"flex-rows\">\n          <canvas\n            id=\"my-canvas\"\n            style=\"width: 100%; height: 380px; max-width: 1000px\"\n            class=\"custom-canvas\"\n          ></canvas>\n        </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"modes") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":34,"column":9}}})) != null ? stack1 : "");
},"useData":true});
})();