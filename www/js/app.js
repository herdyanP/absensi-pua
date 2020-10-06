// Dom7
// sudo cordova build android --release -- --keystore=mcoll.keystore --storePassword=bismillah --alias=mcoll --password=bismillah
// C:\Program Files\Java\jre1.8.0_221\bin>keytool -genkey -v -keystore mcoll.keystore -alias mcoll -keyalg RSA -keysize 2048 -validity 10000

// keytool -genkey -v -keystore [insert nama].keystore -alias [insert alias] -keyalg RSA -keysize 2048 -validity 10000
// cordova build android --release -- --keystore=[insert nama].keystore --storePassword=[insert password pas bikin keystore] --alias=[insert alias] --password=[insert password pas bikin keystore]

// Init App
var app = new Framework7({
  id: 'com.medianusamandiri.absensipua',
  root: '#app',
  init: false,
  // theme: theme,
  routes: routes,
});

// var site = 'http://mcollection.cloudmnm.com';
var site = 'http://pua-test.cloudmnm.com';
var hari = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
var bulan = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
var appVer = 0;
var data_user;
var long = '', lat = '', acc = '';

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


function cekCIF(src, cif){
  var tabel = '';
  var dt1 = '';
  if(cif != ''){
    $.ajax({
      url: site+'/API/CIF/'+cif+'/',
      method: 'GET',
      success: function(result){
        tabel = '<table style="width: 100%; padding-left: 16px;">\
            <tr>\
              <td colspan="3" style="text-align: left;"><b>Informasi Nasabah</b></td>\
            </tr>\
            <tr>\
              <td width="15%"><b>CIF</b></td>\
              <td width="5%"><b>:</b></td>\
              <td width="80%"><b>'+result[0].CIF+'</b></td>\
            </tr>\
            <tr>\
              <td width="15%"><b>Nama</b></td>\
              <td width="5%"><b>:</b></td>\
              <td width="80%"><b>'+result[0].SSNAMA+'</b></td>\
            </tr>\
            <tr>\
              <td width="15%"><b>Alamat</b></td>\
              <td width="5%"><b>:</b></td>\
              <td width="80%"><b>'+result[0].SSALAMAT+'</b></td>\
            </tr>\
          </table>\
        ';

        switch(src){
          // case "cif":
          //   dt1 = '<table>\
          //       <thead>\
          //         <tr>\
          //           <th class="label-cell">Rekening</th>\
          //           <th >Produk</th>\
          //           <th class="numeric-cell">Saldo</th>\
          //         </tr>\
          //       </thead>\
          //       <tbody>\
          //   ';

          //   for(var i = 0; i < result.length; i++){
          //     dt1 += '<tr>\
          //               <td class="label-cell">'+result[i].SSREK+'</td>\
          //               <td >'+result[i].jpinjaman+'</td>\
          //               <td class="numeric-cell">'+parseInt(result[i].saldo).toLocaleString('id-ID')+'</th>\
          //             </tr>\
          //     ';
          //   }

          //   dt1 += '</tbody>\
          //         </table>\
          //     ';

          //   $('#rekening_cif').html(dt1);
          //   $('#detil_cif').html(tabel);
          //   break;

          case "coll_s":
            dt1 = '<table style="width: 100%">\
                <thead>\
                    <th style="width: 20%;" class="label-cell"><b>Rekening</b></th>\
                    <th style="width: 30%;"><b>Nama Produk</b></th>\
                    <th style="width: 20%;" class="numeric-cell"><b>Saldo Sekarang</b></th>\
                    <th style="width: 10%;"><b>Update Terakhir</b></th>\
                    <th style="width: 10%;"><b>Status</th>\
                    <th style="width: 10%;"></th>\
                  </tr>\
                </thead>\
                <tbody>\
            ';

            var back1 = "#e6ecf2";
            var back2 = "#ffffff";

            for(var i = 0; i < result.length; i++){
              dt1 += '<tr style="background: ' +(i % 2 == 0? back1 : back2)+ '; border-left: solid black 2px; border-right: solid black 2px;">\
                        <td style="width: 20%;" class="label-cell"><b>'+result[i].SSREK+'</b></td>\
                        <td style="width: 30%;"><b>'+result[i].jpinjaman+'</b></td>\
                        <td style="width: 20%;" class="numeric-cell"><b>'+parseInt(result[i].saldo).toLocaleString('id-ID')+'</b></th>\
                        <td style="width: 10%;"><b>'+result[i].SSTGL+'</b></td>\
                        <td style="width: 10%;"><b>'+(result[i].STATUS == 'A' ? 'Aktif' : 'Pasif')+'</b></td>\
                        <td style="width: 10%;" ><a onclick="proses(\'simpanan\', \''+result[i].CIF+'\', \''+result[i].SSREK+'\', \''+result[i].SSNAMA+'\', \''+result[i].saldo+'\', '+result[i].LIMIT+')">Proses</a></td>\
                      </tr>\
              ';
            }

            dt1 += '</tbody>\
                  </table>\
              ';

            $('#rekening_colls').html(dt1);
            $('#detil_colls').html(tabel);
            break;

          // case "coll_a":
          //   $('#detil_colla').html(tabel);
          //   break;
        }
      }
    });
  }
}

