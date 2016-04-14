/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Usermodel = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      id : 0,
      userName : ''
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
