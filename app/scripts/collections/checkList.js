/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.CheckList = Backbone.Collection.extend({

    model: App.Models.Check

  });

})();