function cekHist(cif, start){
  var temp = {
    "cif": cif,
    "start": start
  };

  // var tabel = '';
  var dt1 = '';
  if(cif != ''){
    $.ajax({
      url: site+'/API/history/',
      method: 'POST',
      data: JSON.stringify(temp),
      success: function(result){
        // tabel = '<table style="width: 100%; padding-left: 16px;">\
        //     <tr>\
        //       <td colspan="3" style="text-align: left;"><b>Informasi Nasabah</b></td>\
        //     </tr>\
        //     <tr>\
        //       <td width="15%"><b>CIF</b></td>\
        //       <td width="5%"><b>:</b></td>\
        //       <td width="80%"><b>'+result[0].CIF+'</b></td>\
        //     </tr>\
        //     <tr>\
        //       <td width="15%"><b>Nama</b></td>\
        //       <td width="5%"><b>:</b></td>\
        //       <td width="80%"><b>'+result[0].SSNAMA+'</b></td>\
        //     </tr>\
        //     <tr>\
        //       <td width="15%"><b>Alamat</b></td>\
        //       <td width="5%"><b>:</b></td>\
        //       <td width="80%"><b>'+result[0].SSALAMAT+'</b></td>\
        //     </tr>\
        //   </table>\
        // ';

        dt1 = '<div class="data-table" >\
              <table>\
                <thead>\
                    <th class="label-cell"><b>No. </b></th>\
                    <th><b>Nomor Struk</b></th>\
                    <th><b>Tanggal Transaksi</b></th>\
                    <th><b>Nomor Rekening</b></th>\
                    <th class="numeric-cell"><b>Jumlah Setoran</b></th>\
                    <th><b>Petugas</b></th>\
                  </tr>\
                </thead>\
                <tbody>\
            ';

            var back1 = "#e6ecf2";
            var back2 = "#ffffff";
            var no = start;

            for(var i = 0; i < result.length; i++){
              no++;
              dt1 += '<tr style="background: ' +(i % 2 == 0? back1 : back2)+ '; border-left: solid black 2px; border-right: solid black 2px;">\
                        <td class="label-cell"><b>'+no+'</b></td>\
                        <td><b>'+result[i].NO_TRANSAKSI+'</b></td>\
                        <td><b>'+result[i].TANGGAL+'</b></td>\
                        <td><b>'+result[i].ID_SIMPANAN+'</b></td>\
                        <td class="numeric-cell"><b>'+parseInt(result[i].NOMINAL).toLocaleString('id-ID')+'</b></th>\
                        <td><b>'+result[i].ID_USER+'</b></td>\
                      </tr>\
              ';
            }

            dt1 += '</tbody>\
                  </table>\
                  </div>\
                  <div class="data-table-footer">\
                    <div class="data-table-pagination">\
                      <a href="#" onclick="cekHist(\''+cif+'\', '+(start-10)+')" class="link ' +(start == 0 ? 'disabled' : '')+ '">\
                        <i class="icon icon-prev color-gray"></i>\
                      </a>\
                      <a href="#" onclick="cekHist(\''+cif+'\', '+(start+10)+')" class="link ' +(result.length < 10 ? 'disabled' : '')+ '">\
                        <i class="icon icon-next color-gray"></i>\
                      </a>\
                    </div>\
                  </div>\
              ';

            $('#rekening_history').html(dt1);
            // $('#detil_history').html(tabel);
      }
    })
  }
}

// function proses(jenis, cif, rek, nama, sal, limit){
//   app.dialog.create({
//     title: 'Setoran',
//     closeByBackdropClick: false,
//     content: 
//       '<div class="list no-hairlines no-hairlines-between">\
//         <ul>\
//           <li class="item-content item-input">\
//             <div class="item-inner">\
//               <div class="item-input-wrap">\
//                 <input type="tel" pattern="[0-9]" name="nominal" id="nominal" oninput="comma(this)" style="text-align: right; font-size: 24px;" autocomplete="off"/>\
//               </div>\
//             </div>\
//           </li>\
//         </ul>\
//       </div>',
//     buttons: [
//     {
//       text: 'Batal',
//       onClick: function(dialog, e){
//         dialog.close();
//       }
//     },{
//       text: 'Simpan',
//       onClick: function(dialog, e){
//         // if(st1 > 0 && st2 > 0){
//           var nominal = parseInt($('#nominal').val().replace(/\D/g, ''));
//           var saldo = sal.replace(/\D/g,'');
//           var newsaldo = parseInt(saldo) + parseInt(nominal);
//           var temp = {
//             act : "insert",
//             jenis_print : "setoran",
//             jenis : jenis,
//             cif : cif,
//             rek : rek,
//             nominal : nominal,
//             nama : nama,
//             user : iduser,
//             saldo : newsaldo,
//             TOKEN : token
//           }
  
//           if(nominal + limit <= limit_harian){
//             $.ajax({
//               url: site+"/API/setoran/",
//               method: "POST",
//               data: JSON.stringify(temp),
//               success: function(result){

//                 console.log(result[0].idx);
//                 if(result[0].RESULT == "1"){
//                   app.toast.create({
//                     text: "Setoran Berhasil",
//                     closeTimeout: 3000,
//                     closeButton: true
//                   }).open();

//                   dialog.close();

//                   // previewSetoran(result[0].idx);
//                   printSetoran(result[0].idx);

//                   app.views.main.router.refreshPage();
//                 } else if(result[0].RESULT == "2"){
//                   app.toast.create({
//                     text: "Setoran Gagal",
//                     closeTimeout: 3000,
//                     closeButton: true
//                   }).open();
//                   dialog.close();
//                   app.views.main.router.refreshPage();
//                 } else {
//                   app.toast.create({
//                     text: "Unknown Error",
//                     closeTimeout: 3000,
//                     closeButton: true
//                   }).open();
//                   dialog.close();
//                   app.views.main.router.refreshPage();
//                 }
//               }
//             })
//           } else {
//             app.toast.create({
//               text: "Setoran Untuk Rekening Tersebut Telah Mencapai Batas Harian. Membatalkan Proses Setoran.",
//               closeTimeout: 3000,
//               closeButton: true
//             }).open();
//           }
//         /* } else {
//           app.toast.create({
//             text: "File CSV / Setoran Belum Diupload Di Core, Silahkan Hubungi Admin / Back Office.",
//             closeTimeout: 3000,
//             closeButton: true
//           }).open();
//         } */
//       }
//     }]
//   }).open();
// }

