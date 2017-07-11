/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var localhost = "10.11.1.211";
 var port = "8899";
 var base64 = "";
 var real_img = null;
 var choose_mainType = "";
 var choose_subtype = "";
 var van_id = "";
 var picture_name = "cat.png";
 var app = {
     // Application Constructor
     initialize: function() {
         this.bindEvents();
     },
     // Bind Event Listeners
     //
     // Bind any events that are required on startup. Common events are:
     // 'load', 'deviceready', 'offline', and 'online'.
     bindEvents: function() {
         document.addEventListener('deviceready', this.onDeviceReady, false);
     },
     // deviceready Event Handler
     //
     // The scope of 'this' is the event. In order to call the 'receivedEvent'
     // function, we must explicitly call 'app.receivedEvent(...);'
     onDeviceReady: function() {
         app.receivedEvent('deviceready');
     },
     // Update DOM on a Received Event
     receivedEvent: function(id) {
         var parentElement = document.getElementById(id);
         var listeningElement = parentElement.querySelector('.listening');
         var receivedElement = parentElement.querySelector('.received');

         listeningElement.setAttribute('style', 'display:none;');
         receivedElement.setAttribute('style', 'display:block;');

         console.log('Received Event: ' + id);
     }
 };
 /*ข้ามขั้นตอนนี้*/
 function skip(){
   $.mobile.loading( 'hide' );
   setHeightDiv('#map');
   mymap.invalidateSize();
   setMenu();
   window.location.href='#main-page';
 }

  /*
  Check is device ready?
  output -> uuid of device (String)
  */
  function onDeviceReady() {
    isPhoneGapReady = true;
    return device.uuid;
  }
 /*
 function alert
 input -> message, dialog header
 */
  function alertMessage(message, title) {
    navigator.notification.alert(message, function(){}, title, 'OK');
  }

 /*
 loading spinner
 open spinner -> set class of <a>, <button> or target element to class="show-page-loading-msg" or $.mobile.loading( "show" );
 close spinner -> call script $.mobile.loading( "hide" );
 */
 $( document ).on( "click", ".show-page-loading-msg", function() {
     var $this = $( this ),
         theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
         msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
         textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
         textonly = !!$this.jqmData( "textonly" );
         html = $this.jqmData( "html" ) || "";
     $.mobile.loading( "show", {
             text: "กรุณารอสักครู่",
             textVisible: textVisible,
             theme: theme,
             textonly: textonly,
             html: html
     });
 })
 .on( "click", ".hide-page-loading-msg", function() {
     $.mobile.loading( "hide" );
 });

