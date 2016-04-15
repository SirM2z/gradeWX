/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.FloorList = Backbone.Collection.extend({

    model: App.Models.Floor

  });

})();