function proses(jenis, cif, rek, nama, sal, limit){
  window.DatecsPrinter.listBluetoothDevices(function(devices){
    window.DatecsPrinter.connect(devices[0].address, function(){

      app.dialog.create({
        title: 'Setoran',
        closeByBackdropClick: false,
        content: 
          '<div class="list no-hairlines no-hairlines-between">\
            <ul>\
              <li class="item-content item-input">\
                <div class="item-inner">\
                  <div class="item-input-wrap">\
                    <input type="tel" pattern="[0-9]" name="nominal" id="nominal" oninput="comma(this)" style="text-align: right; font-size: 24px;" autocomplete="off"/>\
                  </div>\
                </div>\
              </li>\
            </ul>\
          </div>',
        buttons: [
        {
          text: 'Batal',
          onClick: function(dialog, e){
            dialog.close();
          }
        },{
          text: 'Simpan',
          onClick: function(dialog, e){
            // if(st1 > 0 && st2 > 0){
              var nominal = parseInt($('#nominal').val().replace(/\D/g, ''));
              var saldo = sal.replace(/\D/g,'');
              var newsaldo = parseInt(saldo) + parseInt(nominal);
              var temp = {
                act : "insert",
                jenis_print : "setoran",
                jenis : jenis,
                cif : cif,
                rek : rek,
                nominal : nominal,
                nama : nama,
                user : iduser,
                saldo : newsaldo,
                TOKEN : token
              }
      
              if(nominal + limit <= limit_harian){
                var prel = app.dialog.preloader('Menyimpan setoran ke server...');

                $.ajax({
                  url: site+"/API/setoran/",
                  method: "POST",
                  data: JSON.stringify(temp),
                  success: function(result){
                    prel.close();

                    console.log(result[0].idx);
                    if(result[0].RESULT == "1"){
                      // app.toast.create({
                      //   text: "Setoran Berhasil",
                      //   closeTimeout: 3000,
                      //   closeButton: true
                      // }).open();
    
                      dialog.close();
                      app.dialog.alert("Berhasil tersimpan", "Sukses", function(){
                        // previewSetoran(result[0].idx);
                        printSetoran(result[0].idx);
                      });
    
    
                      // app.views.main.router.refreshPage();
                    } else if(result[0].RESULT == "2"){
                      // app.toast.create({
                      //   text: "Setoran Gagal",
                      //   closeTimeout: 3000,
                      //   closeButton: true
                      // }).open();
                      app.dialog.alert("Gagal tersimpan", "Error");

                      window.DatecsPrinter.disconnect();

                      dialog.close();
                      app.views.main.router.refreshPage();
                    } else {
                      // app.toast.create({
                      //   text: "Unknown Error",
                      //   closeTimeout: 3000,
                      //   closeButton: true
                      // }).open();
                      app.dialog.alert("Gagal tersimpan", "Error");

                      window.DatecsPrinter.disconnect();

                      dialog.close();
                      app.views.main.router.refreshPage();
                    }
                  }
                })
              } else {
                app.toast.create({
                  text: "Setoran Untuk Rekening Tersebut Telah Mencapai Batas Harian. Membatalkan Proses Setoran.",
                  closeTimeout: 3000,
                  closeButton: true
                }).open();

                window.DatecsPrinter.disconnect();
              }
            /* } else {
              app.toast.create({
                text: "File CSV / Setoran Belum Diupload Di Core, Silahkan Hubungi Admin / Back Office.",
                closeTimeout: 3000,
                closeButton: true
              }).open();
            } */
          }
        }]
      }).open();
      
    }, function(){
      alert("Gagal tersambung ke printer");
    })
  }, function(){
    alert("Printer tidak ditemukan");
  })
}

function printSetoran(idx){
  gagal_print = idx;
  
  var prel = app.dialog.preloader('Mencetak Struk...');
  // window.DatecsPrinter.listBluetoothDevices(function (devices) {
    // window.DatecsPrinter.connect(devices[0].address, function() {
      $.ajax({
        url: site+"/API/setoran/"+idx+"/",
        method: "GET",
        success: function(json){
          var result = json[0];
          var dt = new Date();
          var yr = dt.getFullYear();
          var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
          var dy = ('00'+dt.getDate()).slice(-2);
          var hr = ('00'+dt.getHours()).slice(-2);
          var mn = ('00'+dt.getMinutes()).slice(-2);
          var sc = ('00'+dt.getSeconds()).slice(-2);
          var cd = hari[dt.getDay()];
          // var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
          var datestamp = cd + ", " + dy + "/" + mt + "/" + yr;
          var timestamp = hr + ":" + mn + ":" + sc;

          var cetakan = 'Berhasil';
          var head_unik = "{left}-{br}";
          var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
          var separator = "--------------------------------{br}";
          var separator_unik = "-- -------------------------- --{br}";
          // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";
          var detil = "{left}NAMA : " + result.SSNAMA + "{br}OPR  : " + iduser + "{br}";

          // var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";
          var setor = "{left}SETOR TUNAI{br}HARI/TGL : " + datestamp + "{br}JAM      : " + timestamp + "{br}NO TRANS : " + result.NO_TRANSAKSI + "{br}REK      : " + result.ID_SIMPANAN + "{br}AMOUNT   : " + parseInt(result.NOMINAL).toLocaleString("id-ID") + "{br}SALDO    : " + parseInt(result.saldo_baru).toLocaleString("id-ID") + "{br}";
          var thanks = "{center}- Terima Kasih -{br}";
          var eol = "{br}{br}{br}";

          cetakan = head_unik + kop + separator + detil + separator + setor + separator_unik + thanks + eol;
          // console.log(cetakan);

          window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
            prel.close();
            app.dialog.alert("Berhasil Mencetak", "Sukses");
            // app.toast.create({
            //   text: "Setoran Berhasil",
            //   closeTimeout: 3000,
            //   closeButton: true
            // }).open();
            app.views.main.router.refreshPage();
          }, function() {
            prel.close();
            app.dialog.alert("Gagal mencetak", "Error");
            app.views.main.router.refreshPage();
          });
        }
      });
    // }, function() {
    //   alert("Tidak dapat tersambung ke printer");
    // });
  // }, function(){
  //   alert("Tidak ditemukan perangkat printer")
  // })

//   $.ajax({
//     url: site+"/API/setoran/"+idx+"/",
//     method: "GET",
//     success: function(json){
//       window.DatecsPrinter.listBluetoothDevices(function (devices) {
//         window.DatecsPrinter.connect(devices[0].address, function() {
//           var result = json[0];
//           var dt = new Date();
//           var yr = dt.getFullYear();
//           var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
//           var dy = ('00'+dt.getDate()).slice(-2);
//           var hr = ('00'+dt.getHours()).slice(-2);
//           var mn = ('00'+dt.getMinutes()).slice(-2);
//           var sc = ('00'+dt.getSeconds()).slice(-2);
//           var cd = hari[dt.getDay()];
//           // var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
//           var datestamp = cd + ", " + dy + "/" + mt + "/" + yr;
//           var timestamp = hr + ":" + mn + ":" + sc;

//           var cetakan = 'Berhasil';
//           var head_unik = "{left}-{br}";
//           var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
//           var separator = "--------------------------------{br}";
//           var separator_unik = "-- -------------------------- --{br}";
//           // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";
//           var detil = "{left}NAMA : " + result.SSNAMA + "{br}OPR  : " + iduser + "{br}";

//           // var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";
//           var setor = "{left}SETOR TUNAI{br}HARI/TGL : " + datestamp + "{br}JAM      : " + timestamp + "{br}NO TRANS : " + result.NO_TRANSAKSI + "{br}REK      : " + result.ID_SIMPANAN + "{br}AMOUNT   : " + result.NOMINAL.toLocaleString("id-ID") + "{br}SALDO    : " + result.saldo_baru.toLocaleString("id-ID") + "{br}";
//           var thanks = "{center}- Terima Kasih -{br}";
//           var eol = "{br}{br}{br}";

//           cetakan = head_unik + kop + separator + detil + separator + setor + separator_unik + thanks + eol;
//           // console.log(cetakan);
    
//           window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
//             app.toast.create({
//               text: "Setoran Berhasil",
//               closeTimeout: 3000,
//               closeButton: true
//             }).open();
//             app.views.main.router.refreshPage();
//           }, function() {
//             alert("Gagal mencetak");
//           });
    
//         },
//         function() {
//           alert("Tidak dapat tersambung ke printer");
          