/*
get nearest station
input -> latitude, longitude
output -> station name (String)
*/
function get_nearest_station_function(lat,lng){
  var url = "http://"+ localhost + ":" + port +"/mobile/get_station/"
  var data = {lat:lat, lng:lng};
  $.ajax({
     type: "POST",
     url: url,
     data:data,
     success: function (response){
       /*
       response is a name of station
       example: "ป้ายเมเจอร์รังสิต"
       */
       alertMessage("สถานีที่ใกล้เคียงท่านในขณะนี้คือ\n" + response, "สถานี");
       /*
       We set div id of each station to station name (Thai)
       generate from station_all.js
       */
       var target = document.getElementById(response); /*find div id = response*/
       target.getElementsByTagName('div')[0].className = "cd-timeline-img cd-location";
       try{
         /*
         get previous element
         Because the target element will be hided by headder so we need to focus on previous div.
         */
         var lastSibling = target.previousSibling.previousSibling;
         /*focus on previous element*/
         lastSibling.scrollIntoView();
       }
       catch(err){
         /*if there are not previous div*/
         var lastSibling = target;
       }

     },
     error: function (request, status, error) {
       //$.mobile.loading( "hide" );
       alertMessage("ค้นหาสถานีที่ใกล้ที่สุดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "สถานี");
     }
   });
}
/*Get position for find nearest station*/
function getGeoStation() {
  $.mobile.loading("show");
  var options = {
   maximumAge: 3000,
   timeout: 50000,
   enableHighAccuracy: true
  };
  var geo_location;
  navigator.geolocation.getCurrentPosition(
   function(position){
     var uuid = onDeviceReady();
     var lat = (position.coords.latitude).toString();
     var lng = (position.coords.longitude).toString();
     /*find nearest Station*/
     $.mobile.loading("hide");
     /*Check if this latLng isin allow area*/
     var myLocation = new L.latLng(lat, lng);
     /*var myBound = mymap.getBounds();*/
     // corner1, 2 value is in index.html
     var corner1 = new L.LatLng(21.7500,90.2080);
     var corner2 = new L.LatLng(0.2080,112.09300);
     var myBound = L.latLngBounds(corner1, corner2);
     bound = myBound.contains(myLocation);
     if(bound){
       get_nearest_station_function(lat, lng);
     }else{
       alertMessage("คุณอยู่นอกพื้นที่บริการรถตู้โดยสาร", "สถานี");
     }
   },
   function(error){
     $.mobile.loading("hide");
     /*
       var lt = 13.98370;
       var lg = 100.61793;
       var myLocation = new L.latLng(lt, lg);
       var myBound = mymap.getBounds();
       bound = myBound.contains(myLocation);
       alert(bound);
       console.log(bound);
     */
     alertMessage("ไม่สามารถเรียกตำแหน่งได้ กรุณเปิด GPS เพื่อใช้ตำแหน่งปัจุบันของคุณ", "สถานี");
   }
   ,
   options
  );
  return geo_location;
}
/*
Get position of van
station_name is previous station_name
within_sta is status of position of vehicle (0-> out of road, 1-> in station, 2-> between station , null -> ?)
status is (arrival or departure) inbound -> arrival, outbound -> departure
*/
function add_van(station_name,within_sta,status){
  if(within_sta == 2){
    /*
    vehicle position is between station
    if van is between station we need to add new van elements between previous station and next station
    */
    var elements = document.getElementById(station_name).getElementsByTagName('div');
    elements[0].className="btw_bus"

  }else if(within_sta == 1 ){
    /*
    Van is in station
    if van is in station we need to change the station icon to van icon
    */
    var dynamic = document.createElement("div");
    dynamic.innerHTML = '<div class="btw_bus"><img src="img/bus_stop.png" alt="Picture"></div><div class="btw_station"></div>';
    dynamic.className = "cd-timeline-block"
    dynamic.id = "bus_icon"
    var elements = document.getElementById(station_name);
    if (elements) {
      if(status == 'inbound'){
        elements.parentNode.insertBefore(dynamic, elements.nextSibling);
      }else if (status == 'outbound'){
        elements.parentNode.insertBefore(dynamic, elements.previousSibling);
      }
    }
  }
}
/*Get position of van and add to #station-arrival-page*/
function get_van_status(){
  var url = "http://"+ localhost + ":" + port +"/vehicleStatus.geojson"
  $.ajax({
     type: "GET",
     url: url,
     success: function (response){
       /*
       response is dictionary of van status

       */
       curr_sta = "";
       sta = {};
       $('#station-arrival-page section').empty(); /*Clear #station-arrival-page*/
       setStation(); /*set station timeline*/

       $(response['features']).each(  function(i, vehicle){
            add_van(vehicle['properties'].prev_sta, vehicle['properties'].within_sta, vehicle['properties'].status);
       });

       /*
       Add notification on vehicle picture
       TODO: Edit this module
       */
       $(response['features']).each(  function(i, vehicle){
         /*
         Counting the van within same station
         output -> sta[curr_sta]

         example:
         ป้ายเมเจอร์รังสิต มีรถตู้ 3 คัน, ป้ายโรงเรียนธัญญบุรีมีรถตู้ 1 คัน จะได้ว่า
         sta["ป้ายเมเจอร์รังสิต"] = 3, sta["ป้ายโรงเรียนธัญญบุรี"] = 1, ...
         */
         if(vehicle['properties'].within_sta == 1 && ( vehicle['properties'].status == 'inbound' || vehicle['properties'].status == 'outbound')){
           curr_sta = vehicle['properties'].prev_sta;
           if (sta[curr_sta]){
             sta[curr_sta] = sta[curr_sta] + 1;
           }else{
             /*default value*/
             sta[curr_sta] = 1;
           }
         }
       });
       /*
       Generate station key list for add badge (notification)
       keys = ["ป้ายเมเจอร์รังสิต", "ป้ายโรงเรียนธัญญบุรี", ..]
       */
       var keys = [];
        for (var key in sta) {
          if (sta.hasOwnProperty(key)) {
            keys.push(key);
          }
        }
        /*Looping for add notification on van icon in station-arrival-page*/
        for (var i=0; i<keys.length ; i++){
          if(sta[keys[i]] > 1){
              var elements = document.getElementById(keys[i]).getElementsByTagName('div');
              var dynamic = document.createElement("span");
              dynamic.className = "badge badge-notify";
              dynamic.innerHTML = sta[keys[i]];
              elements[0].innerHTML = '<img src="img/bus_stop.png" alt="Picture"><span class="badge badge-notify">'+sta[keys[i]]+'</span>';
          }
        }
    },
    error: function (request, status, error) {
      /*if get van fail*/
      alertMessage("ไม่สามารถเรียกดูตำแหน่งรถได้ในขณะนี้", "สถานี")
      setStation();
    }
   });
}
/*
set size of element to fixed with window's size
input -> divname (String)
example: setHeightDiv("#station-arrival-page");
*/
function setHeightDiv(divname){
  /*get size of window*/
   var h =$(window).height();
   var w =$(window).width();
   /*set size to given div*/
   $(divname).height(h);
   $(divname).width(w);
}

function setStationLine(){
  setHeightDiv('#station-div');
  $("div#station-div").width($(window).width()-10);
  $("div#station-div").css('margin-left',5);
  for(var i=1 ; i<= Object.keys(window.station_all).length; i++){
    var name_th = window.station_all[i][1];
    if(window.station_all[i][2]=='in'){
      var content = '<div class="cd-timeline-block-right" id="'+name_th+'"><div class="cd-timeline-img cd-picture"><img src="img/bus_stop.png" alt="Picture"></div><div class="cd-timeline-content"><h2 class="station_name">'+name_th+'</h2></div></div>'
    }else{
      var content = '<div class="cd-timeline-block" id="'+name_th+'"><div class="cd-timeline-img cd-picture"><img src="img/bus_stop.png" alt="Picture"></div><div class="cd-timeline-content"><h2 class="station_name">'+name_th+'</h2></div></div>'
    }
    $('section').append(content);
  }
}
/*Set size of timeline in #station-arrival-page*/
function seStationProperties(){
  /*Right side of timeline*/
  $('.cd-timeline-block-right').height(50);
  $('.cd-timeline-block-right').css('margin-top',0);
  $('.cd-timeline-block-right').css('margin-bottom',50);
  /*Left size of timeline*/
  $('.cd-timeline-block').height(50);
  $('.cd-timeline-block').css('margin-top',0);
  $('.cd-timeline-block').css('margin-bottom',50);
}
/*Generate timeline of station*/
function setStation(){
  setStationLine();
  seStationProperties();
}
setStation();

/*Show map in web view format*/
function mapView(){
  url = "http://"+ localhost + ":" + port +"/mobile_index";
  var inAppRef = cordova.InAppBrowser.open(url, '_blank', 'location=no');
  inAppRef.addEventListener('loadstart', function() {
    window.plugins.spinnerDialog.show();
  });
  inAppRef.addEventListener('loadstop', function() {
    window.plugins.spinnerDialog.hide();
  });

  /*after close web view we will redirect to #station-arrival-page*/
  get_van_status(); /*update van status in #station-arrival-page*/
  window.location.href="#station-arrival-page"; /*redirect to #station-arrival-page*/
}
/*Set Logout view*/
function setLogout(){
  window.localStorage.removeItem('isLogin'); /*remove isLogin variable*/
  setTimeout(null, 5000); /*wait 5 seconds*/
  check_init(); /*initialize and redirect*/
  setMenu(); /*setting menu*/
}
/*
initialize
if user was login the system will sync history record with server and skip login-page
if not the system will redirect to login-page
*/
function check_init(){
  /*
  window.localStorage.getItem('isLogin') == true -> user is login
  window.localStorage.getItem('isLogin') == false -> user is logout
  */
  if (window.localStorage.getItem('isLogin')){
    /*Login: sync history with server*/
    try{
      check_in_sync();
    }
    catch(except){
      alert(except);
    }
    /*redirect to map*/
    //mapView();
    window.location.href = "#main-page";
  }
  else{
    /*Logout: redirect to login-page*/
    $("body").fadeIn(3000,function(){
       window.location.href='#login-page';
    })
  }
}
/*Register function*/
function mobileRegister(){
  /*Get input value*/
  $.mobile.loading("show");
  var reg_username = $('#reg_username')[0].value;
  var reg_password = $('#reg_password')[0].value;
  var reg_confirm_password = $('#reg_confirm_password')[0].value;
  var reg_email = $('#reg_email')[0].value;

  if (reg_password != reg_confirm_password){
    /*confirm password and password not valid*/
    alertMessage("รหัสผ่านไม่ตรงกัน","สมัครสมาชิก");
    $('#reg_confirm_password').focus();
    $.mobile.loading("hide");
    return false;
  }
  else if(reg_password == "" || reg_confirm_password == "" || reg_username == "" || reg_email == ""){
    /*empty input*/
    alertMessage("กรุณากรอกข้อมูลให้ครบ","สมัครสมาชิก");
    $.mobile.loading("hide");
    return false;
  }else{
    /*
    sent data to server
    data: username, password, email, time
    */
    url = "http://"+ localhost + ":" + port +"/mobile/register/";
    data = {username:reg_username, password:reg_password, time:getToday().toString(), email:reg_email};
    $.ajax({
       type: "POST",
       url: url,
       data: data,
       success: function (response){
         window.localStorage.setItem('isLogin',true);
         setMenu();
         $.mobile.loading( "hide" );
         /*show map*/
         //mapView();
         window.location.href = "#main-page";
         /*clear input to default value*/
         $('input#reg_confirm_password')[0].value = "";
         $('input#reg_password')[0].value = "";
         $('input#reg_username')[0].value = "";
       },
       statusCode: {
         /*TODO: change statusCode to error: function (){...}*/
         500: function() {
           alertMessage("ชื่อผู้ใช้และรหัสผ่านไม่ถูกต้อง", "ลงชื่อเข้าใช้");
         }
       }
     });
  }
}
/*
check the username when user is register
input: register username
output: alert Message
*/
function check_duplicate_username(){
  /*get input value*/
  var reg_username = $('#reg_username')[0].value;
  var url = "http://"+ localhost + ":" + port +"/mobile/check_register_user/"
  data = {reg_username:reg_username};
  $.ajax({
     type: "POST",
     url: url,
     data: data,
     success: function (response){
       /*pass : can use this username*/
      return true;
    },
    statusCode: {
      400: function() {
        /*TODO: change statusCode to error: function (){...}*/
        alertMessage("มีชื่อผู้ใช้นี้อยู่ในระบบแล้ว");
        $('#reg_username').focus();
        return false;
      }
    }
   });
}
/*Login function*/
function mobileLogin(){
  $.mobile.loading("show");
  var url = "http://"+ localhost + ":" + port +"/mobile/login/"
  var username = $('input#username')[0].value;
  var password = $('input#password')[0].value;
  data = {username:username, password:password};
  $.ajax({
     type: "POST",
     url: url,
     data: data,
     success: function (response){
       $.mobile.loading("hide");
       window.localStorage.setItem('isLogin',true);
       setMenu();
       //mapView();
       window.location.href = "#main-page";
       /*set to default value*/
       $('input#password')[0].value = "";
     },
     statusCode: {
       500: function() {
         /*TODO: change statusCode to error: function (){...}*/
         $.mobile.loading("hide");
         alert( "invalid Username or Password" );
       }
     }
   });
}

function setDisable_subType(){
  var report_sub_button = document.getElementById('report-sub-button');
  report_sub_button.className = "ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow ui-state-disabled";
}
function setEnable_subType(){
  var report_sub_button = document.getElementById('report-sub-button');
  report_sub_button.className = "ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow";
  $('#report-sub').prop("disabled", false);
}

/*the global variables mainType, subType was set when user choose*/
 function chooseMainType(self){
   choose_mainType = self.options[self.selectedIndex].value;
   if(choose_mainType == "อุบัติเหตุ"){
     setDisable_subType();
   }else{
     setEnable_subType();
   }
 }
 function chooseSubType(self){
   choose_subtype = self.options[self.selectedIndex].value;
 }
 function chooseVanId(self){
   van_id = self.options[self.selectedIndex].value;
 }
 /*Sent report data to server*/
 function pushReportData(){
   /*open loading here*/
   //window.plugins.spinnerDialog.show();
   $.mobile.loading( "show" );
   var today = getToday();
   if (real_img != null){
     encodeBase64();
   }
   /*Get selected data*/
   var detail = document.getElementById('report-detail').value;
   /*sent data to Server*/
   if (choose_mainType == "" || choose_mainType == null || van_id == ""){
     /*close loading here*/
     //window.plugins.spinnerDialog.hide();
     $.mobile.loading( "hide" );
     alertMessage("กรุณาเลือกการแจ้งเหตุ", "แจ้งเหตุ");
     $('#report-main').focus();
     window.location.href = "#report-page";
   }else{
     /**/
     var url = "http://"+ localhost + ":" + port +"/mobile/report/"
     var data = { mainType: choose_mainType.toString(),
                  subType: choose_subtype.toString(),
                  veh_no: van_id,
                  operator_tel: 999,
                  return_check: "0",
                  thumnails: picture_name,
                  direction: "inBound",
                  status:"0",
                  time: today,
                  detail: detail.toString(),
                  base64:base64
                };

     $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (response){
          /*close loading here*/
          //window.plugins.spinnerDialog.hide();
          alertMessage("ส่งข้อมูลสำเร็จ", "รายงาน");
          setDefaultReport();
          /*Redirect to Station Page*/
          window.location.href = "#station-arrival-page";
        },
        error: function (request, status, error) {
          /*In case of sent data to server failed*/
          $.mobile.loading( "hide" );
          alertMessage("แจ้งเหตุไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "แจ้งเหตุ");
        }
      });
   }
 }

 /*Set variable in report page to default*/
 function setDefaultReport(){
   var main_M = document.getElementById('report-main'); /*Report dropdown field*/
   var span_M = main_M.previousSibling; /*Report's text*/
   span_M.innerHTML = "-- เลือกแจ้งเหตุ --"; /*Change span to default text*/
   main_M.getElementsByTagName('option')[0].selected = 'selected'; /*clear value of dropdown*/

   var main_S = document.getElementById('report-sub');
   var span_S = main_S.previousSibling;
   span_S.innerHTML = "-- เลือกประเภท --";
   main_S.getElementsByTagName('option')[0].selected = 'selected';

   var van_ID = document.getElementById('report-van-id');
   var van_ID_S = van_ID.previousSibling;
   van_ID_S.innerHTML = "-- เลือกหมายเลขรถตู้ --";
   van_ID.getElementsByTagName('option')[0].selected = 'selected';

   setDisable_subType(); /*Set subtype to disabled*/

   document.getElementById('report-detail').value = ""; /*clear text area field*/
   document.getElementById('upload-image').src = "css/images/pic_icon.png"; /*Set image to default*/
   /*Clear Global variable*/
   base64 = "";
   real_img = null;
   choose_mainType = "";
   choose_subtype = "";
   van_id = "";
 }
 /*
 Encode image to base64 format
 input -> image path (from 'real_img' variable)
 output -> String of picture in base64 format (save in 'base64' variable)
 */
 function encodeBase64(){
   var img = real_img; /*real_img is Global variable of Report's picture*/
   var canvas = document.createElement("canvas"); /*Create canvas*/
   /*Set Size of canvas*/
   var w = 320; /*set width*/
   var h = 480; /*set height*/
   canvas.width = w;
   canvas.height = h;
   /*Draw image to Canvas*/
   canvas.getContext('2d').drawImage(img,0,0,w,h);/*Draw image on cancvas*/
   var dataURL = canvas.toDataURL("image/png");/*set type of output*/
   /*encode to base64 */
   base64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

 }
 /*take a picture from camera*/
 function onPhotosLoad() {
   navigator.camera.getPicture(function(imageData){
     document.getElementById('upload-image').src = imageData;
     real_img = document.createElement('img');
     real_img.src = imageData;
   },
   function(message){
     /*
     When load photos from camera fail
     do-something
     */
   } ,
     {
       quality: 50,
       encodingType: Camera.EncodingType.PNG,
       destinationType: navigator.camera.DestinationType.FILE_URI,
       correctOrientation: true
     }
  );
 }
