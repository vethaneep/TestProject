function setMenu(){
  var menu = $('.myPanel');
  for(var i = 0; i < menu.length; i++){
    var x = $(menu[i]);
    if(window.localStorage.getItem('isLogin')){
      x[0].innerHTML = '<ul data-role="listview" data-theme="a" class="ui-listview ui-group-theme-a">'+
        '<div id="panel_header">'+
        '<img src="css/images/Logo PowerMap.png" id="tor95_logo">'+
        '</div>'+
        '<a href="#first-page" class="ui-btn ui-shadow ui-btn-icon-left ui-icon-action" onclick="setLogout();">ลงชื่อออกจากระบบ</a>'+
        //'<li class="ui-first-child"><a href="javascript:mapView();" id="menu-list" class="ui-btn ui-icon-map-icon ui-btn-icon-left" data-rel="close">แผนที่</a></li>'+
        '<li class="ui-first-child"><a href="#main-page" onclick="mymap.invalidateSize();" id="menu-list" class="ui-btn ui-icon-map-icon ui-btn-icon-left" data-rel="close">แผนที่</a></li>'+
        '<li><a href="#" id="menu-list" class="ui-btn ui-icon-checkin ui-btn-icon-left" data-rel="close" onclick="barcodescanner();">เช็คอิน</a></li>'+
        '<li><a href="#call-van-page" id="menu-list" class="ui-btn ui-icon-car-request ui-btn-icon-left" data-rel="close" data-transition="slidedown">เรียกรถ</a></li>'+
        '<li><a href="#history-page" id="menu-list" class="ui-btn ui-icon-history ui-btn-icon-left" data-rel="close" onclick="selectHistoryEntry();">ประวัติ</a></li>'+
        '<li><a href="#report-page" id="menu-list" class="ui-btn ui-icon-alert ui-btn-icon-left" data-rel="close">แจ้งเหตุ</a></li>'+
        '<li><a href="#news-page" id="menu-list" class="ui-btn ui-icon-comment ui-btn-icon-left show-page-loading-msg" data-rel="close" onclick="getNewsList();">ข่าวสาร</a></li>'+
        '<li><a href="#station-arrival-page" id="menu-list" class="ui-btn ui-icon-station ui-btn-icon-left" data-rel="close" onclick="get_van_status();">สถานี</a></li>'+
        '<li><a href="#contact-page" id="menu-list" class="ui-btn ui-icon-phone ui-btn-icon-left" data-rel="close">ติดต่อ</a></li>'+
        '<li class="ui-last-child"><a href="#about-us-page" id="menu-list" class="ui-btn ui-icon-info ui-btn-icon-left" data-rel="close">เกี่ยวกับ</a></li>'+
        '</ul>';
    }
    else{
      x[0].innerHTML = '<ul data-role="listview" data-theme="a" class="ui-listview ui-group-theme-a">'+
        '<div id="panel_header">'+
        '<img src="css/images/Logo PowerMap.png" id="tor95_logo">'+
        '</div>'+
        '<a href="#login-page" class="ui-btn ui-shadow ui-btn-icon-left ui-icon-user">ลงชื่อเข้าใช้</a>'+
        //'<li class="ui-first-child"><a href="javascript:mapView();" id="menu-list" class="ui-btn ui-icon-map-icon ui-btn-icon-left" data-rel="close">แผนที่</a></li>'+
        '<li class="ui-first-child"><a href="#main-page" onclick="mymap.invalidateSize();" id="menu-list" class="ui-btn ui-icon-map-icon ui-btn-icon-left" data-rel="close">แผนที่</a></li>'+
        '<li><a href="#call-van-page" id="menu-list" class="ui-btn ui-icon-car-request ui-btn-icon-left" data-rel="close" data-transition="slidedown">เรียกรถ</a></li>'+
        '<li><a href="#news-page" id="menu-list" class="ui-btn ui-icon-comment ui-btn-icon-left show-page-loading-msg" data-rel="close" onclick="getNewsList();">ข่าวสาร</a></li>'+
        '<li><a href="#station-arrival-page" id="menu-list" class="ui-btn ui-icon-station ui-btn-icon-left" data-rel="close" onclick="get_van_status();">สถานี</a></li>'+
        '<li><a href="#contact-page" id="menu-list" class="ui-btn ui-icon-phone ui-btn-icon-left" data-rel="close">ติดต่อ</a></li>'+
        '<li class="ui-last-child"><a href="#about-us-page" id="menu-list" class="ui-btn ui-icon-info ui-btn-icon-left" data-rel="close">เกี่ยวกับ</a></li>'+
        '</ul>';
    }

  }
}
