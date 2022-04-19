let data_user = undefined;

function newLogin() {
    app.preloader.show();
    if (long != undefined && lat != undefined) {
        let form_data = app.form.convertToData('#login_cred');

        $.ajax({
            // url: site + '/API/login/',
            url: site + '/API/index.php?do=login',
            data: form_data,
            method: 'POST',
            success: function (result) {
                console.log("AJAX Success")
                if (result.ST_CODE == '1') {
                    data_user = result.DATA;
                    app.views.main.router.navigate('/home/');
                } else {
                    app.toast.create({
                        text: "Cek lagi username / password anda",
                        closeTimeout: 3000,
                        closeButton: true
                    }).open();
                }
            },
            error: function(){
                console.log("AJAX Error");
                alert("Unknown Error");
                navigator.geolocation.clearWatch(watchID);
            },
            complete: function(){
                console.log("AJAX Complete");
                app.preloader.hide();
            }
        })
    } else {
        doWatchGeolocation();
        app.preloader.hide();
    }
}

function onLogout(t) {
    data_user = '';
    app.views.main.router.navigate('/');
}