/*Load photo from library*/
 function onLibraryLoad() {
   navigator.camera.getPicture(function(imageData){
     document.getElementById('upload-image').src = imageData;
     real_img = document.createElement('img');
     real_img.src = imageData;
   },
   function(message){
     /*
     When load photos from library fail
     do-something
     */
   } ,
     {  quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM // or PHOTOLIBRARY
     }
  );
 }
 /*
 Get date
 output -> "hh:mm:ss dd/mm/yyyy"
 */
 function getToday(){
 	var options = {
     timeZone: 'Asia/Bangkok',
     hour: 'numeric', minute: 'numeric', second: 'numeric',
     year: 'numeric', month: 'numeric', day: 'numeric'
     },
   formatter = new Intl.DateTimeFormat([], options);
   var date = (new Date()).toLocaleString([], options);
   var arr = date.split(' ');// Split date and time
   var day = arr[0];
   var today = arr[1] + ' ' + day.split(",")[0];
   try{
     /*generate picture_name*/
     var time = arr[1].split(':');
     var uuid = onDeviceReady();
     picture_name = time[0] + time[1] + time[2] + (uuid.split('-')[0]).toString() + ".png";
   }
   catch(err){
     /*Pass*/
   }
   return today
 }

 /*
 sent data of car request to Server
 input -> uuid, lat, lng, time(Generate from getToday())
 output -> Alert message
 */
 function pushGetVanData(uuid, lat, lng){
   var today = getToday(); /*get time*/
   var url = "http://"+ localhost + ":" + port +"/mobile/request/"; /*Generate path*/
   var data = {uuid: uuid, lat: lat, lng: lng, time: today} /*assign data to correct format*/
   $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function (response){
        /*TODO using spinnerDialog instead*/
        $.mobile.loading( "hide" ); /*hide to spinner*/
        alertMessage("เรียกรถสำเร็จ", "เรียกรถ");
        window.location.href = "#station-arrival-page"; /*redirect to station page*/
      },
      function(error){
        /*sent data to server failed*/
        $.mobile.loading( "hide" );
        alertMessage("ระบบไม่สามารถส่งตำแหน่งของคุณไปนังเซริฟเวอร์ได้", "เรียกรถ");
        window.location.href = "#station-arrival-page"; /*redirect to station page*/
      }
    });
 }