//         });
//       },
//       function (error) {
//         alert("Tidak ditemukan perangkat printer")
//       });
//     }
//   });
}

function printUlangSetoran(){
  if(gagal_print){

    $.ajax({
      url: site+"/API/setoran/"+gagal_print+"/",
      method: "GET",
      success: function(json){
        var result = json[0];
        var dt = new Date();
        var yr = dt.getFullYear();
        var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
        var dy = ('00'+dt.getDate()).slice(-2);
        var hr = ('00'+dt.getHours()).slice(-2);
        var mn = ('00'+dt.getMinutes()).slice(-2);
        var sc = ('00'+dt.getSeconds()).slice(-2);
        var cd = hari[dt.getDay()];
        // var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
        var datestamp = cd + ", " + dy + "/" + mt + "/" + yr;
        var timestamp = hr + ":" + mn + ":" + sc;

        var cetakan = 'Berhasil';
        var head_unik = "{left}-{br}";
        var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
        var separator = "--------------------------------{br}";
        var separator_unik = "-- -------------------------- --{br}";
        // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";
        var detil = "{left}NAMA : " + result.SSNAMA + "{br}OPR  : " + iduser + "{br}";

        // var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";
        var setor = "{left}SETOR TUNAI{br}HARI/TGL : " + datestamp + "{br}JAM      : " + timestamp + "{br}NO TRANS : " + result.NO_TRANSAKSI + "{br}REK      : " + result.ID_SIMPANAN + "{br}AMOUNT   : " + parseInt(result.NOMINAL).toLocaleString("id-ID") + "{br}SALDO    : " + parseInt(result.saldo_baru).toLocaleString("id-ID") + "{br}";
        var thanks = "{center}- Terima Kasih -{br}";
        var eol = "{br}{br}{br}";

        cetakan = head_unik + kop + separator + detil + separator + setor + separator_unik + thanks + eol;
        // console.log(cetakan);
        // window.DatecsPrinter.listBluetoothDevices(function (devices) {
          // window.DatecsPrinter.connect(devices[0].address, function() {
            
      
            window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
              app.toast.create({
                text: "Cetak Ulang Receipt Setoran Berhasil",
                closeTimeout: 3000,
                closeButton: true
              }).open();
            }, function() {
              alert("Gagal Mencetak, Proses Dibatalkan");
            });
      
          // },
          // function() {
          //   alert("Tidak Dapat Tersambung Ke Printer, Proses Dibatalkan");
            
          // });
        // },
        // function (error) {
          
        // });
      }
    });
  } else {
    app.toast.create({
      text: "Belum Terjadi Proses Setoran, Tidak Ada Yang Bisa Diprint",
      closeTimeout: 3000,
      closeButton: true
    }).open();
  }
}


/* function previewSetoran(temp){
  to_be_printed = temp;
  var dt = new Date();
  var yr = dt.getFullYear();
  var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
  var dy = ('00'+dt.getDate()).slice(-2);
  var hr = ('00'+dt.getHours()).slice(-2);
  var mn = ('00'+dt.getMinutes()).slice(-2);
  var sc = ('00'+dt.getSeconds()).slice(-2);
  var cd = hari[dt.getDay()];
  // var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
  var datestamp = cd + ", " + dy + "/" + mt + "/" + yr;
  var timestamp = hr + ":" + mn + ":" + sc;

  var cetakan = 'Berhasil';
  var table_head = '<table style="width: 100%;"><tr><th style="width: 45%"></th><th style="width: 10%"></th><th style="width: 45%"></th></tr>';

  var kop = '<tr><td colspan="3" style="text-align: center;">PT BPR BANK SLEMAN (PERSERODA)</td></tr><tr><td colspan="3" style="text-align: center;">Magelang KM10 Tridadi Sleman</td></tr><tr><td colspan="3" style="text-align: center;">Telp (0274)868321</td></tr>';
  // var kop = "{br}{center} PD BPR BANK SLEMAN{br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";

  var separator = '<tr><td colspan="3" style="border-top: dashed black 2px"></td></tr>';
  // var separator = "--------------------------------{br}";

  var detil = '<tr><td>NAMA</td><td>:</td><td>'+temp.nama+'</td></tr><tr><td>OPR</td><td>:</td><td>'+iduser+'</td></tr>';
  // var detil = '<tr><td>CIF</td><td>:</td><td>'+temp.cif+'</td></tr><tr><td>NAMA</td><td>:</td><td>'+temp.nama+'</td></tr><tr><td>OPR</td><td>:</td><td>'+iduser+'</td></tr>';
  // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";

  var setor = '<tr><td colspan="3">SETOR TUNAI</td></tr><tr><td>HARI/TGL</td><td>:</td><td>'+datestamp+'</td></tr><tr><td>JAM</td><td>:</td><td>'+timestamp+'</td></tr><tr><td>NO TRANS</td><td>:</td><td>'+temp.trans+'</td></tr><tr><td>REK</td><td>:</td><td>'+temp.rek+'</td></tr><tr><td>AMOUNT</td><td>:</td><td>'+temp.nominal.toLocaleString("id-ID")+'</td></tr><tr><td>SALDO</td><td>:</td><td>'+temp.saldo.toLocaleString("id-ID")+'</td></tr>';
  // var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";

  var thanks = '<tr><td colspan="3" style="text-align: center;">- Terima Kasih -</td></tr>';
  // var thanks = "{center}- Terima Kasih -{br}";
  var eol = "{br}{br}{br}";
  var table_end = '</table><br><br>';

  // cetakan = kop + separator + detil + separator + setor + separator + thanks + eol;
  cetakan = table_head + kop + separator + detil + separator + setor + separator + thanks + table_end;
  to_be_previewed = cetakan;

  app.views.main.router.navigate('/preview/');
} */

/* function printSetoran(temp){
  gagal_print = temp;
  window.DatecsPrinter.listBluetoothDevices(function (devices) {
    window.DatecsPrinter.connect(devices[0].address, function() {
      var dt = new Date();
      var yr = dt.getFullYear();
      var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
      var dy = ('00'+dt.getDate()).slice(-2);
      var hr = ('00'+dt.getHours()).slice(-2);
      var mn = ('00'+dt.getMinutes()).slice(-2);
      var sc = ('00'+dt.getSeconds()).slice(-2);
      var cd = hari[dt.getDay()];
      // var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
      var datestamp = cd + ", " + dy + "/" + mt + "/" + yr;
      var timestamp = hr + ":" + mn + ":" + sc;

      gagal_print[datestamp] = datestamp;
      gagal_print[timestamp] = timestamp;

      var cetakan = 'Berhasil';
      var head_unik = "{left}-{br}";
      var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
      var separator = "--------------------------------{br}";
      var separator_unik = "-- -------------------------- --{br}";
      // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";
      var detil = "{left}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";

      // var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";
      var setor = "{left}SETOR TUNAI{br}HARI/TGL : " + datestamp + "{br}JAM      : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";
      var thanks = "{center}- Terima Kasih -{br}";
      var eol = "{br}{br}{br}";

      cetakan = head_unik + kop + separator + detil + separator + setor + separator_unik + thanks + eol;

      window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
        app.toast.create({
          text: "Setoran Berhasil",
          closeTimeout: 3000,
          closeButton: true
        }).open();
        app.views.main.router.refreshPage();
      }, function() {
        alert("Gagal Mencetak, Proses Dibatalkan");
      });

    },
    function() {
      alert("Tidak Dapat Tersambung Ke Printer, Proses Dibatalkan");
      
    });
  },
  function (error) {
    
  });
} */



