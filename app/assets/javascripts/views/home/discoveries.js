Carbnd.Views.HomeDiscoveries = Backbone.CompositeView.extend({
  template: JST["home/discoveries"],
  tagName: "section",
  id: "discoveries",
  className: "container",

  render: function () {
    var renderedContent = this.template();
    this.$el.html(renderedContent);

    return this;
  }
});
