// Dom7
// sudo cordova build android --release -- --keystore=mcoll.keystore --storePassword=bismillah --alias=mcoll --password=bismillah
// C:\Program Files\Java\jre1.8.0_221\bin>keytool -genkey -v -keystore mcoll.keystore -alias mcoll -keyalg RSA -keysize 2048 -validity 10000

// keytool -genkey -v -keystore [insert nama].keystore -alias [insert alias] -keyalg RSA -keysize 2048 -validity 10000
// cordova build android --release -- --keystore=[insert nama].keystore --storePassword=[insert password pas bikin keystore] --alias=[insert alias] --password=[insert password pas bikin keystore]


// GLOBAL VARIABLES
// var site = 'http://mcollection.cloudmnm.com';
var site = 'http://pua-test.cloudmnm.com';
var hari = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
var bulan = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
var appVer = 0;
var data_user;
var long = '', lat = '', acc = '';
var app = new Framework7({
  id: 'com.medianusamandiri.absensipua',
  root: '#app',
  init: false,
  routes: routes,
});


// INITIALIZE APP
document.addEventListener('deviceready', function() {
  app.init();

  document.addEventListener("backbutton", onBackPressed, false);
  cordova.getAppVersion.getVersionNumber(function (version) {
    appVer = version;
    $('#appversion').html(version);
  });

  screen.orientation.lock('portrait');

  navigator.geolocation.watchPosition(function(position){
    long = position.coords.longitude;
    lat = position.coords.latitude;
    acc = position.coords.accuracy;
  }, function(){
    console.log("gagal mengambil koordinat posisi");
  }, {
    enableHighAccuracy: true,
    maximumAge: 5 * 60 * 1000
  });
});

// UTILITY FUNCTIONS
function onBackPressed(){
  app.dialog.confirm('Keluar aplikasi?', 'Konfirmasi', function(){
    navigator.app.exitApp();
  }, function(){
    return;
  })
}

function comma(el){
  if(el.value == '') el.value = 0;
  el.value = parseInt((el.value).replace(/\D/g, '')).toLocaleString('id-ID');
}

function lpad(str, len, padstr){
  var pad = '';
  for(var i = 0; i < len; i++){
    pad += padstr;
  }

  return (pad + str).slice(len*-1);
}