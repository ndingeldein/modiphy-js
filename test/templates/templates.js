define(['handlebars.runtime'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['item-view'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<span class=\"field01\">"
    + alias3(((helper = (helper = helpers.field01 || (depth0 != null ? depth0.field01 : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"field01","hash":{},"data":data}) : helper)))
    + "</span><br><span class=\"field02\">"
    + alias3(((helper = (helper = helpers.field02 || (depth0 != null ? depth0.field02 : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"field02","hash":{},"data":data}) : helper)))
    + "</span>";
},"useData":true});
templates['mutant'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<span class=\"name\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n<span class=\"mutant-name\">"
    + alias3(((helper = (helper = helpers.mutantName || (depth0 != null ? depth0.mutantName : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"mutantName","hash":{},"data":data}) : helper)))
    + "</span>";
},"useData":true});
return templates;
});
