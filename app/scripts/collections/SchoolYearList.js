/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.SchoolYearList = Backbone.Collection.extend({

    model: App.Models.Schoolyear

  });

})();