function posting(){
  $('#proses_posting').addClass('disabled');
  var tot_posting = tot_simpanan + tot_pinjaman;
  var temp = {
    act : "posting",
    user : iduser,
    cabang : $('#cabang').val(),
    TOKEN : token
  }
  
  $.ajax({
    url: site+"/API/posting/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(result){
      if(result[0].RESULT == '1'){
        token = result[0].TOKEN_BARU;

        printPosting(result[0].TOKEN_LAMA);
        // previewPosting(result[0].TOKEN_LAMA);

        alert('sukses');
      } else if(result[0].RESULT == '2') {
        alert("gagal");
      } else {
        alert("tidak diketahui");
      }
    }
  })
}

function printPosting(token){

  $.ajax({
    url: site+"/API/print/"+token+"/",
    method: "GET",
    success: function(result){
      var dt = new Date();
      var yr = dt.getFullYear();
      var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
      var dy = ('00'+dt.getDate()).slice(-2);
      var hr = ('00'+dt.getHours()).slice(-2);
      var mn = ('00'+dt.getMinutes()).slice(-2);
      var sc = ('00'+dt.getSeconds()).slice(-2);
      var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;

      var cetakan = 'Berhasil';
      var head_unik = "{left}-{br}";
      var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
      var separator = "--------------------------------{br}";
      var separator_unik = "-- -------------------------- --{br}";
      // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";

      var post = "{left}REKAP POSTING HARIAN{br}NAMA      : " + result[0].ID_USER + "{br}NO        : " + result[0].NO_TRANSAKSI + "{br}TANGGAL   : " + result[0].TANGGAL.replace(/\-/g, '/') + "{br}TOT SIMP  : " + parseInt(result[0].SIMPANAN).toLocaleString("id-ID") + "{br}TOT PINJ  : " + parseInt(result[0].PINJAMAN).toLocaleString("id-ID") + "{br}TOT SETOR : " + parseInt(result[0].TOTAL).toLocaleString("id-ID") + "{br}";
      var jeni = "{left}  CIF      JENIS        NOMINAL{br}";
      var thanks = "{center}- Terima Kasih -{br}";
      var eol = "{br}{br}{br}";

      var jeni_detil = '';
      var c = '1000000000';
      for(var i = 0; i < result.length; i++){
        jeni_detil += result[i].NO_ANGGOTA + "   " + result[i].ID_SIMPANAN + "   " + lpad(parseInt(result[i].NOMINAL).toLocaleString("id-ID"), 10, ' ') + "{br}";
      }

      cetakan = head_unik + kop + separator + post + separator + jeni + jeni_detil + separator_unik + thanks + eol;
      // console.log(cetakan);

      window.DatecsPrinter.listBluetoothDevices(function (devices) {
        window.DatecsPrinter.connect(devices[0].address, function() {
          window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
            app.toast.create({
              text: "Posting Harian Berhasil",
              closeTimeout: 3000,
              closeButton: true
            }).open();
            app.views.main.router.navigate('/cif/');
          }, function() {
            alert("Gagal Mencetak, Proses Dibatalkan");
            // alert(JSON.stringify(error));
          });
            // printBayar(q);
        },
        function() {
          alert("Tidak Dapat Tersambung Ke Printer, Proses Dibatalkan");
          // alert(JSON.stringify(error));
        });
      },
      function (error) {
        // alert(JSON.stringify(error));
      });
    }
  })

  // window.DatecsPrinter.listBluetoothDevices(function (devices) {
  //   window.DatecsPrinter.connect(devices[0].address, function() {
  //     var dt = new Date();
  //     var yr = dt.getFullYear();
  //     var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
  //     var dy = ('00'+dt.getDate()).slice(-2);
  //     var hr = ('00'+dt.getHours()).slice(-2);
  //     var mn = ('00'+dt.getMinutes()).slice(-2);
  //     var sc = ('00'+dt.getSeconds()).slice(-2);
  //     var cd = hari[dt.getDay()];
  //     // var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
  //     var datestamp = cd + ", " + dy + "/" + mt + "/" + yr;
  //     var timestamp = hr + ":" + mn + ":" + sc;

  //     var cetakan = 'Berhasil';
  //     var head_unik = "{left}-{br}";
  //     var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
  //     var separator = "--------------------------------{br}";
  //     var separator_unik = "-- -------------------------- --{br}";
  //     // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";

  //     // var post = "{left}REKAP POSTING HARIAN{br}NAMA      : " + temp.user + "{br}NO        : " + temp.trans + "{br}TANGGAL   : " + timestamp + "{br}TOT SIMP  : " + temp.simpanan.toLocaleString("id-ID") + "{br}TOT PINJ  : " + temp.pinjaman.toLocaleString("id-ID") + "{br}TOT SETOR : " + temp.total.toLocaleString("id-ID") + "{br}";
  //     var post = "{left}REKAP POSTING HARIAN{br}NAMA      : " + temp.user + "{br}NO        : " + temp.trans + "{br}HARI/TGL  : " + datestamp + "{br}JAM       : " + timestamp + "{br}TOT SIMP  : " + temp.simpanan.toLocaleString("id-ID") + "{br}TOT PINJ  : " + temp.pinjaman.toLocaleString("id-ID") + "{br}TOT SETOR : " + temp.total.toLocaleString("id-ID") + "{br}";

  //     var jeni = "{left}  CIF      JENIS        NOMINAL{br}";
  //     var thanks = "{center}- Terima Kasih -{br}";
  //     var eol = "{br}{br}{br}";

  //     var jeni_detil = '';
  //     var c = '1000000000';
  //     for(var i = 0; i < po_simpanan.length; i++){
  //       jeni_detil += po_simpanan[i].cif + "   " + po_simpanan[i].rek + "   " + lpad(po_simpanan[i].nominal.toLocaleString("id-ID"), 10, ' ') + "{br}";
  //     }

  //     cetakan = head_unik + kop + separator + post + separator + jeni + jeni_detil + separator_unik + thanks + eol;
  //     window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
  //       app.toast.create({
  //         text: "Posting Harian Berhasil",
  //         closeTimeout: 3000,
  //         closeButton: true
  //       }).open();
  //       app.views.main.router.navigate('/cif/');
  //     }, function() {
  //       alert("Gagal Mencetak, Proses Dibatalkan");
  //     });

  //     /* for(var i = 0; i < idx.length; i++){
  //       var upd = {
  //         act : "update",
  //         idx : idx[i]
  //       };

  //       $.ajax({
  //         url: site+"/API/setoran/",
  //         method: "POST",
  //         data: JSON.stringify(upd),
  //         success: function(){
  //           console.log("Update IDX " + upd.idx + " sukses.");
  //         }
  //       })
  //     } */

  //     /* $.ajax({
  //       url: site+"/API/posting/",
  //       method: "POST",
  //       data: JSON.stringify(temp),
  //       success: function(result){
  //         for(var i = 0; i < idx.length; i++){
  //           var upd = {
  //             act : "dtlpost",
  //             idx : idx[i],
  //             id_posting : result.id
  //           }

  //           $.ajax({
  //             url: site+"/API/posting/",
  //             method: "POST",
  //             data: JSON.stringify(upd),
  //             success: function(){
  //               // console.log("Update IDX " + upd.idx + " sukses.");
  //             }
  //           })
  //         }

  //         window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
  //           app.toast.create({
  //             text: "Posting Harian Berhasil",
  //             closeTimeout: 3000,
  //             closeButton: true
  //           }).open();
    
  //           // idx = [];
  //           // po_simpanan = [];
  //           app.views.main.router.navigate('/cif/');
  //         }, function() {
  //           alert("Gagal Mencetak, Proses Dibatalkan");
  //           // alert(JSON.stringify(error));
  //         });
          
  //       }
  //     }) */
  //     // printBayar(q);
  //   },
  //   function() {
  //     alert("Tidak Dapat Tersambung Ke Printer, Proses Dibatalkan");
  //   });
  // },
  // function (error) {
  // });
}

