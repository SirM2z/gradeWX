/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.CheckArea = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      flatList: [],
      listOrder: 1,
      liveAreaId: '',
      title: ''
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
