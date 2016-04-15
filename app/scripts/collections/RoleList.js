/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.RoleList = Backbone.Collection.extend({

    model: App.Models.Role

  });

})();
