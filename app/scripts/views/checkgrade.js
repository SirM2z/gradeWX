/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Checkgrade = Backbone.View.extend({

    template: JST['app/scripts/templates/checkgrade.ejs'],

    tagName: 'div',

    el: '#checkgrade',
    
    schoolyearList:null,

    events: {
      'click .day-btn':'godayindex',
      'click .week-btn':'goweekindex',
      'click .month-btn':'gomonthindex',
      'click .check-btn':'gocheckindex',
      'click .cancel': 'cancelMenu',
      'click #scroller button': 'chooseButton',
      'change .week-select': 'weekselectchane'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      if(localStorage.apartmentLiveAreaId){
        App.g.liveAreaId=localStorage.apartmentLiveAreaId;
        App.g.liveAreaName=localStorage.apartmentLiveAreaName;
        App.g.flatid=localStorage.apartmentFlatid;
        App.g.flatName=localStorage.apartmentFlatName;
      }
      App.loading(true);
      var _selfthis=this;
      $.ajax({
        url: App.URL.getWeekNum + '?schoolcode='+ App.g.schoolcode +'&token='+ App.g.token,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.schoolyearlist = new App.Collections.SchoolYearList(result.data);
            for(var i=0,ilen=result.data.length;i<ilen;i++){
              App.g.currentYearId=result.data[0].schoolYearId;
              var num=0;
              for(var j=0,jlen=result.data[i].semesterList.length;j<jlen;j++){
                if(result.data[i].semesterList[j].isCurrent==1){
                  App.g.currentSemesterIndex=j;
                  num++;
                }
              }
              if(num>0)break;
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
            content: '获取学期周数信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#bindRoom/0', {trigger: true});
          App.loading();
        }
      });
      
    },

    render: function () {
      this.schoolyearList = App.g.schoolyearlist.toJSON();
      var schoolyearModel= null;
      for(var i=0;i<this.schoolyearList.length;i++){
        if(this.schoolyearList[i].semesterList[0].isCurrent==1){
          schoolyearModel=this.schoolyearList[i];
          break;
        }
        if(this.schoolyearList[i].semesterList[1].isCurrent==1){
          schoolyearModel=this.schoolyearList[i];
          break;
        }
      }
      if(!schoolyearModel){
        schoolyearModel=this.schoolyearList[0];
      }
      if(!App.g.currentSemesterIndex){
        App.g.currentSemesterIndex=0;
      }
      this.$el.html(this.template({
        yearlist:this.schoolyearList,
        schoolyearModel:schoolyearModel,
        schoolcode:App.g.schoolcode,
        currentYearId:App.g.currentYearId,
        currentSemesterIndex:App.g.currentSemesterIndex
      }));
    },
    
    weekselectchane: function(event){
      var _this=$(event.target);
      var year=_this.val();
      $('.week-select-second').empty();
      for(var i=0;i<this.schoolyearList.length;i++){
        if(this.schoolyearList[i].year==year){
          for(var j=0;j<this.schoolyearList[i].semesterList.length;j++){
            $('.week-select-second').append("<option value='"+ this.schoolyearList[i].semesterList[j].semesterId +"'>学期"+ (j+1) +"</option>");
          }
          break;
        }
      }
    },
    
    godayindex: function(){
      //console.log($('.day input').val())
      if($('.day input').val()==''){
        console.log(2);
        $.tips({
          content: '请选择查分时间',
          stayTime: 2000,
          type: "warn"
        });
        return;
      }
      App.g.type='day';
      //var data=$('.day input').val().split('-');
      //App.g.typeData=data[0]+'-'+parseInt(data[1])+'-'+parseInt(data[2]);
      App.g.typeData=$('.day input').val();
      this.goIndex();
    },
    
    goweekindex: function(){
      var year,mongth,day;
      $('.week select').each(function(i,item){
        if(i==0){
          year=$(item).val();
        }
        if(i==1){
          mongth=item.options[item.options.selectedIndex].text;
          App.g.semesterId=$(item).val();
        }
        if(i==2){
          day=$(item).val();
        }
      })
      App.g.type='week';
      App.g.typeData=day;
      //console.log(App.g.semesterId);
      this.goIndex();
    },
    
    gomonthindex: function(){
      if($('.month input').val()==''){
        console.log(1);
        $.tips({
          content: '请选择查分时间',
          stayTime: 2000,
          type: "warn"
        });
        return;
      }
      App.g.type='month';
      //var data=$('.month input').val().split('-');
      //App.g.typeData=data[0]+'-'+parseInt(data[1]);
      App.g.typeData=$('.month input').val();
      this.goIndex();
    },
    
    cancelMenu: function(){
      $('.dormitory-menu',this.$el).removeClass('show');
    },
    
    chooseButton: function(event){
      $('.dormitory-menu').removeClass('show');
      var _this=$(event.target);
      if(_this.data('checkid')){
        App.g.checkId=_this.data('checkid');
        App.g.checkName=_this.val();
        App.g.typeData=_this.val();
        this.goIndex();
      }
    },
    
    gocheckindex: function(){
      var year,mongth,day;
      $('.check select').each(function(i,item){
        if(i==0){
          App.g.schoolyearid=$(item).val();
        }
        if(i==1){
          mongth=item.options[item.options.selectedIndex].text;
          App.g.semesterid=$(item).val();
        }
      })
      App.g.type='check';
      App.g.typeData=mongth;
      
      App.loading(true);
      $.ajax({
        url: App.URL.getCheckList + '?schoolcode='+ App.g.schoolcode +'&token='+ App.g.token +'&semesterid='+ App.g.semesterid +'&schoolyearid='+ App.g.schoolyearid,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            if(result.list.length==0){
              $.tips({
                content: '目前没有抽查项',
                stayTime: 2000,
                type: "warn"
              });
              App.loading();
              return;
            }
            App.g.checkList = new App.Collections.CheckList();
            var menu=$('.dormitory-menu-body');
            menu.empty();
            var str='';
            str+='<h4>请选择抽查项</h4>';
            str+='<div id="wrapper"><div id="scroller">';
            for(var i=0,ilen=result.list.length;i<ilen;i++){
              App.g.checkList.push(result.list[i]);
              str+='<button data-checkid="'+ result.list[i].checkId +'" value="'+ result.list[i].title+'" >'+ result.list[i].title +'</button>';
            }
            str+='</div></div><button class="cancel">取消</button>';
            menu.append(str);
            this.refreshWraper(this.liveAreaList.length);
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
            content: '获取抽查列表失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
      
    },
    
    goIndex:function(){
      //App.loading(true);
      
      //获取打分楼栋 的 寝室打分信息
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
            for(var i=0,ilen=result.list.floorList.length;i<ilen;i++){
              for(var j=0,jlen=result.list.floorList[i].roomList.length;j<jlen;j++){
                if(result.list.floorList[i].roomList[j].roomId==App.g.roomid){
                  if(result.list.floorList[i].roomList[j].roomScoreId==""){
                    $.tips({
                      content: '你的寝室在所选时间无打分信息',
                      stayTime: 2000,
                      type: "warn"
                    });
                    App.loading();
                    return;
                  }
                  if(result.list.floorList[i].roomList[j].grade==2){
                    $.tips({
                      content: '你的寝室在所选时间为免检，无打分信息',
                      stayTime: 2000,
                      type: "warn"
                    });
                    App.loading();
                    return;
                  }
                  localStorage.apartmentLiveAreaId=App.g.liveAreaId;
                  localStorage.apartmentLiveAreaName=App.g.liveAreaName;
                  localStorage.apartmentFlatid=App.g.flatid;
                  localStorage.apartmentFlatName=App.g.flatName;
                  App.g.roomscoreid=result.list.floorList[i].roomList[j].roomScoreId;
                  //查看寝室详细打分情况
                  App.loading();
                  Backbone.history.navigate('#gradedetail',{trigger: true});
                  
                }
              }
            }
            //_selfthis.render();
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
          Backbone.history.navigate('#bindRoom/0', {trigger: true});
          App.loading();
        }
      });
      
    },
    
    refreshWraper: function(len){
      $('#wrapper').css('height',len*44+'px');
      var _selfthis=this;
      setTimeout(function () {
        _selfthis.myScroll=null;
        if(len>6){
          _selfthis.myScroll = new IScroll('#wrapper', { mouseWheel: true, click: true, scrollbars: true });
        }
        $('.dormitory-menu').addClass('show');
      }, 300);
    }

  });

})();
