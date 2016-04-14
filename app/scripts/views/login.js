/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Login = Backbone.View.extend({

    template: JST['app/scripts/templates/login.ejs'],

    tagName: 'div',
    
    el: '#login',

    events: {
      'click .ui-form .ui-btn-wrap .login-btn':'login',
      'click .ui-icon-close':'closeInput'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      
      if(localStorage.apartmentUsername){
        App.g.username=localStorage.apartmentUsername;
        App.g.password=localStorage.apartmentPassword;
      }
      
      this.$el.off();
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        username:App.g.username,
        password:App.g.password
      }));
    },
    
    login: function(){
      var _selfthis=this;
      var username = $('#username'),password = $('#password');
      //username.val('zjslsj');
      //password.val('zjslsj');
      if(username.val().trim().length<1){
        $.tips({
          content:'请填写账号！',
          stayTime:2000,
          type:"warn"
        });
        username.focus();
        return;
      }else if(password.val().trim().length<1){
        $.tips({
          content:'请填写密码！',
          stayTime:2000,
          type:"warn"
        });
        password.focus();
        return;
      }
      App.loading(true);
      
      $.ajax({
        url:App.URL.login,
        data:{
          useraccount:username.val().trim(),
          password:password.val().trim(),
          openid:App.g.openid
        },
        type:'POST',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            App.g.username=username.val().trim();
            App.g.password=password.val().trim();
            localStorage.apartmentUsername=App.g.username;
            localStorage.apartmentPassword=App.g.password;
            App.g.token = result.data.token;
            App.g.schoolcode = result.data.schoolCode;
            App.g.user = new App.Models.Usermodel({openid:App.openid,userName:result.data.userName});
            App.g.gradesetting = new App.Models.Gradesettings({
              isOpenBed: result.data.isOpenBed,
              week: result.data.week,
              month: result.data.month,
              day: result.data.day,
              bed: result.data.bed,
              pass: result.data.pass,
              photo: result.data.photo,
              takePhoto: result.data.takePhoto,
              role: result.data.role,
              check: result.data.check,
              nodeIds:result.data.nodeIds,
              roleId:result.data.roleId
            });
            
            //判断功能权限
            var nodeIdArry=result.data.nodeIds.split(',');
            var nodeNum=1;
            if(nodeIdArry.indexOf(App.Competence.week)>=0){
              nodeNum++;
              App.g.gradesetting.set({weekCompetence:0});
            }
            if(nodeIdArry.indexOf(App.Competence.day)>=0){
              nodeNum++;
              App.g.gradesetting.set({dayCompetence:0});
            }
            if(nodeIdArry.indexOf(App.Competence.month)>=0){
              nodeNum++;
              App.g.gradesetting.set({monthCompetence:0});
            }
            if(nodeIdArry.indexOf(App.Competence.check)>=0){
              nodeNum++;
              App.g.gradesetting.set({checkCompetence:0});
            }
            if(nodeNum==0){
              App.loading();
              Backbone.history.navigate('#', {trigger: true});
              $.tips({
                content:'该账户暂无打分权限，请联系管理员',
                stayTime:2000,
                type:"warn"
              });
              return;
            }
            if(nodeIdArry.indexOf(App.Competence.weekGrade)>=0){
              App.g.gradesetting.set({weekGradeCompetence:0});
            }
            if(nodeIdArry.indexOf(App.Competence.dayGrade)>=0){
              App.g.gradesetting.set({dayGradeCompetence:0});
            }
            if(nodeIdArry.indexOf(App.Competence.monthGrade)>=0){
              App.g.gradesetting.set({monthGradeCompetence:0});
            }
            if(nodeIdArry.indexOf(App.Competence.checkGrade)>=0){
              App.g.gradesetting.set({checkGradeCompetence:0});
            }
            _selfthis.getLiveAreaList();//获取生活区列表
            
          }else{
            $.tips({
              content:result.msg,
              stayTime:2000,
              type:"warn"
            });
            App.loading();
          }
        },error:function(){
          $.tips({
            content:'登录失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    //获取生活区列表
    getLiveAreaList: function(){
      var _selfthis=this;
      $.ajax({
        url: App.URL.getAllFloor + '?schoolcode='+ App.g.schoolcode +'&token='+ App.g.token,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.liveAreaList = new App.Collections.LiveAreaList();
            for(var i=0,ilen=result.data.cmpusList.length;i<ilen;i++){
              for(var j=0,jlen=result.data.cmpusList[i].liveAreaList.length;j<jlen;j++){
                App.g.liveAreaList.push(result.data.cmpusList[i].liveAreaList[j]);
              }
            }
            
            _selfthis.getRoleList();//获取违章项目列表
            
          } else {
            $.tips({
              content: result.msg,
              stayTime: 2000,
              type: "warn"
            });
            App.loading();
          }
        }, error: function error() {
          $.tips({
            content: '获取生活区信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    //获取违章项目列表--只管第一级不管子集
    getRoleList: function(){
      if(App.g.gradesetting.get('role')==1){
        Backbone.history.navigate('#gradetype', {trigger: true});
        App.loading();
        return;
      }
      var _selfthis=this;
      $.ajax({
        url: App.URL.getRoleList + '?schoolcode='+ App.g.schoolcode +'&token='+ App.g.token,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.roleList = new App.Collections.RoleList();
            for(var i=0,ilen=result.data.length;i<ilen;i++){
              for(var j=0,jlen=result.data[i].subNodes.length;j<jlen;j++){
                App.g.roleList.push(result.data[i].subNodes[j]);
              }
            }
            
            Backbone.history.navigate('#gradetype', {trigger: true});
            App.loading();
            
          } else {
            $.tips({
              content: result.msg,
              stayTime: 2000,
              type: "warn"
            });
            App.loading();
          }
        }, error: function error() {
          $.tips({
            content: '获取违章项目失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    closeInput: function(event){
      event.preventDefault();
      var _this=$(event.target);
      _this.prev().val('');
    }

  });

})();
