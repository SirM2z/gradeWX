/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.LiveArea = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      title: '',
      liveAreaId: '',
      listOrder: 1,
      flatList: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
