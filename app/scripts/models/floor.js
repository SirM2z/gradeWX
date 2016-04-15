/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Floor = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      floorName: "",
      roomNumber: 0,
      notRoomNumber: 0,
      average: 0,
      roomList: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