function laporanReport(){
  var tgl_awal = '';
  var tgl_akhir = '';

  switch(jenis_laporan){
    case "closing":
      tgl_awal = $("#tgl_awal_c").val();
      tgl_akhir = $("#tgl_akhir_c").val();
      break;
    case "saving":
      tgl_awal = $("#tgl_awal_s").val();
      tgl_akhir = $("#tgl_akhir_s").val();
      break;
    case "rekap":
      tgl_awal = $("#tgl_awal_r").val();
      tgl_akhir = $("#tgl_akhir_r").val();
      break;
  }

  var c = 1;
  var temp = {
    tipe : jenis_laporan,
    tgl_awal : tgl_awal,
    tgl_akhir : tgl_akhir,
    id_user : idrole == 2 ? iduser : 'admin'
  }

  $.ajax({
    url: site+"/API/laporan/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(result){
      switch(jenis_laporan){
        case "closing":
          var total_s = 0, total_p = 0, total_t = 0;
          /*var datanya = '<div class="data-table">\
                          <table>\
                            <thead>\
                              <tr>\
                                <th class="label-cell" style="width: 5%;">No</th>\
                                <th style="width: 10%;">User</th>\
                                <th style="width: 15%;">Tanggal</th>\
                                <th class="numeric-cell" style="width: 20%;">Simpanan</th>\
                                <th class="numeric-cell" style="width: 20%;">Pinjaman</th>\
                                <th class="numeric-cell" style="width: 30%;">Total</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';*/
            var datanya = '<table>\
                            <thead>\
                              <tr>\
                                <th style="width: 5%;">No</th>\
                                <th style="width: 10%;">User</th>\
                                <th style="width: 25%;">Tanggal</th>\
                                <th style="width: 15%;">Simpanan</th>\
                                <th style="width: 15%;">Pinjaman</th>\
                                <th style="width: 20%;">Total</th>\
                                <th style="width: 10%;"></th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';
          for(var i = 0; i < result.length; i++){
            datanya += '<tr>\
                          <td style="text-align: center; padding: 10px 0;">'+ c +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].ID_USER +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].TANGGAL.split(' ')[0] +'</td>\
                          <td style="text-align: right; padding: 10px 0;">'+ parseInt(result[i].SIMPANAN).toLocaleString('id-ID') +'</td>\
                          <td style="text-align: right; padding: 10px 0;">'+ parseInt(result[i].PINJAMAN).toLocaleString('id-ID') +'</td>\
                          <td style="text-align: right; padding: 10px 0;">'+ parseInt(result[i].TOTAL).toLocaleString('id-ID') +'</td>\
                          <td ><a onclick="printUlang('+ result[i].TOKEN +')">Print</a></td>\
            ';

            total_s += parseInt(result[i].SIMPANAN);
            total_p += parseInt(result[i].PINJAMAN);
            total_t += parseInt(result[i].TOTAL);

            c++;
          }

          /*datanya += '</tbody>\
                          </table>\
                        </div>\
                      ';*/

          datanya += '<tr><td colspan="3" style="text-align: right; padding-right: 10px; background: #bbb;">Total</td><td style="text-align: right; background: #bbb;">'+total_s.toLocaleString('id-ID')+'</td><td style="text-align: right; background: #bbb;">'+total_p.toLocaleString('id-ID')+'</td><td style="text-align: right; background: #bbb;">'+total_t.toLocaleString('id-ID')+'</td></tr>';  
          datanya += '</tbody>\
              </table>\
          ';

          $('#result_c').html(datanya);
          break;

        case "saving":
          var total_n = 0;
          /*var datanya = '<div class="data-table">\
                          <table>\
                            <thead>\
                              <tr>\
                                <th class="label-cell" style="width: 5%;">No</th>\
                                <th style="width: 10%;">User</th>\
                                <th style="width: 15%;">Tanggal</th>\
                                <th class="numeric-cell" style="width: 20%;">Simpanan</th>\
                                <th class="numeric-cell" style="width: 20%;">Pinjaman</th>\
                                <th class="numeric-cell" style="width: 30%;">Total</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';*/
            var datanya = '<table style="table-layout: fixed">\
                            <thead>\
                              <tr>\
                                <th style="width: 5%;">No</th>\
                                <th style="width: 30%;">Nama Nasabah</th>\
                                <th style="width: 25%;">Nominal</th>\
                                <th style="width: 10%;">CIF</th>\
                                <th style="width: 10%;">Rekening</th>\
                                <th style="width: 25%;">Tanggal</th>\
                                <th style="width: 5%;">User</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';
          for(var i = 0; i < result.length; i++){
            datanya += '<tr>\
                          <td style="text-align: center; padding: 10px 0;">'+ c +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].NAMA +'</td>\
                          <td style="text-align: right; padding: 10px 10px 10px 0;">'+ parseInt(result[i].NOMINAL).toLocaleString('id-ID') +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].CIF +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].ID_SIMPANAN +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].TANGGAL.split(' ')[0] +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].USER +'</td>\
            ';

            total_n += parseInt(result[i].NOMINAL);
            c++;
          }

          /*datanya += '</tbody>\
                          </table>\
                        </div>\
                      ';*/

          datanya += '<tr><td colspan="2" style="text-align: right; padding-right: 10px; background: #bbb;">Total</td><td style="text-align: right; background: #bbb; padding: 10px 10px 10px 0;">'+total_n.toLocaleString('id-ID')+'</td></tr>';  
          datanya += '</tbody>\
              </table>\
          ';

          $('#result_s').html(datanya);
          break;

        case "rekap":
          var total_n = 0;
          /*var datanya = '<div class="data-table">\
                          <table>\
                            <thead>\
                              <tr>\
                                <th class="label-cell" style="width: 5%;">No</th>\
                                <th style="width: 10%;">User</th>\
                                <th style="width: 15%;">Tanggal</th>\
                                <th class="numeric-cell" style="width: 20%;">Simpanan</th>\
                                <th class="numeric-cell" style="width: 20%;">Pinjaman</th>\
                                <th class="numeric-cell" style="width: 30%;">Total</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';*/
            var datanya = '<table>\
                            <thead>\
                              <tr>\
                                <th style="width: 5%;">No</th>\
                                <th style="width: 25%;">CIF</th>\
                                <th style="width: 25%;">Tanggal</th>\
                                <th style="width: 20%;">User</th>\
                                <th style="width: 25%;">Nominal</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';
          for(var i = 0; i < result.length; i++){
            datanya += '<tr>\
                          <td style="text-align: center; padding: 10px 0;">'+ c +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].NO_ANGGOTA +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].TANGGAL.split(' ')[0] +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].ID_USER +'</td>\
                          <td style="text-align: right; padding: 10px 0;">'+ parseInt(result[i].NOMINAL).toLocaleString('id-ID') +'</td>\
            ';

            total_n += parseInt(result[i].NOMINAL);
            c++;
          }

          /*datanya += '</tbody>\
                          </table>\
                        </div>\
                      ';*/

          datanya += '<tr><td colspan="4" style="text-align: right; padding-right: 10px; background: #bbb;">Total</td><td style="text-align: right; background: #bbb;">'+total_n.toLocaleString('id-ID')+'</td></tr>';  
          datanya += '</tbody>\
              </table>\
          ';

          $('#result_r').html(datanya);
          break;
      }


      console.log(result);
    }
  })
}

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