/*Get location for request car function*/
 function VanRequest() {
   $.mobile.loading( "show" );
	 var options = {
	 	maximumAge: 3000,
	 	timeout: 50000,
	 	enableHighAccuracy: true
	 };
   var geo_location;
	 navigator.geolocation.getCurrentPosition(
	 	function(position){
      /*get uuid*/
      var uuid = onDeviceReady();
      /*get lat, lng*/
      var lat = (position.coords.latitude).toString();
      var lng = (position.coords.longitude).toString();
      /*call pushGetVanData to sent data to server*/
      pushGetVanData(uuid, lat, lng);
	 	},
	 	function(error){
      alertMessage("ไม่สามารถเรียกตำแหน่งได้ กรุณาเปิด GPS เพื่อส่งตำแหน่ง", "เรียกรถ");
      $.mobile.loading( "hide" );
	 	}
	 	,
	 	options
	 );
}
/*- - - - - - - - - - - - - - - - - - News - - - - - - - - - - - - - - - - - */
/*Generate List of News*/
var news_list = null;
function getNewsList(){
  var url = "http://"+ localhost + ":" + port +"/mobile/news/";
  $.ajax({
     type: "GET",
     url: url,
     success: function (response){
       $.mobile.loading( "hide" );
       news_list = response;
       /*Create list of view in #news-page*/
       setNewsFeed(response);
     },
     error: function (request, status, error) {
       $.mobile.loading( "hide" );
       alertMessage("ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง", "ข่าวสาร");
     }
   });
}
/*
Create list of News in #news-page
input -> response (dictionary) contains
{ veh_no, mainType, subType, direction, detail, time, thumnails }
*/
function setNewsFeed(response){
  /*Set header of news page*/
  var nav = $('.ui-header .ui-bar-inherit');
  var nav_h = nav.height(); /*get height of header*/
  var news_content = $('div.ui-content.scroll_down');
  news_content.css('top', nav_h); /*set top of news list*/
  setHeightDiv('#news-listview');/*set size of news list to fit with window*/
  $('#news-listview').empty(); /*Clear list*/
  /*Get <ul> of News*/
  var unlist = document.getElementById('news-listview');
  var url = "http://"+ localhost + ":" + port +"/images/"; /*Path to images folder in server*/

  for(var i=0; i < Object.keys(response).length; i++){
    /*Create element list*/
    veh_no = response[i].veh_no; /* van number*/
    mainType = response[i].mainType; /*report type*/
    subType = response[i].subType; /*report sub type*/
    direction = response[i].direction; /*direction of van (inbound, outbound)*/
    detail = response[i].detail; /*detail of report*/
    time = response[i].time; /*datetime*/
    thumnails = response[i].thumnails; /*picture path*/
    thumnails = thumnails.replace('./',url); /*replace picture path with Server url*/
    /*Create <li>*/
    var li = document.createElement("li");
      li.className = "ui-li-has-thumb ui-first-child ui-last-child"; /*set class to <li>*/
      /*
      set content, News detail to <li> and action onclick these element it will call
      setNewsDetail(veh_no, mainType, subType, direction, detail, thumnails, time);
      */
      li.innerHTML =  "<a href='#news-page-dialog' class='ui-btn ui-btn-icon-right ui-icon-carat-r' onclick='setNewsDetail"+"(\""+
                        veh_no+"\",\""+
                        mainType+"\",\""+
                        subType+"\",\""+
                        //direction+"\",\""+
                        detail+"\",\""+
                        thumnails+"\",\""+
                        time+"\""
                        +");'>"+
                          "<img src='"+thumnails+"' class='news-img'/>"+
                          "<h3>" + mainType + "</h3>"+
                          "<p>Time: " + time + "</p>"+
                          "</a>";
      li.setAttribute("onclick", "setHistoryDialog('news_"+i+"')");
      li.setAttribute("id", "'news_"+i+"'");
      unlist.appendChild(li); /*Add <li> to <ul>*/
  }/*End for*/
}
/*
Generate given feed in #news-page
input -> mainType
output -> feed of mainType
example:
getFeedList('อุบัติเหตุ');
return List of "อุบัติเหตุ"
*/
function getFeedList(feed){
  /*Set header of news page*/
  var nav = $('.ui-header .ui-bar-inherit');
  var nav_h = nav.height();
  var news_content = $('div.ui-content.scroll_down');
  news_content.css('top', nav_h);
  setHeightDiv('#news-listview');
  $('#news-listview').empty();
  /*news_list is global variable caontain List of news Generate from getNewsList()*/
  if(news_list == null){
    var msg = "ไม่พบข้อมูลของ" + feed;
    alertMessage(msg, feed);
    return false;
  }
  /*assign news list to response variable*/
  response = news_list;
  var unlist = document.getElementById('news-listview');
  var url = "http://"+ localhost + ":" + port +"/images/";
  for(var i=0; i < Object.keys(response).length; i++){
    /*Create element list*/
    veh_no = response[i].veh_no;
    mainType = response[i].mainType;
    subType = response[i].subType;
    direction = response[i].direction;
    detail = response[i].detail;
    time = response[i].time;
    thumnails = response[i].thumnails;
    thumnails = thumnails.replace('./',url);
    /*Create <li> element*/
    var li = document.createElement("li");
    li.className = "ui-li-has-thumb ui-first-child ui-last-child";
    li.innerHTML =  "<a href='#news-page-dialog' class='ui-btn ui-btn-icon-right ui-icon-carat-r' onclick='setNewsDetail"+"(\""+
                      veh_no+"\",\""+
                      mainType+"\",\""+
                      subType+"\",\""+
                      //direction+"\",\""+
                      detail+"\",\""+
                      thumnails+"\",\""+
                      time+"\""
                      +");'>"+
                        "<img src='"+thumnails+"' class='news-img'/>"+
                        "<h3>" + mainType + "</h3>"+
                        "<p>Time: " + time + "</p>"+
                        "</a>";
    li.setAttribute("onclick", "setHistoryDialog('news_"+i+"')");
    li.setAttribute("id", "'news_"+i+"'");

    if (mainType == feed){
      /*Filter just given feed*/
      unlist.appendChild(li);
    }
    if (feed == ''){
      /*
      if feed == '' means all of news list.
      To append all element.
      */
      unlist.appendChild(li);
    }
  }
}
/*Set News dialog*/
function setNewsDetail(veh_no, mainType, subType, /*direction,*/ detail, thumnails, time){
  document.getElementById('news-picture').src = thumnails;
  document.getElementById('news-header').innerHTML = mainType;
  document.getElementById('news_mainType').innerHTML = mainType;
  document.getElementById('news_veh_no').innerHTML = veh_no;
  document.getElementById('news_subType').innerHTML = subType;
  //document.getElementById('news_direction').innerHTML = direction;
  document.getElementById('news_detail').innerHTML = detail;
  document.getElementById('news_time').innerHTML = time;
}
/*- - - - - - - - - - - - - - - - - - SQLITE - - - - - - - - - - - - - - - - - */
var db_name = "Mytest";
var version = "1.0";
var maxSize = 65536;
var db = openDatabase(db_name, version, db_name, maxSize);
create_database();
//drop_database("entries"); /*Drop database*/

