/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Index = Backbone.View.extend({

    template: JST['app/scripts/templates/index.ejs'],

    tagName: 'div',
    
    el: '#index',
    
    ajaxNum:0,
    
    ajaxCurrent:0,
    
    flatlist:null,
    
    tets:function(){
      console.log('11111')
    },

    events: {
      //'click .ui-tab .ui-tab-nav .dormitory': 'dormitoryMenu',
      //'click .ui-tab .ui-tab-nav .ban': 'banMenu',
      //'click .cancel': 'cancelMenu',
      //'click .dormitory-btns button': 'choosedormitory',
      //'click .ban-btns button': 'chooseban',
      'click .ui-row li span': 'goGiveGrade'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      this.ajaxNum=0;
      this.ajaxCurrent=0;
      if(App.g.gradesetting.get('role')==0){
        //违章分获取
        this.ajaxNum++;
      }
      if(App.g.gradesetting.get('photo')==0){
        //上传照片获取
        this.ajaxNum++;
      }
      App.loading(true);
      var _selfthis=this;
      var url='';
      if(App.g.type=='day'){
        url=App.URL.getDayRoomGrade + '?schoolcode='+ App.g.schoolcode +'&token=' + App.g.token + '&flatid='+ App.g.flatid + '&date='+ App.g.typeData;
      }
      else if(App.g.type=='week'){
        url=App.URL.getWeekRoomGrade + '?schoolcode='+ App.g.schoolcode +'&token=' + App.g.token + '&flatid='+ App.g.flatid + '&semesterid='+ App.g.semesterId + '&currentweek='+ App.g.typeData;
      }
      else if(App.g.type=='month'){
        url=App.URL.getMonthRoomGrade + '?schoolcode='+ App.g.schoolcode +'&token=' + App.g.token + '&flatid='+ App.g.flatid + '&date='+ App.g.typeData;
      }
      else if(App.g.type=='check'){
        url=App.URL.getCheckRoomGrade + '?schoolcode='+ App.g.schoolcode +'&token=' + App.g.token + '&flatid='+ App.g.flatid + '&checkid='+ App.g.checkId;
      }
      //获取打分楼栋 的 寝室打分信息
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.floorList = new App.Collections.FloorList();
            App.g.roomNumber = result.list.roomNumber;
            App.g.notRoomNumber = result.list.notRoomNumber;
            for(var i=0,ilen=result.list.floorList.length;i<ilen;i++){
              App.g.floorList.push(result.list.floorList[i]);
            }
            _selfthis.render();
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
            content: '获取生活区信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },

    render: function () {
      //console.log(App.g.floorList.toJSON())
      this.$el.html(this.template({
        setting:App.g.gradesetting.toJSON(),
        type:App.g.type,
        typeData:App.g.typeData,
        floorList:App.g.floorList.toJSON(),
        flatName:App.g.flatName,
        liveAreaName:App.g.liveAreaName,
        roomNumber:App.g.roomNumber,
        notRoomNumber:App.g.notRoomNumber
        //liveAreaList:App.g.liveAreaList.toJSON(),
        //flatlist:this.flatlist
      }));
    },
    
    // dormitoryMenu: function(){
    //   $('.dormitory-menu',this.$el).addClass('show');
    // },
    
    // banMenu: function(){
    //   $('.ban-menu',this.$el).addClass('show');
    // },
    
    // cancelMenu: function(){
    //   $('.dormitory-menu',this.$el).removeClass('show');
    //   $('.ban-menu',this.$el).removeClass('show');
    // },
    
    // choosedormitory: function(event){
    //   var _this=$(event.target);
    //   App.g.liveAreaId=_this.data('liveareaid');
    //   App.g.liveAreaName=_this.val();
    //   $('.ban-btns').empty();
    //   this.flatlist=App.g.liveAreaList.where({liveAreaId:App.g.liveAreaId})[0].attributes.flatList;
    //   for(var i=0;i<this.flatlist.length;i++){
    //       $('.ban-btns').append('<button data-flatid="'+ this.flatlist[i].flatId +'" value="'+ this.flatlist[i].title+'" >'+ this.flatlist[i].title +'</button>');
    //   }
    //   $('.dormitory-menu').removeClass('show');
    //   $('.dormitory span').text(App.g.liveAreaName);
    //   $('.ban-menu').addClass('show');
      
    // },
    
    // chooseban:function(event){
    //   var _this=$(event.target);
    //   App.g.flatid=_this.data('flatid');
    //   App.g.flatName=_this.val();
    //   $('.ban span').text(App.g.flatName);
    //   this.render();
    //   $('.ban-menu').removeClass('show');
    // },
    
    goGiveGrade: function(event){
      var _this=$(event.target)
      if(_this.hasClass('not-need')){
        return;
      }
      App.g.roomid=_this.data('roomid');
      //App.g.floorCurrent=_this.data('floor');
      //App.g.floorNumCurrent=_this.data('num');
      App.g.roomName=_this.data('roomname');
      if(_this.hasClass('active')){
        App.g.addOrEdit=1;
        App.g.roomscoreid=_this.data('roomscoreid');
      }
      else{
        App.g.addOrEdit=0;
      }
      Backbone.history.navigate('#givegrade', {trigger: true});
      App.loading(true);

      return;
      
      
      
      // App.loading(true);
      // var _selfthis=this;
      // var url='';
      // if(App.g.type=='day'){
      //   url=App.URL.getDayBedGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&date='+ App.g.typeData;
      // }
      // else if(App.g.type=='week'){
      //   url=App.URL.getWeekBedGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&semesterid='+ App.g.semesterId + '&currentweek='+ App.g.typeData;
      // }
      // else if(App.g.type=='month'){
      //   url=App.URL.getMonthBedGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&date='+ App.g.typeData;
      // }
      // //获取床位打分信息
      // $.ajax({
      //   url: url,
      //   type: 'GET',
      //   dataType: 'JSON',
      //   success: function success(response) {
      //     var result = JSON.parse(response);
      //     if (result.code == '0') {
      //       App.g.bedList = new App.Collections.BedList();
      //       for(var i=0,ilen=result.data.length;i<ilen;i++){
      //         App.g.bedList.push(result.data[i]);
      //       }
      //       if(_this.hasClass('active')){
      //         App.g.addOrEdit=1;
      //         App.g.roomscoreid=_this.data('roomscoreid');
              
      //         _selfthis.getRoomGradeDetail();
      //         return;
      //       }
      //       App.g.addOrEdit=0;
      //       App.loading();
      //       Backbone.history.navigate('#givegrade', {trigger: true}); 
                
      //     } else {
      //       $.tips({
      //         content: result.msg,
      //         stayTime: 2000,
      //         type: "warn"
      //       });
      //       App.loading();
      //     }
      //   }, error: function error() {
      //     $.tips({
      //       content: '获取床位信息失败，请重试！',
      //       stayTime: 2000,
      //       type: "warn"
      //     });
      //     Backbone.history.navigate('#', {trigger: true});
      //     App.loading();
      //   }
      // });
      
    },
    
    // getRoomGradeDetail:function(){
    //   var _selfthis=this;
    //   var url='';
    //   if(App.g.type=='day'){
    //     url=App.URL.getDayRoomGradeDetail + '?token=' + App.g.token + '&roomscoreid='+ App.g.roomscoreid;
    //   }
    //   else if(App.g.type=='week'){
    //     url=App.URL.getWeekRoomGradeDetail + '?token=' + App.g.token + '&roomscoreid='+ App.g.roomscoreid;
    //   }
    //   else if(App.g.type=='month'){
    //     url=App.URL.getMonthRoomGradeDetail + '?token=' + App.g.token + '&roomscoreid='+ App.g.roomscoreid;
    //   }
    //   //获取寝室打分信息
    //   $.ajax({
    //     url: url,
    //     type: 'GET',
    //     dataType: 'JSON',
    //     success: function success(response) {
    //       var result = JSON.parse(response);
    //       if (result.code == '0') {
    //         App.g.roomGradeList = new App.Collections.RoomGradeList();
    //         for(var i=0,ilen=result.data.length;i<ilen;i++){
    //           App.g.roomGradeList.push(result.data[i]);
    //         }
    //         if(App.g.gradesetting.get('role')==0){
    //           //获取违章分
    //           _selfthis.getRoleGrade();
    //         }
    //         if(App.g.gradesetting.get('photo')==0){
    //           //获取上传照片
    //           _selfthis.getPhotoGrade();
    //         }
    //       } else {
    //         $.tips({
    //           content: result.msg,
    //           stayTime: 2000,
    //           type: "warn"
    //         });
    //         App.loading();
    //       }
    //     }, error: function error() {
    //       $.tips({
    //         content: '获取床位信息失败，请重试！',
    //         stayTime: 2000,
    //         type: "warn"
    //       });
    //       Backbone.history.navigate('#', {trigger: true});
    //       App.loading();
    //     }
    //   });
    // },
    
    // getRoleGrade:function(){
    //   var url=App.URL.getRoleBySpecialid + '?token=' + App.g.token + '&schoolcode='+ App.g.schoolcode + '&specialid=';
    //   var _selfthis=this;
    //   var specialid='';
    //   if(App.g.type=='day'){
    //     specialid+=App.g.roomid+'-'+App.g.typeData;
    //     url += specialid;
    //   }
    //   else if(App.g.type=='week'){
    //     specialid+=App.g.roomid+'-'+App.g.semesterId+'-'+App.g.typeData;
    //     url += specialid;
    //   }
    //   else if(App.g.type=='month'){
    //     specialid+=App.g.roomid+'-'+App.g.typeData;
    //     url += specialid;
    //   }
    //   $.ajax({
    //     url:url,
    //     type:'GET',
    //     dataType:'JSON',
    //     success:function(response){
    //       var result = JSON.parse(response);
    //       if(result.code == 0){
    //         App.g.roleDetailList = new App.Collections.RoleDetailList();
    //         for(var i=0,ilen=result.data.length;i<ilen;i++){
    //           App.g.roleDetailList.push(result.data[i]);
    //         }
    //         _selfthis.ajaxCurrent++;
    //         _selfthis.countAjax();
    //       }else{
    //         $.tips({
    //           content:result.msg,
    //           stayTime:2000,
    //           type:"warn"
    //         });
    //       App.loading();
    //       }
    //     },error:function(){
    //       $.tips({
    //         content:'获取寝室违章信息失败，请重试！',
    //         stayTime:2000,
    //         type:"warn"
    //       });
    //       App.loading();
    //     }
    //   });
    // },
    
    // getPhotoGrade:function(){
    //   var url='';
    //   var _selfthis=this;
    //   if(App.g.type=='day'){
    //     url=App.URL.getDayPhotoGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&data='+ App.g.typeData;
    //   }
    //   else if(App.g.type=='week'){
    //     url=App.URL.getWeekPhotoGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&semesterid='+ App.g.semesterid + '&currentweek='+ App.g.typeData;
    //   }
    //   else if(App.g.type=='month'){
    //     url=App.URL.getMonthPhotoGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&data='+ App.g.typeData;
    //   }
    //   $.ajax({
    //     url:url,
    //     type:'GET',
    //     dataType:'JSON',
    //     success:function(response){
    //       var result = JSON.parse(response);
    //       if(result.code == 0){
    //         App.g.photoList = new App.Collections.PhotoList();
    //         for(var i=0,ilen=result.data.length;i<ilen;i++){
    //           App.g.photoList.push(result.data[i]);
    //         }
    //         _selfthis.ajaxCurrent++;
    //         _selfthis.countAjax();
    //       }else{
    //         $.tips({
    //           content:result.msg,
    //           stayTime:2000,
    //           type:"warn"
    //         });
    //       App.loading();
    //       }
    //     },error:function(){
    //       $.tips({
    //         content:'获取照片信息失败，请重试！',
    //         stayTime:2000,
    //         type:"warn"
    //       });
    //       App.loading();
    //     }
    //   });
    // },
    
    // countAjax:function(){
    //   if(this.ajaxCurrent==this.ajaxNum){
    //     App.loading();
    //     Backbone.history.navigate('#givegrade', {trigger: true});
        
    //   }
    // }

  });

})();


