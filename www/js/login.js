function newLogin(){
    var form_data = app.form.convertToData('#login_cred');
    
    $.ajax({
        url: site+'/API/login/',
        data: JSON.stringify(form_data),
        method: 'POST',
        success: function(result){
            // var parsed = JSON.parse(result);
            if(result.ST_CODE == '1'){
                data_user = result.DATA;
                app.views.main.router.navigate('/home/');
            } else {
                app.toast.create({
                    text: "Cek lagi username / password anda",
                    closeTimeout: 3000,
                    closeButton: true
                }).open();
            }
        }
    })
}

function onLogout(t){
    data_user = '';
    app.views.main.router.navigate('/');
}

function checkIn(result){
    var temp = {
        'pict' : result,
        'latitude' : lat,
        'longitude' : long,
        'id_pegawai' : data_user.id_pegawai,
    }

    $.ajax({
        url: site+'/API/checkin/',
        data: JSON.stringify(temp),
        method: 'POST',
        success: function(result){
            if(result.ST_CODE == '1'){
                app.dialog.alert("Sukses", "Perhatian", function(){
                    var data = result.DATA;
                    data_user['alamat'] = data.alamat;
                    data_user['tglserver'] = data.tgl;
                    data_user['jamserver'] = data.jam;

                    app.views.main.router.navigate('/konf/');
                })
                // alert('Sukses!');
                $('#div_checkin').css('display', 'none');
                $('#div_checkout').css('display', '');
            } else {
                app.dialog.alert("Gagal", "Perhatian");
            }
        }
    })
    // alert('User: '+data_user.nama_pegawai);
}

function checkOut(){
    var temp = {
        'latitude' : lat,
        'longitude' : long,
        'id_pegawai' : data_user.id_pegawai,
    }

    $.ajax({
        url: site+'/API/checkout/',
        data: JSON.stringify(temp),
        method: 'POST',
        success: function(result){
            if(result.ST_CODE == '1'){
                alert('Sukses!');
                onLogout();
            } else {
                alert('Gagal');
            }
        }
    })
}