function addRecordToSQLite(response){
  for(var i=0; i < Object.keys(response).length; i++){
    uuid = response[i].uuid;
    date = response[i].date;
    van_id = response[i].idx;
    lat = response[i].lat;
    lng = response[i].lng;
    direction = response[i].direction;
    driver_name = response[i].driver_name;
    plate = "Plate number";
    license = "License id";
    console.log(isHas(uuid,date));
  }
  return
}
function isHas(uuid,date){
  console.log(uuid + ", " + date);
  var x = false;
  db.transaction(
    function(transaction){
      transaction.executeSql(
        "SELECT * FROM entries WHERE uuid = ? AND check_in_date = ?;", [uuid, date],
        function(transaction, result){

        if (result.rows.length == 0){
        /*appear in Server but in SQLite, need to create entry in SQLite*/
              createEntry(uuid, van_id, plate, license, driver_name, direction, lat, lng, date, "Unknown");
        }else{

        }
          return true;
        },
        function(){
          return false;
        }
      );
    }
  );
  return x;
}
function check_in_sync(){
  /*Sync check in data with External server when user login*/
  var url = "http://"+ localhost + ":" + port +"/mobile/check-in-sync/";
  uuid = onDeviceReady();
  //uuid = "379BE2F1-61A5-41B8-B9C8-D33F200F263B";
  var data = {uuid:uuid};
  $.ajax({
     type: "POST",
     url: url,
     data: data,
     success: function (response){
       addRecordToSQLite(response);
       //window.location.href="#login-page";
     },
     error: function (request, status, error) {
       //alert(error);
     }
   });
}

