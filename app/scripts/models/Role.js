/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Role = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      title: "",
      itemId: 0,
      fid: 0,
      fullmark: 0,
      listOrder: 0,
      subNodes: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
