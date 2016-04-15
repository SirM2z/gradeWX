/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Gradesettings = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      isOpenBed: 0, //	0表示关闭床位 1表示开启床位
      week: 0,  //	周打分 0表示开启 1表示关闭
      month: 0, //月打分 0表示开启 1表示关闭
      day: 0, //	日打分 0表示开启 1表示关闭
      bed: 0, //	床位分 0表示开启 1表示关闭
      pass: 0,  //	免检 0表示开启 1表示关闭
      photo: 0, //	开启拍照 0表示开启 1表示关闭
      takePhoto: 0, //	是否必拍 0表示必拍 1表示否
      role: 0,  //	违章管理 0表示开启 1表示关闭
      check: 0,  //抽查 0表示开启 1表示关闭
      nodeIds: 0,  //权限列表
      roleId:0, //角色id
      weekCompetence:1,  //周打分功能 0表示开启 1表示关闭
      weekGradeCompetence:1,  //周打分权限 0表示开启 1表示关闭
      dayCompetence:1,  //日打分功能 0表示开启 1表示关闭
      dayGradeCompetence:1,  //日打分权限 0表示开启 1表示关闭
      monthCompetence:1,  //月打分功能 0表示开启 1表示关闭
      monthGradeCompetence:1,  //月打分权限 0表示开启 1表示关闭
      checkCompetence:1,  //抽查打分功能 0表示开启 1表示关闭
      checkGradeCompetence:1  //抽查打分权限 0表示开启 1表示关闭
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
