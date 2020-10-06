var routes = 
[
  {
    path: '/',
    url: './index.html',
    name: 'login',
    history: false,
    on: {
      pageAfterIn: function(){
        $('#appversion').html(appVer);
      }
    }
  },
  {
    path: '/home/',
    componentUrl: './pages/home.html',
    name: 'home',
    history: false,
    on: {
      pageAfterIn: function(){
        if(data_user.absen != '0'){
          $('#div_checkin').css('display', 'none');
          $('#div_checkout').css('display', '');
        }
      }
    }
  },
  {
    path: '/konf/',
    componentUrl: './pages/konf.html',
    name: 'konf',
    history: false,
    on: {
      pageAfterIn: function(){
        var dt = new Date(data_user.tglserver);
        var longdate = hari[dt.getDay()] + ', ' + ('00' + dt.getDate()).slice(-2) + ' ' + bulan[dt.getMonth()] + ' ' + dt.getFullYear();
        var isinya = 
        '<table class="table">\
          <thead>\
            <tr>\
              <th colspan="2" style="background: #f0f0f0">\
                  Informasi Check-In Absensi\
              </th>\
            </tr>\
          </thead>\
          <tbody>\
            <tr>\
              <td style="width: 20%;">Nama</td>\
              <td>'+data_user.nama_pegawai+'</td>\
            </tr>\
            <tr>\
              <td>Lokasi</td>\
              <td>'+data_user.alamat+'</td>\
            </tr>\
            <tr>\
              <td>Tanggal</td>\
              <td>'+longdate+'</td>\
            </tr>\
            <tr>\
              <td>Jam</td>\
              <td>'+data_user.jamserver+'</td>\
            </tr>\
          </tbody>\
        </table>';

        // '<div class="row">\
        //   <div class="col-20">Nama</div>\
        //   <div class="col-80">: '+data_user.nama_pegawai+'</div>\
        // </div>\
        // <div class="row">\
        //   <div class="col-20">Lokasi</div>\
        //   <div class="col-80">: '+data_user.alamat+'</div>\
        // </div>\
        // <div class="row">\
        //   <div class="col-20">Tanggal</div>\
        //   <div class="col-80">: '+longdate+'</div>\
        // </div>\
        // <div class="row">\
        //   <div class="col-20">Jam</div>\
        //   <div class="col-80">: '+data_user.jamserver+'</div>\
        // </div>';

        $('#isinya').html(isinya);
      }
    }
  },
];