/*Drop SQLite table*/
function drop_database(db_name){
  db.transaction(
    function(transaction){
      transaction.executeSql('DROP TABLE IF EXISTS ' + db_name);
    }
  );
}

/*Create table name entries */
/*TODO change database name*/
function create_database(){
  db.transaction(
    function(transaction){
      transaction.executeSql(
        "CREATE TABLE IF NOT EXISTS entries " +
        " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
        " uuid VARCHAR, " +
        " idx VARCHAR, " +
        " plate VARCHAR, " +
        " license_number VARCHAR, " +
        " driver_name VARCHAR, " +
        " direction VARCHAR, " +
        " lattitude VARCHAR, " +
        " longitude VARCHAR, " +
        " check_in_date VARCHAR, " +
        " station_name VARCHAR" +
        " );"
      );
    }
  );
}
/*insert history data to SQLite*/
function createEntry(uuid, idx, plate, license_number, driver_name, direction, lat, lng, check_in_date, station_name){
  db.transaction(
    function(transaction){
      transaction.executeSql(
        "INSERT INTO entries (uuid, idx, plate, license_number, driver_name, direction, lattitude, longitude, check_in_date, station_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [uuid, idx, plate, license_number, driver_name, direction, lat, lng, check_in_date, station_name],
        function(){
          return true;
        },
        function(error){
          //alert("error" + error);
          //alertMessage("", "");
          return false;
        }
      );
    }
  );
}
/*Set data in History dialog*/
function setHistoryDialog(id){
  db.transaction(
    function(transaction){
      transaction.executeSql(
        "SELECT * FROM entries WHERE id = ?;",[id],
        function(transaction, result){
          for(var i=0; i<result.rows.length; i++){
            var row = result.rows.item(i);
            document.getElementById("history_check-in-date").innerHTML = row.check_in_date.split(' ')[1];
            document.getElementById("history_check-in-time").innerHTML = row.check_in_date.split(' ')[0];
            //document.getElementById("history_check-in-position").innerHTML = row.lattitude + ", " + row.longitude;
            document.getElementById("history_check-in-position").innerHTML = row.station_name;
            document.getElementById("history_check-in-driver-name").innerHTML = row.driver_name;
            document.getElementById("history_check-in-driver-license").innerHTML = row.license_number;
            document.getElementById("history_check-in-plate-number").innerHTML = row.plate;
            document.getElementById("history_check-in-van-number").innerHTML = row.idx;
          }
        },
        function(){
            //alert("select error");
            //alertMessage("", "");
        }
      );
    }
  );
  return true;
}
/*Set History List*/
function selectHistoryEntry(){
  setHeightDiv('#history-listview');
  $('#history-listview').empty();
  var unlist = document.getElementById('history-listview');
  db.transaction(
    function(transaction){
      transaction.executeSql(
        "SELECT * FROM entries order by id DESC;",[],
        function(transaction, result){
          for(var i=0; i<result.rows.length; i++){
            var row = result.rows.item(i);
            /*Create element list*/
            var li = document.createElement("li");
            li.innerHTML =  "<a href='#history-page-dialog' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>"+
                                "<img src='css/images/Logo Van.png' class='news-img'/>"+
                                "<h3>เวลา: " + row.check_in_date + "</h3>"+
                                "<p> หมายเลขรถ: " + row.idx + " ทะเบียน: " + row.plate + "</p>"+
                                "</a>";
            li.setAttribute("onclick", "setHistoryDialog("+row.id+")");
            li.setAttribute("id", row.idx);
            li.className = "ui-li-has-thumb ui-first-child ui-last-child";
            unlist.appendChild(li);          }
        },
        function(){
            //alert("select error");
            //alertMessage("", "");
        }
      );
    }
  );
  //alert("exit selectHistoryEntry()");
  return true;
}
/*- - - - - - - - - - - - - - - End SQLITE - - - - - - - - - - - - - - - - - */

