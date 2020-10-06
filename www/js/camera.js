// ========== CAMERA PLUGIN ==========
function ambilFoto(){
    app.preloader.show();
    window.plugins.mocklocationchecker.check(function(mockresult){
        app.preloader.hide();
        // alert('status mock: '+mockresult);
        if(mockresult[0].info == 'mock-false'){
            navigator.camera.getPicture(function(result){
                checkIn(result);
            }, function(error){
                alert('Ambil foto gagal dengan error: ' + error);
            }, {
                // Some common settings are 20, 50, and 100
                quality: 50,
                // destinationType: Camera.DestinationType.FILE_URI,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: 1,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                allowEdit: false,
                cameraDirection: Camera.Direction.FRONT,
                // targetHeight: 100,
                // targetWidth: 100,
                correctOrientation: true  //Corrects Android orientation quirks
            })
        } else {
            alert('Fake GPS terdeteksi! Silahkan matikan terlebih dahulu');
        }
    }, function(error){
        alert('error anti-mock: '+error)
    });
}

// ========== CAMERA PLUGIN END ==========