function testPrinter(q){
  window.DatecsPrinter.listBluetoothDevices(function (devices) {
    window.DatecsPrinter.connect(devices[0].address, function(){
      window.DatecsPrinter.printText(q, 'ISO-8859-1', function(){
        console.log("berhasil");
      }, function(){
        console.log("failed");
      })
    })
  })
}

function bypassSetoran(temp){
  $.ajax({
    url: site+"/API/setoran/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(){
      app.toast.create({
        text: "Setoran Berhasil",
        closeTimeout: 3000,
        closeButton: true
      }).open();
      // cekCIF("coll_s", temp.cif);
      app.views.main.router.refreshPage();
    }
  })
}

function bypassPosting(temp){
  for(var i = 0; i < idx.length; i++){
    var upd = {
      act : "update",
      idx : idx[i]
    };

    $.ajax({
      url: site+"/API/setoran/",
      method: "POST",
      data: JSON.stringify(upd),
      success: function(){
        console.log("Update IDX " + upd.idx + " sukses.");
      }
    })
  }

  $.ajax({
    url: site+"/API/posting/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(result){
      for(var i = 0; i < idx.length; i++){
        var upd = {
          act : "dtlpost",
          idx : idx[i],
          id_posting : result.id
        }

        $.ajax({
          url: site+"/API/posting/",
          method: "POST",
          data: JSON.stringify(upd),
          success: function(){
            // console.log("Update IDX " + upd.idx + " sukses.");
          }
        })
      }

      app.toast.create({
        text: "Posting Harian Berhasil",
        closeTimeout: 3000,
        closeButton: true
      }).open();

      $('#proses_posting').removeClass('disabled');

      // idx = [];
      // po_simpanan = [];
      app.views.main.router.navigate('/cif/');
    }
  })
}

function lpad(str, len, padstr){
  var pad = '';
  for(var i = 0; i < len; i++){
    pad += padstr;
  }

  // console.log(pad+str);
  // console.log((pad + str).slice(len*-1));
  return (pad + str).slice(len*-1);
}

function pindahLaporan(jenis){
  jenis_laporan = jenis;
}

function printChooser(){
  if(to_be_printed.jenis_print == 'setoran'){
    printSetoran(to_be_printed);
    // bypassSetoran(to_be_printed);
  } else if(to_be_printed.jenis_print == 'posting'){
    printPosting(to_be_printed);
    // bypassPosting(to_be_printed);
  }
}

function dialogShare(){
  var options = {
    documentSize: 'A4',
    type: 'base64'
  }

  pdf.fromData(to_be_previewed, options)
    .then(function(base64){
      window.plugins.socialsharing.share(null, null, 'data:application/pdf;base64,'+base64, null);
      // console.log(base64);
    })
    .catch(function(err){
      console.log(err);
    })
}

function cekSession(){
  try{
    var url_with_name = encodeURI(site+"/API/log/"+iduser.replace(/\s/g, '+')+"/");
    $.ajax({
      // url: site+"/API/log/"+iduser+"/",
      url: url_with_name,
      method: "GET",
      success: function(result){
        // console.log(result[0].token);
        if(result[0].token == session_token){
          console.log("token matched");
          // session_checker = setTimeout(cekSession, 3 * 1000);
          session_checker = setTimeout(cekSession, session_timeout * 1000);
        } else {
          console.log("token mismatched");
          onLogout(2);
        }
      }, error: function(){
        onLogout(3);
        // throw "cannot connect to server";
        // console.log("cannot connect to server");
      }
    })
  } catch(e){
    console.error(e);
  }
}