//line-17 header下
// <div class="ui-tab">
//   <ul class="ui-tab-nav ui-border-b">
//     <li class="dormitory"><span><%= liveAreaName%></span><i class="iconfont icon-down"></i></li>
//     <li class="ban"><span><%= flatName%></span><i class="iconfont icon-down"></i></li>
//   </ul>
  
// </div>

//line-98 最下
// <div class="ui-actionsheet dormitory-menu">
//   <div class="ui-actionsheet-cnt">
//     <h4>请选择宿舍区</h4>
//     <p class="dormitory-btns">
//       <% for(var i=0;i<liveAreaList.length;i++){ %>
//         <button data-liveareaid='<%= liveAreaList[i].liveAreaId%>' value='<%= liveAreaList[i].title%>' ><%= liveAreaList[i].title%></button>
//       <% } %>
//     </p>
//     <button class="cancel">取消</button>
//   </div>
// </div>

// <div class="ui-actionsheet ban-menu">
//   <div class="ui-actionsheet-cnt">
//     <h4>请选择楼栋</h4>
//     <p class="ban-btns">
//       <% for(var i=0;i<flatlist.length;i++){ %>
//         <button data-flatid="<%= flatlist[i].flatId %>" value="<%= flatlist[i].title%>" ><%= flatlist[i].title %></button>
//       <% } %>
//     </p>
//     <button class="cancel">取消</button>
//   </div>
// </div>