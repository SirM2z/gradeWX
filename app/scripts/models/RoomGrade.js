/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.RoomGrade = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      typeName: "",
      itemList: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
