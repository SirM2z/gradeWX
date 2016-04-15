/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Check = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      checkId: 0,
      startTime: '',
      endTime: '',
      title: '',
      nature: '',
      keyWord: '',
      roleIds: '',
      tableId: 0,
      semesterId: '',
      flatIds: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