function saveCheckinData(uuid,username,date,van_id,driver_name, direction, plate, license) {
  var options = {
   maximumAge: 3000,
   timeout: 50000,
   enableHighAccuracy: true
  };
  var geo_location;
  navigator.geolocation.getCurrentPosition(
   function(position){
     var lat = (position.coords.latitude).toString();
     var lng = (position.coords.longitude).toString();
     //alert(lat + " " + lng);
      sentCheckInData(uuid,username,date,van_id,driver_name,lat,lng, direction, plate, license);
   },
   function(error){
     //alert("Get Location failed: " + error);
     alertMessage("ระบบไม่สามารถเรียกตำแหน่งได้ กรุณาเปิด GPS แล้วลองอีกครั้ง", "เช็คอิน");
     window.location.href = "#station-arrival-page";
   }
   ,
   options
  );
}
function sentCheckInData(uuid, username, date, van_id, driver_name, lat, lng, direction, plate, license){
  /*in sucess case Server will return nearest station name*/
  url = "http://"+ localhost + ":" + port +"/mobile/check-in/";
  data = {uuid:uuid,
          idx:van_id,
          driver_name:driver_name,
          direction:direction,
          lat:lat,
          lng:lng,
          time:date.toString()
  };
  $.ajax({
     type: "POST",
     url: url,
     data: data,
     success: function (response){
       /*inserted to Sever*/
       msg = "บันทึกข้อมูลแล้ว \nเช็คอิน @" + response;
       alertMessage(msg, "เช็คอิน");
       /*insert to SQLite*/
       createEntry(uuid, van_id, plate, license, driver_name, direction, lat, lng, date.toString(), response);
       window.location.href="#history-page";
       selectHistoryEntry();
     },
     error: function (request, status, error) {
       alertMessage("บันทึกแล้ว", "เช็คอิน");
       /*
       can't insert to server
       insert to SQLite
       */
       createEntry(uuid, van_id, plate, license, driver_name, direction, lat, lng, date.toString(), "Unknown");
       window.location.href="#history-page";
       selectHistoryEntry();
     }
   });
}
function barcodescanner(){
       cordova.plugins.barcodeScanner.scan(
      function (result) {
          /*alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);*/
          if(result.text != ""){
            var inAppRef = cordova.InAppBrowser.open(result.text, '_blank', 'location=no');
            inAppRef.addEventListener('loadstart', function() {
              /*Debuging in Vethanee's computer must hidding spinnerDialog because I have a problem with spinnerDialog plugin*/
              //window.plugins.spinnerDialog.show();
            });
            inAppRef.addEventListener('loadstop', function() {
              //window.plugins.spinnerDialog.hide();
            });
          }

          try {
            inAppRef.addEventListener('loadstop', function() {
              inAppRef.executeScript({
                code: "document.getElementsByClassName('info')[0].innerText"
              }, function(html) {
                /*Save this html in local storage*/
                window.localStorage.setItem("checkin-info", html);
                /*
                Access field in returned HTML
                index 0 : driver_field
                index 1 : license_field
                index 2 : status_field
                index 3 : plate_field
                index 4 : vehicle_number_field
                index 5 : direction_field
                */
                //alert(html[0]);
                var driver_field = html[0].split("\n")[0];
                var driver = driver_field.split(" : ")[1];

                var license_field = html[0].split("\n")[2];
                var license = license_field.split(" : ")[1];
                //alert(license_field);

                var plate_field = html[0].split("\n")[6];
                var plate = plate_field.split(" : ")[1];

                /*var direction_field = html[0].split("\n")[5];
                var direction = direction_field.split(" : ")[1];*/
                direction = "unknown";
                /*Get vehicle id from URL*/
                var arr = (result.text).split('qrcode/');/*GET VEHICLE ID FROM URL*/
                /*
                arr[0] = HOSTNAME
                arr[1] = CurrentVehicle ID
                */

                /*
                send check-in data to server contains
                uuid, username(from login), datetime, van id, driver name, direction
                */
                var uuid = onDeviceReady();
                var username = "user1";
                var date = getToday();
                var van_id = arr[1];
                var driver_name = driver;
                /*Save data in Local database (SQLite)*/
                //create_database();
                /*Sent data to external*/
                saveCheckinData(uuid, username, date, van_id, driver_name, direction, plate, license);
                //use java script to generate dialog and list of history
                //by pulling data from server in json

                /*Redirect to history page*/

              });
            });
          } catch (err) {
            //window.localStorage.setItem("checkin-info", err);
            //alert(err);
            //mapView();
            window.location.href = "#station-arrival-page";
          }
      },
      function (error) {
          alertMessage("การสแกนล้มเหลว กรุณาลองใหม่อีกครั้ง", "เช็คอิน");
          //alert("Scanning failed: " + error);
          //mapView();
          window.location.href = "#station-arrival-page";
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE,PDF_417,EAN CODE,EAN CODE", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true // iOS
      }
   );
}
