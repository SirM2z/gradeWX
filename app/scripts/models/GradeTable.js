/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.GradeTable = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      typeId: 0,
      title: "",
      standardType: 0,
      passValue: 0,
      beetterValue: 0,
      passContinuity: 0,
      passNumber: 0,
      listOrder: 0,
      itemList: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
