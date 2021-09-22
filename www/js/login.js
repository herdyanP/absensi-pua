function newLogin(){
    let form_data = app.form.convertToData('#login_cred');
    
    $.ajax({
        url: site+'/API/login/',
        data: form_data,
        method: 'POST',
        success: function(result){
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