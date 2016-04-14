/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Gradetype = Backbone.View.extend({

    template: JST['app/scripts/templates/gradetype.ejs'],

    tagName: 'div',

    el: '#gradetype',
    
    schoolyearList:null,
    
    myScroll:null,
    
    liveAreaList:null,
    
    menuLength:0,

    events: {
      'click .day-btn':'godayindex',
      'click .week-btn':'goweekindex',
      'click .month-btn':'gomonthindex',
      'click .check-btn':'gocheckindex',
      'click .cancel': 'cancelMenu',
      'click #scroller button': 'chooseButton',
      // 'change .live-select select':'liveSelect',
      // 'change .apartmen-select select':'apartmentSelect',
      'change .week-select': 'weekselectchane',
      // 'change .check-select': 'checkselectchane',
      // 'change .check-select-second': 'checkSelectSecondChane'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      // if(localStorage.apartmentLiveAreaId){
      //   App.g.liveAreaId=localStorage.apartmentLiveAreaId;
      //   App.g.liveAreaName=localStorage.apartmentLiveAreaName;
      //   App.g.flatid=localStorage.apartmentFlatid;
      //   App.g.flatName=localStorage.apartmentFlatName;
      // }
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
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },

    render: function () {
      this.schoolyearList = App.g.schoolyearlist.toJSON();
      var schoolyearModel= null;
      if(this.schoolyearList.length>0){
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
      }
      var flatlist=null;
      if(App.g.liveAreaId && App.g.liveAreaList.where({liveAreaId:App.g.liveAreaId}).length>0){
        flatlist=App.g.liveAreaList.where({liveAreaId:App.g.liveAreaId})[0].attributes.flatList;
      }
      if(App.g.liveAreaList){
        this.liveAreaList=App.g.liveAreaList.toJSON();
      }
      if(!App.g.currentSemesterIndex){
        App.g.currentSemesterIndex=0;
      }
      this.$el.html(this.template({
        liveAreaId:App.g.liveAreaId,
        flatid:App.g.flatid,
        flatlist:flatlist,
        setting:App.g.gradesetting.toJSON(),
        yearlist:this.schoolyearList,
        schoolyearModel:schoolyearModel,
        liveAreaList:this.liveAreaList,
        currentYearId:App.g.currentYearId,
        currentSemesterIndex:App.g.currentSemesterIndex
      }));
    },
    
    weekselectchane: function(event){
      var _this=$(event.target);
      var year=_this.val();
      var week=$('.week-select-second');
      week.empty();
      week.append('<option value="0" selected >请选择学期</option>')
      for(var i=0;i<this.schoolyearList.length;i++){
        if(this.schoolyearList[i].year==year){
          for(var j=0;j<this.schoolyearList[i].semesterList.length;j++){
            week.append("<option value='"+ this.schoolyearList[i].semesterList[j].semesterId +"'>学期"+ (j+1) +"</option>");
          }
          break;
        }
      }
    },
    
    // checkselectchane: function(event){
    //   var _this=$(event.target);
    //   var year=_this.val();
    //   var check=$('.check-select-second');
    //   check.empty();
    //   check.append('<option value="0" selected >请选择学期</option>')
    //   for(var i=0;i<this.schoolyearList.length;i++){
    //     if(this.schoolyearList[i].year==year){
    //       for(var j=0;j<this.schoolyearList[i].semesterList.length;j++){
    //         check.append("<option value='"+ this.schoolyearList[i].semesterList[j].semesterId +"'>学期"+ (j+1) +"</option>");
    //       }
    //       break;
    //     }
    //   }
    // },
    
    // checkSelectSecondChane: function(){
    //   var checkSelect=$('.check-select');
    //   var checkSelectSecond=$('.check-select-second');
    //   var checkSelectThird=$('.check-select-third');
    // },
    
    godayindex: function(){
      var val=$('.day input').val();
      if(val==''){
        $.tips({
          content: '请选择打分时间',
          stayTime: 2000,
          type: "warn"
        });
        return;
      }
      App.g.type='day';
      //var data=val.split('-');
      //App.g.typeData=data[0]+'-'+parseInt(data[1])+'-'+parseInt(data[2]);
      App.g.typeData=val;
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
      this.goIndex();
    },
    
    gomonthindex: function(){
      var val=$('.month input').val();
      if(val==''){
        console.log(1);
        $.tips({
          content: '请选择打分时间',
          stayTime: 2000,
          type: "warn"
        });
        return;
      }
      App.g.type='month';
      //var data=val.split('-');
      //App.g.typeData=data[0]+'-'+parseInt(data[1]);
      App.g.typeData=val;
      this.goIndex();
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
            var num=0;
            str+='<h4>请选择抽查项</h4>';
            str+='<div id="wrapper"><div id="scroller">';
            for(var i=0,ilen=result.list.length;i<ilen;i++){
              App.g.checkList.push(result.list[i]);
              //判断此条抽查列表的角色id中是否有当前帐号的角色id
              var roleIdsArry=result.list[i].split(',');
              if(roleIdsArry.indexOf(App.g.gradesetting.get('roleId'))>=0){
                num++;
                str+='<button data-checkid="'+ result.list[i].checkId +'" value="'+ result.list[i].title+'" >'+ result.list[i].title +'</button>';
              }
            }
            str+='</div></div><button class="cancel">取消</button>';
            menu.append(str);
            if(num>0){
              this.refreshWraper(this.liveAreaList.length);
            }else{
              $.tips({
                content: '目前没有抽查项',
                stayTime: 2000,
                type: "warn"
              });
            }
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
    
    cancelMenu: function(){
      $('.dormitory-menu',this.$el).removeClass('show');
    },
    
    chooseButton: function(event){
      $('.dormitory-menu').removeClass('show');
      var _this=$(event.target);
      if(_this.data('liveareaid')){
        App.g.liveAreaId=_this.data('liveareaid');
        App.g.liveAreaName=_this.val();
        this.showFlat()
      }
      if(_this.data('flatid')){
        App.g.flatid=_this.data('flatid');
        App.g.flatName=_this.val();
        Backbone.history.navigate('index',{trigger: true})
        App.loading();
      }
      if(_this.data('checkid')){
        App.g.checkId=_this.data('checkid');
        App.g.checkName=_this.val();
        App.g.typeData=_this.val();
        this.showCheckArea();
      }
      if(_this.data('areaid')){
        App.g.liveAreaId=_this.data('areaid');
        App.g.liveAreaName=_this.val();
        this.showCheckFlat();
      }
    },
    
    showFlat: function(){
      var menu=$('.dormitory-menu-body');
      menu.empty();
      var str='';
      str+='<h4>请选择楼栋</h4>';
      str+='<div id="wrapper"><div id="scroller">';
      var flatlist=App.g.liveAreaList.where({liveAreaId:App.g.liveAreaId})[0].attributes.flatList;
      for(var i=0;i<flatlist.length;i++){
        str+='<button data-flatid="'+ flatlist[i].flatId +'" value="'+ flatlist[i].title+'" >'+ flatlist[i].title +'</button>';
      }
      str+='</div></div><button class="cancel">取消</button>';
      menu.append(str);
      this.refreshWraper(flatlist.length);
    },
    
    showCheckArea: function(){
      App.loading(true);
      $.ajax({
        url: App.URL.getCheckArea + '?schoolcode='+ App.g.schoolcode +'&token='+ App.g.token +'&checkid='+ App.g.checkId,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            if(result.list.listAre.length==0){
              $.tips({
                content: '目前该抽查项还未配置抽查楼栋',
                stayTime: 2000,
                type: "warn"
              });
              App.loading();
              return;
            }
            App.g.checkAreaList = new App.Collections.CheckAreaList();
            var menu=$('.dormitory-menu-body');
            menu.empty();
            var str='';
            var num=0;
            str+='<h4>请选择抽查生活区</h4>';
            str+='<div id="wrapper"><div id="scroller">';
            for(var i=0,ilen=result.list.listAre.length;i<ilen;i++){
              App.g.checkAreaList.push(result.list.listAre[i]);
              str+='<button data-areaid="'+ result.list.listAre[i].areaId +'" value="'+ result.list.listAre[i].areaName+'" >'+ result.list.listAre[i].areaName +'</button>';
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
            content: '获取抽查生活区列表失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    showCheckFlat: function(){
      var menu=$('.dormitory-menu-body');
      menu.empty();
      var str='';
      str+='<h4>请选择抽查楼栋</h4>';
      str+='<div id="wrapper"><div id="scroller">';
      var flatlist=App.g.checkAreaList.where({areaId:App.g.liveAreaId})[0].attributes.listFla;
      for(var i=0;i<flatlist.length;i++){
        str+='<button data-flatid="'+ flatlist[i].flatId +'" value="'+ flatlist[i].flatName+'" >'+ flatlist[i].flatName +'</button>';
      }
      str+='</div></div><button class="cancel">取消</button>';
      menu.append(str);
      this.refreshWraper(flatlist.length);
    },
    
    // liveSelect:function(event){
    //   //$('#test option:selected').val();
    //   var optionSelected=$(event.target.options[event.target.options.selectedIndex]);
    //   App.g.liveAreaId=optionSelected.data('liveareaid');
    //   App.g.liveAreaName=optionSelected.val();
    //   var apartmen_select=$('.apartmen-select select');
    //   apartmen_select.empty();
    //   apartmen_select.append('<option value="0" selected >请选择楼栋</option>')
    //   var flatlist=App.g.liveAreaList.where({liveAreaId:App.g.liveAreaId})[0].attributes.flatList;
    //   for(var i=0;i<flatlist.length;i++){
    //     apartmen_select.append('<option data-flatid="'+ flatlist[i].flatId +'" value="'+ flatlist[i].title+'" >'+ flatlist[i].title +'</option>');
    //   }
    // },
    
    // apartmentSelect:function(event){
    //   var optionSelected=$(event.target.options[event.target.options.selectedIndex]);
    //   App.g.flatid=optionSelected.data('flatid');
    //   App.g.flatName=optionSelected.val();
    // },
    
    goIndex:function(){
      var menu=$('.dormitory-menu-body');
      menu.empty();
      var str='';
      str+='<h4>请选择生活区</h4>';
      str+='<div id="wrapper"><div id="scroller">';
      for(var i=0,ilen=this.liveAreaList.length;i<ilen;i++){
        str+='<button data-liveareaid="'+this.liveAreaList[i].liveAreaId+'" value="'+this.liveAreaList[i].title+'" >'+this.liveAreaList[i].title+'</button>';
      }
      str+='</div></div><button class="cancel">取消</button>';
      menu.append(str);
      this.refreshWraper(this.liveAreaList.length);
      
      // if($('.live-select select').val()==0){
      //   $.tips({
      //     content: '请选择生活区！',
      //     stayTime: 2000,
      //     type: "warn"
      //   });
      //   return;
      // }
      // if($('.apartmen-select select').val()==0){
      //   $.tips({
      //     content: '请选择楼栋！',
      //     stayTime: 2000,
      //     type: "warn"
      //   });
      //   return;
      // }
      
      // localStorage.apartmentLiveAreaId=App.g.liveAreaId;
      // localStorage.apartmentLiveAreaName=App.g.liveAreaName;
      // localStorage.apartmentFlatid=App.g.flatid;
      // localStorage.apartmentFlatName=App.g.flatName;
      // Backbone.history.navigate('index',{trigger: true})
      // App.loading();
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

//line-111 最下
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


// <div class="ui-form-item ui-border-b live-select">
//   <label>生活区:</label>
//     <div class="ui-select">
//       <select class="">
//         <option value="0" <% if(!liveAreaId){ %> selected <% } %>>请选择生活区</option>
//         <% for(var i=0;i<liveAreaList.length;i++){ %>
//         <option data-liveareaid='<%= liveAreaList[i].liveAreaId%>' <% if(liveAreaList[i].liveAreaId==liveAreaId){ %> selected <% } %> value='<%= liveAreaList[i].title%>' ><%= liveAreaList[i].title%></option>
//         <% } %>
//       </select>
//     </div>
// </div>

// <div class="ui-form-item ui-border-b apartmen-select">
//   <label>楼&nbsp;&nbsp;&nbsp;栋:</label>
//     <div class="ui-select">
//       <select class="">
//         <option value="0" selected>请选择楼栋</option>
      
//         <% if(liveAreaId && flatlist){ %>
//         <% for(var i=0;i<flatlist.length;i++){ %>
//         <option data-flatid="<%= flatlist[i].flatId  %>" <% if(flatlist[i].flatId==flatid){ %> selected <% } %> value="<%= flatlist[i].title %>" ><%= flatlist[i].title  %></option>
//         <% } %>
//         <% } %>
      
//       </select>
//     </div>
// </div>
