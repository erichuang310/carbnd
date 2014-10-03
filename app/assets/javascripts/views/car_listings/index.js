Carbnd.Views.CarListingsIndex = Backbone.CompositeView.extend({
  template: JST["car_listings/index"],

  initialize: function () {
    this.addNavbar();
    this.addMap();
    this.addSearch();

    this.listenTo(this.collection, "add", this.addCarListing);
    this.listenTo(this.collection, "remove", this.removeCarListing);
    this.listenTo(this.collection, "sync", this.handleSpinner);
    var token = PubSub.subscribe( 'carListings query params updated', this.updateCarListings );
    var that = this;
    this.collection.each(function (carListing) {
      that.addCarListing(carListing);
    });
  },


  updateCarListings: function () {
    Carbnd.carListings.fetch({ data: Carbnd.searchParams })
  },

  handleSpinner: function () {
    if (this.collection.length > 0) {
      this.$spinner.hide();
    } else {
      this.$spinner.show();
    }
  },

  addNavbar: function () {
    var navbarView = new Carbnd.Views.LayoutsNavbar();
    this.addSubview("#nav", navbarView);
  },

  addMap: function () {
    if (Carbnd.searchParams && Carbnd.searchParams.lat && Carbnd.searchParams.lng) {
      var lat = Carbnd.searchParams.lat;
      var lng = Carbnd.searchParams.lng;
    } else {
      var lat = 37.7749295;
      var lng = -122.41941550000001;
    }

    var mapView = new Carbnd.Views.SearchMap({
      lat: lat,
      lng: lng
    });
    this.addSubview("#map-container", mapView);
  },

  addSearch: function () {
    var searchFormView = new Carbnd.Views.SearchForm();
    this.addSubview("#search", searchFormView);
  },

  addCarListing: function (carListing) {
    var carListingView = new Carbnd.Views.CarListingItem({ model: carListing });
    this.addSubview("#car-listings", carListingView);
    PubSub.publish('car-listings', carListingView);
  },

  removeCarListing: function (carListing) {
    var subview = _.find(
      this.subviews("#car-listings"),
      function (subview) {
        return subview.model === carListing;
      }
    );
    PubSub.publish('remove-car-listing', carListing);
    this.removeSubview("#car-listings", subview);
  },

  render: function () {
    var renderedContent = this.template({ carListings: this.collection });
    this.$el.html(renderedContent);
    this.attachSubviews();
    this.$spinner = this.$(".scene");

    return this;
  }
});
