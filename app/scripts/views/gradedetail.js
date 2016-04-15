/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Gradedetail = Backbone.View.extend({

    template: JST['app/scripts/templates/gradedetail.ejs'],

    tagName: 'div',

    el: '#gradedetail',
    
    ajaxGetNum:0,
    
    ajaxGetCurrent:0,

    events: {
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      this.ajaxGetNum=2;
      this.ajaxGetCurrent=0;
      //获取该寝室所有打分信息
      this.getRoomAllDetailGrade();
      
      //this.render();
    },

    render: function () {
      var roleList = null;
      if(App.g.roleList){
        roleList=App.g.roleList.toJSON();
      }
      var roomGradeList = null;
      if(App.g.roomGradeList){
        roomGradeList=App.g.roomGradeList.toJSON();
      }
      var photoList = null;
      if(App.g.photoList){
        photoList=App.g.photoList.toJSON();
      }
      var roleDetailList = null;
      if(App.g.roleDetailList){
        roleDetailList=App.g.roleDetailList.toJSON();
      }
      var bedList=null;
      if(App.g.bedList){
        bedList=App.g.bedList.toJSON();
      }
      
      this.$el.html(this.template({
        type:App.g.type,
        typeData:App.g.typeData,
        roomGradeList:roomGradeList,
        roleList:roleList,
        roleDetailList:roleDetailList,
        bedList:bedList,
        photoList:photoList,
        roomName:App.g.roomName
      }));
      
      this.tab = new fz.Scroll('.gradedetail-tab', {
        role: 'tab'
      });
      //重置tab的Scroll事件
      this.tab._resize();
    },
    
    getRoomAllDetailGrade:function(){
      //获取床位打分信息--含床位信息
      App.loading(true);
      var _selfthis=this;
      var url='';
      if(App.g.type=='day'){
        url=App.URL.getDayBedGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&date='+ App.g.typeData;
      }
      else if(App.g.type=='week'){
        url=App.URL.getWeekBedGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&semesterid='+ App.g.semesterId + '&currentweek='+ App.g.typeData;
      }
      else if(App.g.type=='month'){
        url=App.URL.getMonthBedGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&date='+ App.g.typeData;
      }
      //获取床位打分信息
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.bedList = new App.Collections.BedList();
            for(var i=0,ilen=result.data.length;i<ilen;i++){
              App.g.bedList.push(result.data[i]);
            }
            if(App.g.addOrEdit==1){
              //获取寝室打分信息
              _selfthis.getRoomGradeDetail();
              return;
            }
            App.loading();
            _selfthis.render();
                
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
            content: '获取床位信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    getRoomGradeDetail:function(){
      var _selfthis=this;
      var url='';
      if(App.g.type=='day'){
        url=App.URL.getDayRoomGradeDetail + '?token=' + App.g.token + '&roomscoreid='+ App.g.roomscoreid;
      }
      else if(App.g.type=='week'){
        url=App.URL.getWeekRoomGradeDetail + '?token=' + App.g.token + '&roomscoreid='+ App.g.roomscoreid;
      }
      else if(App.g.type=='month'){
        url=App.URL.getMonthRoomGradeDetail + '?token=' + App.g.token + '&roomscoreid='+ App.g.roomscoreid;
      }
      //获取寝室打分信息
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.roomGradeList = new App.Collections.RoomGradeList();
            for(var i=0,ilen=result.data.length;i<ilen;i++){
              App.g.roomGradeList.push(result.data[i]);
            }
            
            //获取违章分
            _selfthis.getRoleGrade();
            //获取上传照片
            _selfthis.getPhotoGrade();
            
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
            content: '获取床位信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    getRoleGrade:function(){
      var url=App.URL.getRoleBySpecialid + '?token=' + App.g.token + '&schoolcode='+ App.g.schoolcode + '&specialid=';
      var _selfthis=this;
      var specialid='';
      if(App.g.type=='day'){
        specialid+=App.g.roomid+'-'+App.g.typeData;
        url += specialid;
      }
      else if(App.g.type=='week'){
        specialid+=App.g.roomid+'-'+App.g.semesterId+'-'+App.g.typeData;
        url += specialid;
      }
      else if(App.g.type=='month'){
        specialid+=App.g.roomid+'-'+App.g.typeData;
        url += specialid;
      }
      $.ajax({
        url:url,
        type:'GET',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            App.g.roleDetailList = new App.Collections.RoleDetailList();
            for(var i=0,ilen=result.list.length;i<ilen;i++){
              App.g.roleDetailList.push(result.list[i]);
            }
            _selfthis.ajaxGetCurrent++;
            _selfthis.countGetAjax();
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
            content:'获取寝室违章信息失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    getPhotoGrade:function(){
      var url='';
      var _selfthis=this;
      if(App.g.type=='day'){
        url=App.URL.getDayPhotoGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&date='+ App.g.typeData;
      }
      else if(App.g.type=='week'){
        url=App.URL.getWeekPhotoGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&semesterid='+ App.g.semesterid + '&currentweek='+ App.g.typeData;
      }
      else if(App.g.type=='month'){
        url=App.URL.getMonthPhotoGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&date='+ App.g.typeData;
      }
      $.ajax({
        url:url,
        type:'GET',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            App.g.photoList = new App.Collections.PhotoList();
            for(var i=0,ilen=result.data.length;i<ilen;i++){
              App.g.photoList.push(result.data[i]);
            }
            _selfthis.ajaxGetCurrent++;
            _selfthis.countGetAjax();
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
            content:'获取照片信息失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    countGetAjax:function(){
      if(this.ajaxGetCurrent==this.ajaxGetNum){
        App.loading();
        this.render();
      }
    }
    

  });

})();
