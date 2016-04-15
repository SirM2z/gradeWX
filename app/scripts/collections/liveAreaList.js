/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.LiveAreaList = Backbone.Collection.extend({

    model: App.Models.LiveArea

  });

})();