function ubahPass(){
  var pass1 = $('#pass_baru').val();
  var pass2 = $('#ulangpass_baru').val();
  if(pass1 == pass2){
    var temp = {
      pass_baru : pass1,
      id_user : iduser
    }

    $.ajax({
      url: site+"/API/pass/",
      method: "POST",
      data: JSON.stringify(temp),
      success: function(result){
        console.log(result.status);
        if(result.status == "sukses") onLogout(4);
      }
    })
  } else {
    app.toast.create({
      text: "Password Baru Tidak Sama!",
      closeTimeout: 3000,
      closeButton: true
    }).open();
  }
}

function printUlang(token){
  $.ajax({
    url: site+"/API/print/"+token+"/",
    method: "GET",
    success: function(result){
      var dt = new Date();
      var yr = dt.getFullYear();
      var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
      var dy = ('00'+dt.getDate()).slice(-2);
      var hr = ('00'+dt.getHours()).slice(-2);
      var mn = ('00'+dt.getMinutes()).slice(-2);
      var sc = ('00'+dt.getSeconds()).slice(-2);
      var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;

      var cetakan = 'Berhasil';
      var head_unik = "{left}-{br}";
      var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
      var separator = "--------------------------------{br}";
      var separator_unik = "-- -------------------------- --{br}";
      // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";

      var post = "{left}REKAP POSTING HARIAN{br}NAMA      : " + result[0].ID_USER + "{br}NO        : " + result[0].NO_TRANSAKSI + "{br}TANGGAL   : " + result[0].TANGGAL.replace(/\-/g, '/') + "{br}TOT SIMP  : " + parseInt(result[0].SIMPANAN).toLocaleString("id-ID") + "{br}TOT PINJ  : " + parseInt(result[0].PINJAMAN).toLocaleString("id-ID") + "{br}TOT SETOR : " + parseInt(result[0].TOTAL).toLocaleString("id-ID") + "{br}";
      var jeni = "{left}  CIF      JENIS        NOMINAL{br}";
      var thanks = "{center}- Terima Kasih -{br}";
      var eol = "{br}{br}{br}";

      var jeni_detil = '';
      var c = '1000000000';
      for(var i = 0; i < result.length; i++){
        jeni_detil += result[i].NO_ANGGOTA + "   " + result[i].ID_SIMPANAN + "   " + lpad(parseInt(result[i].NOMINAL).toLocaleString("id-ID"), 10, ' ') + "{br}";
      }

      cetakan = head_unik + kop + separator + post + separator + jeni + jeni_detil + separator_unik + thanks + eol;
      // console.log(cetakan);

      window.DatecsPrinter.listBluetoothDevices(function (devices) {
        window.DatecsPrinter.connect(devices[0].address, function() {
          window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
            app.toast.create({
              text: "Print Ulang Berhasil",
              closeTimeout: 3000,
              closeButton: true
            }).open();
          }, function() {
            alert("Gagal Mencetak, Proses Dibatalkan");
            // alert(JSON.stringify(error));
          });
            // printBayar(q);
        },
        function() {
          alert("Tidak Dapat Tersambung Ke Printer, Proses Dibatalkan");
          // alert(JSON.stringify(error));
        });
      },
      function (error) {
        // alert(JSON.stringify(error));
      });
    }
  })
}





// FOR DEBUGGING
function previewSetoran(idx){
  $.ajax({
    url: site+"/API/setoran/"+idx+"/",
    method: "GET",
    success: function(json){
      var result = json[0];
      var dt = new Date();
      var yr = dt.getFullYear();
      var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
      var dy = ('00'+dt.getDate()).slice(-2);
      var hr = ('00'+dt.getHours()).slice(-2);
      var mn = ('00'+dt.getMinutes()).slice(-2);
      var sc = ('00'+dt.getSeconds()).slice(-2);
      var cd = hari[dt.getDay()];
      // var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
      var datestamp = cd + ", " + dy + "/" + mt + "/" + yr;
      var timestamp = hr + ":" + mn + ":" + sc;

      var cetakan = 'Berhasil';
      var head_unik = "{left}-{br}";
      var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
      var separator = "--------------------------------{br}";
      var separator_unik = "-- -------------------------- --{br}";
      // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";
      var detil = "{left}NAMA : " + result.SSNAMA + "{br}OPR  : " + iduser + "{br}";

      // var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";
      var setor = "{left}SETOR TUNAI{br}HARI/TGL : " + datestamp + "{br}JAM      : " + timestamp + "{br}NO TRANS : " + result.NO_TRANSAKSI + "{br}REK      : " + result.ID_SIMPANAN + "{br}AMOUNT   : " + parseInt(result.NOMINAL).toLocaleString("id-ID") + "{br}SALDO    : " + parseInt(result.saldo_baru).toLocaleString("id-ID") + "{br}";
      var thanks = "{center}- Terima Kasih -{br}";
      var eol = "{br}{br}{br}";

      cetakan = head_unik + kop + separator + detil + separator + setor + separator_unik + thanks + eol;
      console.log(cetakan);
    }
  });
}

function previewPosting(token){
  $.ajax({
    url: site+"/API/print/"+token+"/",
    method: "GET",
    success: function(result){
      var dt = new Date();
      var yr = dt.getFullYear();
      var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
      var dy = ('00'+dt.getDate()).slice(-2);
      var hr = ('00'+dt.getHours()).slice(-2);
      var mn = ('00'+dt.getMinutes()).slice(-2);
      var sc = ('00'+dt.getSeconds()).slice(-2);
      var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;

      var cetakan = 'Berhasil';
      var head_unik = "{left}-{br}";
      var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
      var separator = "--------------------------------{br}";
      var separator_unik = "-- -------------------------- --{br}";
      // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";

      var post = "{left}REKAP POSTING HARIAN{br}NAMA      : " + result[0].ID_USER + "{br}NO        : " + result[0].NO_TRANSAKSI + "{br}TANGGAL   : " + result[0].TANGGAL.replace(/\-/g, '/') + "{br}TOT SIMP  : " + parseInt(result[0].SIMPANAN).toLocaleString("id-ID") + "{br}TOT PINJ  : " + parseInt(result[0].PINJAMAN).toLocaleString("id-ID") + "{br}TOT SETOR : " + parseInt(result[0].TOTAL).toLocaleString("id-ID") + "{br}";
      var jeni = "{left}  CIF      JENIS        NOMINAL{br}";
      var thanks = "{center}- Terima Kasih -{br}";
      var eol = "{br}{br}{br}";

      var jeni_detil = '';
      var c = '1000000000';
      for(var i = 0; i < result.length; i++){
        jeni_detil += result[i].NO_ANGGOTA + "   " + result[i].ID_SIMPANAN + "   " + lpad(parseInt(result[i].NOMINAL).toLocaleString("id-ID"), 10, ' ') + "{br}";
      }

      cetakan = head_unik + kop + separator + post + separator + jeni + jeni_detil + separator_unik + thanks + eol;
      console.log(cetakan);
    }
  })
}