/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.CheckArea = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      areaId: '',
      areaName: '',
      listFla: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
