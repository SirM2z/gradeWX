/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Photo = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      picUrl: "",
      picId: 0,
      fileId: 0,
      checkTime: ""
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
