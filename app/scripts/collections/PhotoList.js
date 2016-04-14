/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.PhotoList = Backbone.Collection.extend({

    model: App.Models.Photo

  });

})();
