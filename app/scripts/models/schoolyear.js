/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Schoolyear = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      year: '',
      schoolYearId: '',
      schoolYearName : '',
      semesterList: [{
          semesterId: '',
          semesterName: '',
          isCurrent: 0,
          currentWeek: 0,
          semesterType: '',
          startTime: '',
          endTime: '',
          countweek: 1
      },
      {
          semesterId: '',
          semesterName: '',
          isCurrent: 0,
          currentWeek: 0,
          semesterType: '',
          startTime: '',
          endTime: '',
          countweek: 1
      }]
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
