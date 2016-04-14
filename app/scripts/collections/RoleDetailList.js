/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.RoleDetailList = Backbone.Collection.extend({

    model: App.Models.RoleDetail

  });

})();
