// Init
function absenInit() {
    let dt = new Date();
    let curdt = dt.getFullYear() + '-' + ('00' + (dt.getMonth() + 1)).slice(-2) + '-' + ('00' + dt.getDate()).slice(-2);
    let tglAbsen = generateLongTgl(new Date(data_user.tgl))

    $('#tgl').attr('min', curdt);
    $('#tglsd').attr('min', curdt);

    switch (data_user.jenis_absen) {
        case '1':
            $('#div_checkin').css('display', 'none');
            $('#div_checkout').css('display', '');
            $('#div_unavailable3').css('display', 'none');
            $('#div_ijin').css('display', 'none');

            $('#blockFormShift').hide();
            // $('#welcomeGreeting').html(`Selamat datang, <b>${data_user.nama_pegawai}</b> <br>Anda telah Check-In untuk <br><b>${tglAbsen}</b> shift <b>${data_user.start} - ${data_user.end}</b>`)
            $('#welcomeGreeting').html(`Selamat datang, <b>${data_user.nama_pegawai}</b>`)
            break;

        /* default: //default apabila ada shift
            $('#div_checkin').css('display', 'none');
            $('#div_checkout').css('display', 'none');
            $('#div_unavailable3').css('display', '');
            $('#div_ijin').css('display', '');

            $('#blockFormShift').show();
            // $('#welcomeGreeting').html(`Selamat datang, <b>${data_user.nama_pegawai}</b> <br>Silahkan pilih shift Anda terlebih dahulu sebelum Check-In`)
            $('#welcomeGreeting').html(`Selamat datang, <b>${data_user.nama_pegawai}</b>`) */

        default: //default apabila tidak pake shift
            $('#div_checkin').css('display', '');
            $('#div_checkout').css('display', 'none');
            $('#div_unavailable3').css('display', 'none');
            $('#div_ijin').css('display', '');

            $('#blockFormShift').hide();
            $('#welcomeGreeting').html(`Selamat datang, <b>${data_user.nama_pegawai}</b>`)

        // case '2':
        //     $('#div_checkin').css('display', 'none');
        //     $('#div_checkout').css('display', 'none');
        //     $('#div_unavailable1').css('display', '');
        //     $('#div_ijin').css('display', 'none');
        //     break;

        // case '3':
        // case '4':
        // case '5':
        //     $('#div_checkin').css('display', 'none');
        //     $('#div_checkout').css('display', 'none');
        //     $('#div_unavailable2').css('display', '');
        //     $('#div_ijin').css('display', 'none');
        //     break;
    }

    // console.log(data_user.shift_id);
}

function getShiftData() {
    $.ajax({
        url: site + '/API/shift.php',
        method: 'GET',
        success: function (result) {
            if (result.ST_CODE == '1') {
                const datanya = result.DATA;
                let isinya = `<option selected disabled>-- Pilih Shift --</option>`;
                for (let i = 0; i < datanya.length; i++) {
                    const element = datanya[i];
                    isinya += `<option value=${element.shift_id}>${element.start} - ${element.end}</option>`;
                }

                $("#shift_id").html(isinya);
            } else {
                console.log('Gagal ambil shift');
            }
        }
    })
}

// Processes
function checkLogged(shiftId) {
    if (shiftId) {
        $("#div_unavailable3").hide();
        $("#div_checkin").show();

        const obj = {
            shift_id: shiftId,
            id_pegawai: data_user.id_pegawai
        }

        $.ajax({
            url: `${site}/API/shift.php`,
            method: "POST",
            data: obj,
        }).done((result) => {
            console.log(result);
        })
    }
}

function checkIn(result) {
    var temp = {
        'pict': result,
        'latitude': lat,
        'longitude': long,
        'id_pegawai': data_user.id_pegawai,
        'shift': $('#shift_id').val(),
    }

    $.ajax({
        url: site + '/API/checkin/',
        // data: JSON.stringify(temp),
        data: temp,
        method: 'POST',
        success: function (result) {
            if (result.ST_CODE == '1') {
                app.dialog.alert("Sukses", "Perhatian", function () {
                    var data = result.DATA;
                    data_user['alamat'] = data.alamat;
                    data_user['tglserver'] = data.tgl;
                    data_user['jamserver'] = data.jam;

                    app.views.main.router.navigate('/konf/');
                })
                // alert('Sukses!');
                $('#div_checkin').css('display', 'none');
                $('#div_checkout').css('display', '');
                $('#div_ijin').css('display', 'none');
            } else {
                app.dialog.alert("Gagal", "Perhatian");
            }
        }
    })
    // alert('User: '+data_user.nama_pegawai);
}

function checkOut() {
    var temp = {
        'latitude': lat,
        'longitude': long,
        'id_pegawai': data_user.id_pegawai,
        'shift': data_user.shift_id,
    }

    $.ajax({
        url: site + '/API/checkout/',
        // data: JSON.stringify(temp),
        data: temp,
        method: 'POST',
        success: function (result) {
            if (result.ST_CODE == '1') {
                alert('Sukses!');
                onLogout();
            } else {
                alert('Gagal');
            }
        }
    })
}

function ijin() {
    if ($('#ket_ijin').css('display') == 'none') {
        $('#ket_ijin').css('display', '');
    } else {
        $('#ket_ijin').css('display', 'none');
    }
}

function simpanIjin() {
    app.preloader.show();

    var form_data = app.form.convertToData('#form_ijin');
    form_data.id_pegawai = data_user.id_pegawai;
    form_data.latitude = lat;
    form_data.longitude = long;

    $.ajax({
        url: site + '/API/ijin/',
        data: form_data,
        method: 'POST',
    }).done(function (result) {
        if (result.ST_CODE == '1') {
            alert('Sukses!');
            onLogout();
        } else {
            alert('Gagal!');
        }
    }).always(function () {
        app.preloader.hide();
    })
}