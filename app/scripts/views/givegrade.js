/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Givegrade = Backbone.View.extend({

    template: JST['app/scripts/templates/givegrade.ejs'],

    tagName: 'div',

    el: '#givegrade',
    
    tab: null,

    current:null,
    
    ajaxNum:0,
    
    ajaxCurrent:0,
    
    ajaxGetNum:0,
    
    ajaxGetCurrent:0,
    
    isOff:0,

    events: {
      'click .break-rules .rules-add':'addRules',
      'click .room li span':'lessgrade',
      'click .bed li span':'lessbedgrade',
      'click .room li .room-rules':'roomRules',
      'click .bed li .room-rules':'roomRules',
      'click .rules-menu button':'rulesMenu',
      'click .rules-content span:not(.rules-add)':'cancelRules',
      'click .photo li:not(.photo-add-li)':'cancelPhoto',
      'change #imgupload':'addPhoto',
      'click .roules-next':'nextroom',
      'click .reset':'reset',
      'click .ui-dialog-close':'resetClose',
      'click .reset-cancle':'resetClose',
      'click .reset-sure':'resetSure'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      if(this.isOff==0){
        this.$el.off();
      }
      this.ajaxNum=0;
      this.ajaxCurrent=0;
      this.ajaxGetNum=0;
      this.ajaxGetCurrent=0;
      if(App.g.gradesetting.get('bed')==0){
        //床位分开启
        this.ajaxNum++;
      }
      if(App.g.gradesetting.get('role')==0){
        //违章开启
        this.ajaxNum++;
        //违章分获取
        this.ajaxGetNum++;
      }
      if(App.g.gradesetting.get('photo')==0){
        //上传照片开启
        this.ajaxNum++;
        //上传照片获取
        this.ajaxGetNum++;
      }
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
      var gradeTableRoom = null;
      var gradeTableBed = null;
      if(App.g.gradeTableList){
        gradeTableRoom=App.g.gradeTableList.where({title:'寝室分'})[0].attributes;
        gradeTableBed=App.g.gradeTableList.where({title:'床位分'})[0].attributes;
      }
      var setting = null;
      if(App.g.gradesetting){
        setting=App.g.gradesetting.toJSON()
      }
      this.$el.html(this.template({
        addOrEdit:App.g.addOrEdit,
        roomGradeList:roomGradeList,
        photoList:photoList,
        roleDetailList:roleDetailList,
        setting:setting,
        roleList:roleList,
        gradeTableRoom:gradeTableRoom,
        gradeTableBed:gradeTableBed,
        type:App.g.type,
        typeData:App.g.typeData,
        bedList:bedList,
        roomName:App.g.roomName,
        gradeTableId:App.g.gradeTableId
      }));
      
      this.tab = new fz.Scroll('.givegrade-tab', {
        role: 'tab'
      });
      //重置tab的Scroll事件
      this.tab._resize();
      
      //根据打分权限判断是否解绑所有事件
      if(App.g.type=='day' && setting.dayGradeCompetence==1){ 
        this.$el.off();
      }
      
      if(App.g.type=='week' && setting.weekGradeCompetence==1){ 
        this.$el.off();
      }
      
      if(App.g.type=='month' && setting.monthGradeCompetence==1){ 
        this.$el.off();
      }
      
      if(App.g.type=='check' && setting.checkGradeCompetence==1){ 
        this.$el.off();
      }
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
      else if(App.g.type=='check'){
        url=App.URL.getCheckBedGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&checkid='+ App.g.checkId;
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
      else if(App.g.type=='check'){
        url=App.URL.getCheckRoomGradeDetail + '?token=' + App.g.token + '&roomscoreid='+ App.g.roomscoreid;
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
            if(App.g.gradesetting.get('role')==0){
              //获取违章分
              _selfthis.getRoleGrade();
            }
            if(App.g.gradesetting.get('photo')==0){
              //获取上传照片
              _selfthis.getPhotoGrade();
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
      else if(App.g.type=='check'){
        specialid+=App.g.roomid+'-'+App.g.checkId;
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
      else if(App.g.type=='check'){
        url=App.URL.getCheckPhotoGrade + '?token=' + App.g.token + '&roomid='+ App.g.roomid + '&checkid='+ App.g.checkId;
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
    },
    
    reset:function(){
      $('.reset-dialog').dialog("show");
    },
    
    resetClose:function(){
      $('.reset-dialog').dialog("hide");
    },
    
    resetSure:function(){
      var currentText=$('.ui-tab-nav .current').text().trim();
      var li;
      var fullScore=parseInt($('.all-grade').text().trim());
      if(currentText=='寝室'){
        li=$('li[data-linum="1"]');
        $('i.active',li).text('').removeClass('active');
        fullScore+=parseInt($('i.icon-wrong',li).length);
        $('i.icon-wrong',li).removeClass('icon-wrong').addClass('icon-right');
        $('[data-fullmark="-2"]',li).data('fullmark','-1');
        $('.grade-item',li).each(function(i,item){
          if($(item).data('fullmark')>=0){
            var fullmark=$(item).find('span').data('fullmark');
            fullScore+=fullmark-parseInt($(item).data('fullmark'));
            $(item).data('fullmark',fullmark);
            //$(item).find('span').text(fullmark);
            $(item).find('span').html(fullmark+'<i></i>');
          }
        })
        $('.role-item',li).find('span').each(function(i,item){
          if(!$(item).hasClass('rules-add')){
            $(item).remove();
          }
        })
      }else if(currentText=='床位'){
        li=$('li[data-linum="2"]');
        $('i.active',li).text('').removeClass('active');
        //fullScore+=parseInt($('i.icon-wrong',li).length);
        $('i.icon-wrong',li).removeClass('icon-wrong').addClass('icon-right');
        $('[data-fullmark="-2"]',li).data('fullmark','-1');
        $('.bed-item',li).each(function(i,item){
          if($(item).data('fullmark')>=0){
            var fullmark=$(item).find('span').data('fullmark');
            //fullScore+=fullmark-parseInt($(item).data('fullmark'));
            $(item).data('fullmark',fullmark);
            //$(item).find('span').text(fullmark);
            $(item).find('span').html(fullmark+'<i></i>');
          }
        })
      }else if(currentText=='拍照'){
        li=$('li[data-linum="3"]');
        $('.photo-farther-item',li).remove();
      }
      $('.all-grade').text(fullScore);
      $('.reset-dialog').dialog("hide");
    },
    
    addRules:function(event){
      event.stopPropagation();
      var _this=$(event.target);
      this.current=_this.data('add');
      $(".rules-menu").addClass('show');
    },
    
    lessgrade: function(event){
      event.stopPropagation();  
      var _this=$(event.target);
      var li=_this.parent().parent();
      var fullmark=_this.data('fullmark');
      //var _i=_this.next();
      var _i=_this.find('i');
      var allgrade=$('.all-grade');
      allgrade.text(parseInt(allgrade.text().trim())-1);
      var lgrade=(_i.text().trim()!="")?(parseInt(_i.text().trim())-1):-1;
      var currentGrade=parseInt(fullmark)+parseInt(lgrade);
      //if(!_i.hasClass('active')){_i.addClass('active');}
      //_i.text(lgrade);
      //_this.text(_this.text().trim()-1);
      //_this.empty();
      _this.html(currentGrade+'<i class="active">'+lgrade+'</i>');
      //li.data('fullmark',_this.text().trim())
      li.data('fullmark',currentGrade)
      if(currentGrade==-1){
        //_this.empty();
        _this.html(fullmark+'<i></i>');
        //_this.text(_this.data('fullmark'));//"满分"
        li.data('fullmark',_this.data('fullmark'))
        allgrade.text(parseInt(allgrade.text().trim())+parseInt(_this.data('fullmark'))+1);
        //_i.removeClass('active');
        //_i.text("");
      }
    },
    
    lessbedgrade: function(event){
      event.stopPropagation();  
      var _this=$(event.target);
      var li=_this.parent().parent();
      var fullmark=_this.data('fullmark');
      //var _i=_this.next();
      var _i=_this.find('i');
      var lgrade=(_i.text().trim()!="")?(parseInt(_i.text().trim())-1):-1;
      var currentGrade=parseInt(fullmark)+parseInt(lgrade);
      //if(!_i.hasClass('active')){_i.addClass('active');}
      //_i.text(lgrade);
      //_this.text(_this.text().trim()-1);
      //_this.empty();
      _this.html(currentGrade+'<i class="active">'+lgrade+'</i>');
      li.data('fullmark',currentGrade)
      if(currentGrade==-1){
        //_this.empty();
        _this.html(fullmark+'<i></i>');
        //_this.text(_this.data('fullmark'));//"满分"
        li.data('fullmark',_this.data('fullmark'))
        //_i.removeClass('active');
        //_i.text("");
      }
    },
    
    roomRules: function(event){
      event.stopPropagation();
      var _this=$(event.target);
      var allgrade=$('.all-grade');
      //console.log(_this);
      if(_this.hasClass('icon-right')){
        _this.removeClass('icon-right').addClass('icon-wrong');
        _this.parent().parent().data('fullmark',-2)
        allgrade.text(parseInt(allgrade.text().trim())-1);
      }
      else{
        _this.removeClass('icon-wrong').addClass('icon-right');
        _this.parent().parent().data('fullmark',-1)
        allgrade.text(parseInt(allgrade.text().trim())+1);
      }
    },
    
    rulesMenu:function(event){
      event.stopPropagation();
      var _this=$(event.target);
      var val=_this.data('bed');
      var bedid=_this.data('bedid');
      switch (val){
        case -1:
          $(".rules-menu").removeClass('show');
          break;
        case 0:
          if($('.rules-add-'+this.current).parent().text().trim().indexOf('寝室违章')==-1){
            $('.rules-add-'+this.current).before('<span class="break-room role-room-item">寝室违章</span>');
          }
          $(".rules-menu").removeClass('show');
          break;
        default:
          if($('.rules-add-'+this.current).parent().text().trim().indexOf(val)==-1){
            $('.rules-add-'+this.current).before('<span class="role-bed-item" data-bedid="'+ bedid +'">'+ val +'</span>');
          }
          $(".rules-menu").removeClass('show');
      }
    },
    
    cancelRules:function(event){
      event.stopPropagation();  
      $(event.target).remove();
    },
    
    addPhoto:function(event){
      event.stopPropagation();
      var files = document.getElementById('imgupload').files;
      //console.log(files);
      var form = document.createElement('form');
      form.enctype = 'multipart/form-data';
      var fdata = new FormData(form);
      if (!fdata) { swal('提示', '你的浏览器不支持文件上传！', 'error'); return false; };
      fdata.append('img', files[0]);
      fdata.append('token', App.g.token);
      fdata.append('schoolcode', App.g.schoolcode);
      App.loading(true);
      $.ajax({
        url:App.URL.uploadImg,
        data:fdata,
        type:'POST',
        cache : false,
        processData: false,
        contentType: false,
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            $('.photo .photo-add-li').before('<li><div class="ui-grid-trisect-img"><span data-fileid="'+ result.data.fileId +'" class="photo-item" style="background-image:url('+ result.data.serverPath +')"></span></div></li>');
          }else{
            $.tips({
              content:result.msg,
              stayTime:2000,
              type:"warn"
            });
          }
          App.loading();
        },error:function(){
          $.tips({
            content:'上传失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    cancelPhoto:function(event){
      event.stopPropagation();
      if(event.target.tagName=='SPAN'){
        $(event.target).parent().parent().remove();
      }else{
        $(event.target).remove();
      }
    },
    
    nextroom:function(){
      if(App.g.addOrEdit==0){
        //打寝室分
        this.giveRoomGrade();
      }else if(App.g.addOrEdit==1){
        //修改寝室分
        this.editRoomGrade();
      }
    },
    
    giveRoomGrade:function(){
      var url='';
      var _selfthis=this;
      var data={
          token:App.g.token,
          schoolcode:App.g.schoolcode,
          roomid:App.g.roomid,
          tableid:App.g.gradeTableId,
          adminid:App.g.user.get('id'),
          typeid:App.g.roomTypeId,
          scoreitem:[]
      }
      if(App.g.type=='day'){
        url=App.URL.giveRoomGradeDay;
        data.date=App.g.typeData;
      }
      else if(App.g.type=='week'){
        url=App.URL.giveRoomGradeWeek;
        data.semesterid=App.g.semesterId;
        data.currentweek=App.g.typeData;
      }
      else if(App.g.type=='month'){
        url=App.URL.giveRoomGradeMonth;
        data.date=App.g.typeData;
      }
      else if(App.g.type=='check'){
        url=App.URL.giveCheckGradeMonth;
        data.checkid=App.g.checkId;
      }
      if($('.grade-item').length>0){
        $('.grade-item').each(function(i,item){
          var grade={};
          grade.itemid=$(item).data('itemid');
          grade.score=$(item).data('fullmark');
          data.scoreitem.push(grade);
        })
      }
      if($('.gradeok-item').length>0){
        $('.gradeok-item').each(function(i,item){
          var grade={};
          grade.itemid=$(item).data('itemid');
          grade.score=$(item).data('fullmark');
          data.scoreitem.push(grade);
        })
        //console.log('暂未做');
      }
      data.scoreitem=JSON.stringify(data.scoreitem);
      App.loading(true);
      $.ajax({
        url:url,
        data:data,
        type:'POST',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            if(App.g.gradesetting.get('bed')==0){
              //打床位分
              _selfthis.giveBedGrade();
            }
            if(App.g.gradesetting.get('role')==0){
              //打违章分
              _selfthis.giveRoleGrade();
            }
            if(App.g.gradesetting.get('photo')==0){
              //上传照片
              _selfthis.givePhotoGrade();
            }
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
            content:'寝室分打分失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    giveBedGrade:function(){
      var url='';
      var _selfthis=this;
      var data={
          token:App.g.token,
          schoolcode:App.g.schoolcode,
          tableid:App.g.gradeTableId,
          adminid:App.g.user.get('id'),
          typeid:App.g.bedTypeId,
          scoreitem:[]
      }
      if(App.g.type=='day'){
        //console.log(App.g.typeData)
        url=App.URL.giveBedGradeDay;
        data.date=App.g.typeData;
      }
      else if(App.g.type=='week'){
        //console.log(App.g.typeData)
        //console.log(App.g.semesterId)
        url=App.URL.giveBedGradeWeek;
        data.semesterid=App.g.semesterId;
        data.currentweek=App.g.typeData;
      }
      else if(App.g.type=='month'){
        //console.log(App.g.typeData)
        url=App.URL.giveBedGradeMonth;
        data.date=App.g.typeData;
      }
      else if(App.g.type=='check'){
        url=App.URL.giveBedGradeCheck;
        data.checkid=App.g.checkId;
      }
      if($('.bed-item').length>0){
        $('.bed-item').each(function(i,item){
          var grade={};
          grade.studentkey=$(item).data('studentkey');
          grade.score=$(item).data('fullmark');
          grade.itemid=$(item).data('itemid');
          grade.bedid=$(item).data('bedid');
          data.scoreitem.push(grade);
        })
      }else{
        _selfthis.ajaxCurrent++;
        _selfthis.countAjax();
        return;
      }
      data.scoreitem=JSON.stringify(data.scoreitem);
      if(data.scoreitem.length<=2){
        this.ajaxCurrent++;
        this.countAjax();
        return;
      }
      $.ajax({
        url:url,
        data:data,
        type:'POST',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            _selfthis.ajaxCurrent++;
            _selfthis.countAjax();
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
            content:'寝室分打分失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    giveRoleGrade:function(){
      var _selfthis=this;
      var data={
          token:App.g.token,
          schoolcode:App.g.schoolcode,
          roomid:App.g.roomid,
          itemlist:[]
      }
      if(App.g.type=='day'){
        data.source=1;
        data.specialid=App.g.roomid+'-'+App.g.typeData;
      }
      else if(App.g.type=='week'){
        data.source=0;
        data.specialid=App.g.roomid+'-'+App.g.semesterId+'-'+App.g.typeData;
      }
      else if(App.g.type=='month'){
        data.source=2;
        data.specialid=App.g.roomid+'-'+App.g.typeData;
      }
      else if(App.g.type=='check'){
        data.source=3;
        data.specialid=App.g.roomid+'-'+App.g.checkId;
      }
      if($('.role-item').length>0){
        var num=0;
        $('.role-item').each(function(i,item){
          var role={};
          var itemid = $(item).data('itemid');
          if($('.role-room-item',$(item)).length>0){
            num++;
            var role={};
            role.bedid='';
            role.itemid=itemid;
            data.itemlist.push(role);
          }
          if($('.role-bed-item',$(item)).length>0){
            num++;
            $('.role-bed-item',$(item)).each(function(index,beditem){
              var role={};
              role.bedid=$(beditem).data('bedid');
              role.itemid=itemid;
              data.itemlist.push(role);
            })
          }
        })
        if(num==0){
          _selfthis.ajaxCurrent++;
          _selfthis.countAjax();
          return;
        }
      }else{
        _selfthis.ajaxCurrent++;
        _selfthis.countAjax();
        return;
      }
      data.itemlist=JSON.stringify(data.itemlist);
      $.ajax({
        url:App.URL.giveRoleGrade,
        data:data,
        type:'POST',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            _selfthis.ajaxCurrent++;
            _selfthis.countAjax();
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
            content:'上传违章信息失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    givePhotoGrade:function(){
      var url='';
      var _selfthis=this;
      var data={
          token:App.g.token,
          roomid:App.g.roomid,
          schoolcode:App.g.schoolcode,
          adminid:App.g.user.get('id'),
          fileids:''
      }
      if(App.g.type=='day'){
        url=App.URL.givePhotoGradeDay;
        data.date=App.g.typeData;
      }
      else if(App.g.type=='week'){
        url=App.URL.givePhotoGradeWeek;
        data.semesterid=App.g.semesterId;
        data.currentweek=App.g.typeData;
      }
      else if(App.g.type=='month'){
        url=App.URL.givePhotoGradeMonth;
        data.date=App.g.typeData;
      }
      else if(App.g.type=='check'){
        url=App.URL.givePhotoGradeCheck;
        data.checkid=App.g.checkId;
      }
      if($('.photo-item').length>0){
        $('.photo-item').each(function(i,item){
          if(i==0){
            data.fileids+=$(item).data('fileid');
          }else{
            data.fileids+=','+$(item).data('fileid');
          }
        })
      }else{
        _selfthis.ajaxCurrent++;
        _selfthis.countAjax();
        return;
      }
      $.ajax({
        url:url,
        data:data,
        type:'POST',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            _selfthis.ajaxCurrent++;
            _selfthis.countAjax();
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
            content:'寝室分打分失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    editRoomGrade:function(){
      var url='';
      var _selfthis=this;
      var data={
          token:App.g.token,
          roomscoreid:App.g.roomscoreid,
          scoreitem:[]
      }
      if(App.g.type=='day'){
        url=App.URL.editRoomGradeDay;
      }
      else if(App.g.type=='week'){
        url=App.URL.editRoomGradeWeek;
      }
      else if(App.g.type=='month'){
        url=App.URL.editRoomGradeMonth;
      }
      else if(App.g.type=='check'){
        url=App.URL.editRoomGradeCheck;
      }
      if($('.grade-item').length>0){
        $('.grade-item').each(function(i,item){
          var grade={};
          grade.itemid=$(item).data('itemid');
          grade.score=$(item).data('fullmark');
          data.scoreitem.push(grade);
        })
      }
      if($('.gradeok-item').length>0){
        $('.gradeok-item').each(function(i,item){
          var grade={};
          grade.itemid=$(item).data('itemid');
          grade.score=$(item).data('fullmark');
          data.scoreitem.push(grade);
        })
        //console.log('暂未做');
      }
      data.scoreitem=JSON.stringify(data.scoreitem);
      App.loading(true);
      $.ajax({
        url:url,
        data:data,
        type:'POST',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            if(App.g.gradesetting.get('bed')==0){
              //修改床位分
              _selfthis.editBedGrade();
            }
            if(App.g.gradesetting.get('role')==0){
              //修改违章分
              _selfthis.giveRoleGrade();
            }
            if(App.g.gradesetting.get('photo')==0){
              //修改照片
              _selfthis.givePhotoGrade();
            }
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
            content:'寝室分修改失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    editBedGrade:function(){
      var url='';
      var _selfthis=this;
      var data={
          token:App.g.token,
          roomid:App.g.roomid,
          scoreitem:[]
      }
      if(App.g.type=='day'){
        url=App.URL.editBedGradeDay;
        data.date=App.g.typeData;
      }
      else if(App.g.type=='week'){
        url=App.URL.editBedGradeWeek;
        data.semesterid=App.g.semesterId;
        data.currentweek=App.g.typeData;
      }
      else if(App.g.type=='month'){
        url=App.URL.editBedGradeMonth;
        data.date=App.g.typeData;
      }
      else if(App.g.type=='check'){
        url=App.URL.editBedGradeCheck;
        data.checkid=App.g.checkId;
      }
      if($('.bed-item').length>0){
        $('.bed-item').each(function(i,item){
          var grade={};
          grade.studentkey=$(item).data('studentkey');
          grade.score=$(item).data('fullmark');
          grade.itemid=$(item).data('itemid');
          grade.bedid=$(item).data('bedid');
          data.scoreitem.push(grade);
        })
      }
      data.scoreitem=JSON.stringify(data.scoreitem);
      if(data.scoreitem.length<=2){
        this.ajaxCurrent++;
        this.countAjax();
        return;
      }
      $.ajax({
        url:url,
        data:data,
        type:'POST',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            _selfthis.ajaxCurrent++;
            _selfthis.countAjax();
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
            content:'寝室分打分失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    //App.g.floorCurrent
    //App.g.floorNumCurrent
    countAjax:function(){
      if(this.ajaxCurrent==this.ajaxNum){
        var floorList=App.g.floorList.toJSON();
        for(var i=0,ilen=floorList.length;i<ilen;i++){
          for(var j=0,jlen=floorList[i].roomList.length;j<jlen;j++){
            if(floorList[i].roomList[j].roomScoreId=='' && floorList[i].roomList[j].grade!=2 && floorList[i].roomList[j].roomNum!=App.g.roomName){
              App.g.addOrEdit=0;
              App.g.roomid=floorList[i].roomList[j].roomId;
              App.g.roomName=floorList[i].roomList[j].roomNum;
              $.tips({
                content:'打分成功!',
                stayTime:2000,
                type:"success"
              });
              //Backbone.history.navigate('#givegrade', {trigger: true, replace: true});
              this.isOff=1;
              this.initialize();
              App.loading();
              return;
            }
          }
        }
        $.tips({
          content:'该楼栋寝室已打分完毕!',
          stayTime:2000,
          type:"warn"
        });
        Backbone.history.navigate('#index', {trigger: true, replace: true});
        App.loading();
      }
    }

  });

})();
