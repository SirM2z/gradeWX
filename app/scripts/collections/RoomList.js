/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.RoomList = Backbone.Collection.extend({

    model: App.Models.Room

  });

})();
