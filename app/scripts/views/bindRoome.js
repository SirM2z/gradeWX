/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.BindRoome = Backbone.View.extend({

    template: JST['app/scripts/templates/bindRoome.ejs'],

    tagName: 'div',

    el: '#bindroom',
    
    liveAreaList:null,
    
    roomList:null,

    events: {
      'click .bind-btn':'gocheckgrade',
      'change .livearealist-select':'areaListSelect',
      'change .ban-select':'banSelect',
      'change .floor-select':'floorSelect',
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      if(localStorage.apartmentGiveGradeWXLiveAreaId){
        App.g.liveAreaId=localStorage.apartmentGiveGradeWXLiveAreaId;
        App.g.liveAreaName=localStorage.apartmentGiveGradeWXLiveAreaName;
        App.g.flatid=localStorage.apartmentGiveGradeWXFlatid;
        App.g.flatName=localStorage.apartmentGiveGradeWXFlatName;
        App.g.floorid=localStorage.apartmentGiveGradeWXFloorid;
        App.g.floorName=localStorage.apartmentGiveGradeWXFloorName;
        App.g.roomid=localStorage.apartmentGiveGradeWXRoomid;
        App.g.roomName=localStorage.apartmentGiveGradeWXRoomName;
      }
      App.g.addOrEdit=1;
      
      this.getLiveAreaList();//获取生活区列表
      
    },

    render: function () {
      this.liveAreaList=null;
      if(App.g.liveAreaList){
        this.liveAreaList=App.g.liveAreaList.toJSON();
      }
      this.roomList=null;
      if(App.g.roomList){
        this.roomList=App.g.roomList.toJSON();
      }
      this.$el.html(this.template({
        liveAreaList:this.liveAreaList,
        roomList:this.roomList,
        liveAreaId:App.g.liveAreaId,
        liveAreaName:App.g.liveAreaName,
        flatid:App.g.flatid,
        flatName:App.g.flatName,
        floorid:App.g.floorid,
        floorName:App.g.floorName,
        roomid:App.g.roomid,
        roomName:App.g.roomName,
      }));
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
              App.g.roleList.push(result.data[i].subNodes[0]);
            }
            if(App.g.flatid){
              //获取楼栋中的宿舍信息
              $.ajax({
                url: App.URL.getRoomByBan + '?flatid='+ App.g.flatid +'&token='+ App.g.token,
                type: 'GET',
                dataType: 'JSON',
                success: function success(response) {
                  var result = JSON.parse(response);
                  if (result.code == '0') {
                    App.g.roomList = new App.Collections.RoomList();
                    for(var i=0,ilen=result.data.floorList.length;i<ilen;i++){
                      App.g.roomList.push(result.data.floorList[i]);
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
                    content: '获取楼层信息失败，请重试！',
                    stayTime: 2000,
                    type: "warn"
                  });
                  //Backbone.history.navigate('#', {trigger: true});
                  App.loading();
                }
              });
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
            content: '获取违章项目失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#bindroom/0', {trigger: true});
          App.loading();
        }
      });
    },
    
    areaListSelect:function(event){
      var optionSelected=$(event.target.options[event.target.options.selectedIndex]);
      App.g.liveAreaId=optionSelected.val().trim();
      App.g.liveAreaName=optionSelected.text().trim();
      var banSelect=$('.ban-select');
      banSelect.empty().append('<option value="0" selected >请选择楼栋</option>')
      for(var i=0,ilen=this.liveAreaList.length;i<ilen;i++){
        if(this.liveAreaList[i].liveAreaId==App.g.liveAreaId){
          for(var j=0,jlen=this.liveAreaList[i].flatList.length;j<jlen;j++){
            banSelect.append('<option value="'+this.liveAreaList[i].flatList[j].flatId+'" >'+this.liveAreaList[i].flatList[j].title+'</option>')
          }
        }
      }
    },
    
    banSelect: function(event){
      var optionSelected=$(event.target.options[event.target.options.selectedIndex]);
      App.g.flatid=optionSelected.val().trim();
      App.g.flatName=optionSelected.text().trim();
      var floorSelect=$('.floor-select');
      floorSelect.empty().append('<option value="0" selected >请选择楼层</option>');
      var _selfthis=this;
      $.ajax({
        url: App.URL.getRoomByBan + '?flatid='+ App.g.flatid +'&token='+ App.g.token,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.roomList = new App.Collections.RoomList();
            for(var i=0,ilen=result.data.floorList.length;i<ilen;i++){
              App.g.roomList.push(result.data.floorList[i]);
              floorSelect.append('<option value="'+result.data.floorList[i].floorId+'" >'+result.data.floorList[i].floorName+'</option>');
            }
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
            content: '获取楼层信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          //Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    floorSelect:function(event){
      var optionSelected=$(event.target.options[event.target.options.selectedIndex]);
      App.g.floorid=optionSelected.val().trim();
      App.g.floorName=optionSelected.text().trim();
      var roomSelect=$('.room-select');
      roomSelect.empty().append('<option value="0" selected >请选择寝室</option>')
      this.roomList=App.g.roomList.toJSON();
      for(var i=0,ilen=this.roomList.length;i<ilen;i++){
        if(this.roomList[i].floorId==App.g.floorid){
          for(var j=0,jlen=this.roomList[i].roomList.length;j<jlen;j++){
            roomSelect.append('<option value="'+this.roomList[i].roomList[j].roomId+'" >'+this.roomList[i].roomList[j].roomName+'</option>')
          }
        }
      }
    },
    
    gocheckgrade: function(){
      if(!App.g.liveAreaId){
        $.tips({
          content: '请选择生活区！',
          stayTime: 2000,
          type: "warn"
        });
        return;
      }
      if(!App.g.flatid){
        $.tips({
          content: '请选择楼栋！',
          stayTime: 2000,
          type: "warn"
        });
        return;
      }
      if(!App.g.floorid){
        $.tips({
          content: '请选择楼层！',
          stayTime: 2000,
          type: "warn"
        });
        return;
      }
      var roomSelect=document.getElementsByClassName('room-select')[0];
      if(roomSelect.value==0){
        $.tips({
          content: '请选择寝室！',
          stayTime: 2000,
          type: "warn"
        });
        return;
      }
      var optionSelected=$(roomSelect.options[roomSelect.options.selectedIndex]);
      App.g.roomid=optionSelected.val().trim();
      App.g.roomName=optionSelected.text().trim();
      
      localStorage.apartmentGiveGradeWXLiveAreaId=App.g.liveAreaId;
      localStorage.apartmentGiveGradeWXLiveAreaName=App.g.liveAreaName;
      localStorage.apartmentGiveGradeWXFlatid=App.g.flatid;
      localStorage.apartmentGiveGradeWXFlatName=App.g.flatName;
      localStorage.apartmentGiveGradeWXFloorid=App.g.floorid;
      localStorage.apartmentGiveGradeWXFloorName=App.g.floorName;
      localStorage.apartmentGiveGradeWXRoomid=App.g.roomid;
      localStorage.apartmentGiveGradeWXRoomName=App.g.roomName;
      
      Backbone.history.navigate('#checkgrade', {trigger: true});
      App.loading();
    }

  });

})();
