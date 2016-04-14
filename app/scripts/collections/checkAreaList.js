/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.CheckAreaList = Backbone.Collection.extend({

    model: App.Models.CheckArea

  });

})();
