/*global app, $*/

//var APIServerHost= 'http://test.houqinbao.com/gyxt_api';
//var APIServerHost= 'http://120.55.84.193/Geese_Apartment';
var APIServerHost= 'http://ap.houqinbao.com/Geese_Apartment';

window.App = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  Competence: { //帐号功能权限列表，周日月抽查打分功能id，以及各自打分权限
    week:60,
    weekGrade:191,
    day:277,
    dayGrade:289,
    month:278,
    monthGrade:296,
    check:279,
    checkGrade:332,
  },
  g:{
    openid:null,  //微信id
    schoolcode:null,  //学校id
    username:null,  //帐号
    password:null,  //密码
    token:null, //用户token
    type:null,  //打分类型 day,week,month,check
    typeData:null,  //打分类型对应的时间或需要的值
    currentYearId:null, //当前学年
    currentSemesterIndex:null, //当前学期位置
    semesterId:null,  //周打分所需的学期id
    schoolyearid:null,  //学年id 获取抽查列表
    liveAreaId:null,  //打分生活区ID
    liveAreaName:null,  //打分生活区名字
    flatid:null,  //打分楼栋id
    flatName:null,  //打分楼栋名字
    roomList:null,  //楼栋信息（包括寝室信息）
    floorid:null, //楼层id
    floorName:null, //楼层名字
    floorCurrent:null,  //当前打分寝室所在楼层 以0开始
    floorNumCurrent:null, //当前打分寝室所在寝室列表位置 以0开始
    roomName:null,  //当前打分寝室号
    user:null,  //App.Models.Usermodel 用户信息model
    gradesetting:null,  // App.Models.Gradesettings 打分配置model,先判断配置再判断功能权限App.Competence
    liveAreaList:null,  //App.Collections.LiveAreaList 生活区与楼栋数据
    schoolyearlist:null,  //App.Collections.SchoolYearList 学期与周数数据
    floorList:null, //App.Collections.FloorList 打分楼栋寝室信息
    roomNumber:null,  //打分楼栋寝室数量
    notRoomNumber:null, //打分楼栋未打分寝室数量
    gradeTableList:null,  //App.Collections.GradeTableList 打分表列表
    gradeTableId:null,  //打分表id
    roomTypeId:null,  //寝室分分类ID
    bedTypeId:null,  //床位分分类ID
    roomid:null,  //当前打分寝室
    roleList:null,  //App.Collections.RoleList 违章项目列表
    bedList:null, //App.Collections.BedList 床位打分列表
    addOrEdit:null, //第一次打分或修改打分 0第一次 1修改
    roomGradeList:null, //App.Collections.RoomGradeList 寝室打分信息列表
    photoList:null, //App.Collections.PhotoList 寝室照片列表
    roomscoreid:null, //当前已打分寝室的得分ID
    checkId:null,  //当前打分抽查id
    checkName:null, //当前打分抽查名字
    checkList:null,  //App.Collections.CheckList 抽查列表
    checkTableid:null, //抽查打分表id
    checkAreaList:null,  //App.Collections.CheckAreaList抽查项对应的生活区楼栋树状图
    adminRoleIds:null //超级管理员角色列表id
  },
  loading: function loading(status) {
    if (status) {
      $('#loading').addClass('show').removeClass('hide');
    } else {
      $('#loading').addClass('hide').removeClass('show');
    }
  },
  URL: {
    login:APIServerHost + '/public/login/login/', //登录
    getWeekNum:APIServerHost + '/basesetup/timesetup/get_list/', //获得学期周数
    getAllFloor:APIServerHost + '/flatdata/school/get_floor_list/', //获得所有生活区和楼栋信息
    getWeekRoomGrade:APIServerHost + '/evaluation/weekscore/get_list/', //获得楼栋打分信息  周
    getDayRoomGrade:APIServerHost + '/evaluation/dayscore/get_list/', //获得楼栋打分信息  日
    getMonthRoomGrade:APIServerHost + '/evaluation/monthscore/get_list/', //获得楼栋打分信息  月
    getCheckRoomGrade:APIServerHost + '/evaluation/scorecheck/get_list/', //获得楼栋打分信息  抽查
    getGradeTable:APIServerHost + '/evaluation/scsetups/get_list/', //获得打分表
    getGradeTableByTableid:APIServerHost + '/evaluation/scsetups/get_list_table/', //根据tableid获得打分表
    getRoleList:APIServerHost + '/evaluation/llsetups/get_type_list/', //获得违规项目列表
    getWeekBedGrade:APIServerHost + '/evaluation/weekscore/get_bed_message/', //获得床位打分信息  周
    getDayBedGrade:APIServerHost + '/evaluation/dayscore/get_bed_message/', //获得床位打分信息  日
    getMonthBedGrade:APIServerHost + '/evaluation/monthscore/get_bed_message/', //获得床位打分信息  月
    getCheckBedGrade:APIServerHost + '/evaluation/scorecheck/get_bed_message/', //获得床位打分信息  抽查
    uploadImg:APIServerHost + '/public/uploadfile/upload_img/', //上传图片接口
    giveRoomGradeWeek:APIServerHost + '/evaluation/weekscore/add_room_score/', //打寝室分   周
    giveRoomGradeDay:APIServerHost + '/evaluation/dayscore/add_room_score/', //打寝室分   日
    giveRoomGradeMonth:APIServerHost + '/evaluation/monthscore/add_room_score/', //打寝室分   月
    giveCheckGradeMonth:APIServerHost + '/evaluation/scorecheck/add_room_score/', //打寝室分   抽查
    giveBedGradeWeek:APIServerHost + '/evaluation/weekscore/add_bed_score/', //打床位分   周
    giveBedGradeDay:APIServerHost + '/evaluation/dayscore/add_bed_score/', //打床位分   日
    giveBedGradeMonth:APIServerHost + '/evaluation/monthscore/add_bed_score/', //打床位分   月
    giveBedGradeCheck:APIServerHost + '/evaluation/scorecheck/add_bed_score/', //打床位分   抽查
    giveRoleGrade:APIServerHost + '/evaluation/lllegal/special/', //新增、修改寝室违章
    givePhotoGradeWeek:APIServerHost + '/evaluation/weekscore/upload_picture/', //上传打分照片   周
    givePhotoGradeDay:APIServerHost + '/evaluation/dayscore/upload_picture/', //上传打分照片   日
    givePhotoGradeMonth:APIServerHost + '/evaluation/monthscore/upload_picture/', //上传打分照片   月
    givePhotoGradeCheck:APIServerHost + '/evaluation/scorecheck/upload_picture/', //上传打分照片   抽查
    getWeekRoomGradeDetail:APIServerHost + '/evaluation/weekscore/get_room_message/', //获得寝室打分信息  周
    getDayRoomGradeDetail:APIServerHost + '/evaluation/dayscore/get_room_message/', //获得寝室打分信息  日
    getMonthRoomGradeDetail:APIServerHost + '/evaluation/monthscore/get_room_message/', //获得寝室打分信息  月
    getCheckRoomGradeDetail:APIServerHost + '/evaluation/scorecheck/get_room_message/', //获得寝室打分信息  抽查
    getWeekPhotoGrade:APIServerHost + '/evaluation/weekscore/get_pictures/', //获得照片列表信息  周
    getDayPhotoGrade:APIServerHost + '/evaluation/dayscore/get_pictures/', //获得照片列表信息  日
    getMonthPhotoGrade:APIServerHost + '/evaluation/monthscore/get_pictures/', //获得照片列表信息  月
    getCheckPhotoGrade:APIServerHost + '/evaluation/scorecheck/get_pictures/', //获得照片列表信息  抽查
    editRoomGradeWeek:APIServerHost + '/evaluation/weekscore/edit_room_score/', //修改寝室分   周
    editRoomGradeDay:APIServerHost + '/evaluation/dayscore/edit_room_score/', //修改寝室分   日
    editRoomGradeMonth:APIServerHost + '/evaluation/monthscore/edit_room_score/', //修改寝室分   月
    editRoomGradeCheck:APIServerHost + '/evaluation/scorecheck/edit_room_score/', //修改寝室分   抽查
    editBedGradeWeek:APIServerHost + '/evaluation/weekscore/edit_bed_score/', //修改床位分   周
    editBedGradeDay:APIServerHost + '/evaluation/dayscore/edit_bed_score/', //修改床位分   日
    editBedGradeMonth:APIServerHost + '/evaluation/monthscore/edit_bed_score/', //修改床位分   月
    editBedGradeCheck:APIServerHost + '/evaluation/scorecheck/edit_bed_score/', //修改床位分   抽查
    delPhotoGradeWeek:APIServerHost + '/evaluation/weekscore/del_picture/', //删除打分照片   周
    delPhotoGradeDay:APIServerHost + '/evaluation/dayscore/del_picture/', //删除打分照片   日
    delPhotoGradeMonth:APIServerHost + '/evaluation/monthscore/del_picture/', //删除打分照片   月
    getRoleBySpecialid:APIServerHost + '/evaluation/lllegal/get_special_group/', //查寝室违章信息
    getRoomByBan:APIServerHost + '/flatdata/rooms/get_rooms_list/', //按楼栋获取所有宿舍信息
    getCheckList:APIServerHost + '/evaluation/scorecheck/get_scorecheck/', //获取抽查列表
    getCheckArea:APIServerHost + '/evaluation/scorecheck/get_flatBycheck/', //根据checkid获取抽查的楼栋
    getRoleIdsList:APIServerHost + '/rolemanage/roles/get_list/', //获取角色列表
  },
  init: function () {
    'use strict';
    new this.Routers.Route();
    Backbone.history.start();
  }
};

$(document).ready(function () {
  'use strict';
  App.init();
});

Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
Date.prototype.CHWeek = function(){
  switch (this.getDay()) {
    case 0: return '星期日';
    case 1: return '星期一';
    case 2: return '星期二';
    case 3: return '星期三';
    case 4: return '星期四';
    case 5: return '星期五';
    case 6: return '星期六';
  }
}