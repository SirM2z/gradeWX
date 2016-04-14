/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Bed = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      bedName: '',
      bedId: '',
      studentName: '',
      studentNumber: '',
      studentKey: '',
      totalScore: 0,
      itemList: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
