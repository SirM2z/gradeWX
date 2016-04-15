/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.BedList = Backbone.Collection.extend({

    model: App.Models.Bed

  });

})();
