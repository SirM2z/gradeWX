/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.RoleDetail = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      itemId: 1,
      itemName: '',
      list: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
