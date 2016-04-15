/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Room = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      floorName: "",
      listOrder: "",
      floorId: "",
      roomNum: "",
      bedNum: "",
      typeId: "",
      floorType: "",
      memo: "",
      roomList: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
