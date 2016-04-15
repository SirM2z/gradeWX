/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.GradeTableList = Backbone.Collection.extend({

    model: App.Models.GradeTable

  });

})();
