let long = undefined, lat = undefined, acc = undefined;
let watchID = undefined;

// function ingfoGeolocation() {
//     navigator.geolocation.watchPosition(function (position) {
//         long = position.coords.longitude;
//         lat = position.coords.latitude;
//         acc = position.coords.accuracy;
//     }, function () {
//         alert("Gagal mengambil koordinat posisi! Mohon cek status GPS anda.");
//         navigator.app.exitApp();
//         // console.log("gagal mengambil koordinat posisi");
//     }, {
//         enableHighAccuracy: true,
//         maximumAge: 5 * 60 * 1000,
//         timeout: 5 * 1000
//     });
// }

function doWatchGeolocation() {
    watchID = navigator.geolocation.watchPosition(watchGeoSuccess, watchGeoFailed, {
        enableHighAccuracy: true,
        maximumAge: 5 * 60 * 1000,
        timeout: 5 * 1000
    });
}

function watchGeoSuccess(position) {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    acc = position.coords.accuracy;

    if(data_user == undefined) newLogin();
    console.log(position);
}

function watchGeoFailed(error) {
    navigator.geolocation.clearWatch(watchID);
    alert("Gagal mengambil koordinat posisi dengan error: " +error.message);
    // navigator.app.exitApp();

    console.log(error);
}