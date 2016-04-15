/*global App, Backbone*/

App.Routers = App.Routers || {};

(function () {
  'use strict';

  App.Routers.Route = Backbone.Router.extend({
    routes: {
      '':'login',
      'login':'login',
      'index':'index',
      'gradetype':'gradetype',
      'givegrade':'givegrade',
      'bindroom/:schoolcode':'bindroom',
      'checkgrade':'checkgrade',
      'gradedetail':'gradedetail',
      '*error' : 'login'
    },
    index: function(){
      App.loading(true);
      var _selfthis=this;
      var type=null;
      var url='';
      if(App.g.type=='week'){
        type=0;
        url+=App.URL.getGradeTable + '?schoolcode='+ App.g.schoolcode +'&token='+ App.g.token +'&type=0&isopen=1';
      }else if(App.g.type=='day'){
        type=1;
        url+=App.URL.getGradeTable + '?schoolcode='+ App.g.schoolcode +'&token='+ App.g.token +'&type=1&isopen=1';
      }else if(App.g.type=='month'){
        type=2;
        url+=App.URL.getGradeTable + '?schoolcode='+ App.g.schoolcode +'&token='+ App.g.token +'&type=2&isopen=1';
      }else if(App.g.type=='check'){
        type=3;
        url+=App.URL.getGradeTableByTableid + '?schoolcode='+ App.g.schoolcode +'&token='+ App.g.token +'&tableid='+ App.g.checkTableid;
      }
      if(!type && type!=0){
        $.tips({
          content: '时间信息不完整，请重试！',
          stayTime: 2000,
          type: "warn"
        });
        Backbone.history.navigate('#', {trigger: true});
        App.loading();
        return;
      }
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            if(result.data.length==0){
              new App.Views.Index();
              _selfthis.hidesection();
              $('#index').removeClass('hide');
              App.g.gradeTableId = -1;
              App.g.gradeTableList = null;
              return;
            }
            App.g.gradeTableId = result.data[0].tableId;
            App.g.gradeTableList = new App.Collections.GradeTableList();
            //console.log(result.data.typeList);
            if(result.data[0].typeList[0]){
              App.g.gradeTableList.push(result.data[0].typeList[0]);
              App.g.roomTypeId=result.data[0].typeList[0].typeId;
            }
            if(result.data[0].typeList[1]){
              App.g.gradeTableList.push(result.data[0].typeList[1]);
              App.g.bedTypeId=result.data[0].typeList[1].typeId;
            }
            new App.Views.Index();
            _selfthis.hidesection();
            $('#index').removeClass('hide');
          } else {
            $.tips({
              content: result.msg,
              stayTime: 2000,
              type: "warn"
            });
          }
          App.loading();
        }, error: function error() {
          $.tips({
            content: '获取打分表信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    login: function(){
      new App.Views.Login();
      this.hidesection();
      $('#login').removeClass('hide');
    },
    gradetype: function(){
      new App.Views.Gradetype();
      this.hidesection();
      $('#gradetype').removeClass('hide');
    },
    givegrade: function(){
      new App.Views.Givegrade();
      this.hidesection();
      $('#givegrade').removeClass('hide');
    },
    bindroom: function(schoolcode){
      App.g.schoolcode=schoolcode;
      App.g.token='fdsfdsfdsaf1312321';
      //console.log(schoolcode);
      new App.Views.BindRoome();
      this.hidesection();
      $('#bindroom').removeClass('hide');
    },
    checkgrade: function(){
      new App.Views.Checkgrade();
      this.hidesection();
      $('#checkgrade').removeClass('hide');
    },
    gradedetail: function(){
      new App.Views.Gradedetail();
      this.hidesection();
      $('#gradedetail').removeClass('hide');
    },
    hidesection: function(){
      $('section').each(function(){
        $(this).addClass('hide')
      })
    }
  });

})();
