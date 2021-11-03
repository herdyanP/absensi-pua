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
        // getShiftData();
        absenInit();
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
        var longdate = generateLongTgl(dt);
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

        $('#isinya').html(isinya);
      }
    }
  },
];