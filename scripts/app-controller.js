window.module.controller('appController', ['$scope', '$q', 'appService', function($scope, $q, appService) {

    $scope.data = { errors: { } };
    function setCoords(coordsData) {
        $scope.data.coords = coordsData;
    }
    function setPhotoData(photoData) {
        return $scope.data.photoData = photoData;
    }
    function setPhotoUrl(photoUrl) {
        return $scope.data.photoUrl = photoUrl;
    }
    function clearPhotoError() {
        delete $scope.data.errors.photo;
    }
    function setPhotoError(error) {
        $scope.data.errors.photo = 'An error has occurred: ' + error;
        return $q.reject($scope.data.errors.photo);
    }
    function clearUsernameError() {
        delete $scope.data.errors.username;
    }
    function setUsernameError(error) {
        $scope.data.errors.username = error;
        return $q.reject($scope.data.errors.username);
    }
    function setUsernameReservation(reservation) {
        $scope.data.reservation = reservation;
    }

    function setSubmitError(error) {
        $scope.data.errors.submit = error;
    }
    function clearSubmitError() {
        delete $scope.data.errors.submit;
    }

    function doRegistration(longitude, latitude, reservationId, photoUrl) {
        $scope.data.success = true;
        $scope.storedJSON = JSON.stringify({
            longitude: longitude,
            latitude: latitude,
            reservationId: reservationId,
            photoUrl: photoUrl
        });
    }



    appService.getGeolocationCoordinates()
        .then(setCoords);

    var photoPromise = $q.reject('No user photo selected');
    $scope.fileSelected = function(files) {
        if (files && files.length > 0) {
            var filePath = files[0];

            clearPhotoError();
            photoPromise = appService.readFile(filePath)
                .then(setPhotoData)
                .then(appService.uploadFile)
                .then(setPhotoUrl)
                .catch(setPhotoError);
        }
    };

    var reservationPromise = $q.reject('No username reservation had made');
    $scope.reserveUsername = function() {
        var newUsername = $scope.data.username;
        clearUsernameError();
        reservationPromise = appService.reserveUsername(newUsername)
            .then(setUsernameReservation)
            .catch(setUsernameError);
    }

    $scope.register = function() {
        $q.all([
            reservationPromise,
            photoPromise
        ]).then(function() {
            var longitude = $scope.data.coords && $scope.data.coords.longitude;
            var latitude = $scope.data.coords && $scope.data.coords.latitude;
            var reservationId = $scope.data.reservation.token;
            var photoUrl = $scope.data.photoUrl;
            clearSubmitError();
            doRegistration(longitude, latitude, reservationId, photoUrl);
        }, function(error) {
            setSubmitError(error);
        });
    };
}]);