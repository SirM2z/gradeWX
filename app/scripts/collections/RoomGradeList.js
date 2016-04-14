/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.RoomGradeList = Backbone.Collection.extend({

    model: App.Models.RoomGrade

  });

})();
