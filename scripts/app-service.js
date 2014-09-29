window.module.factory('appService', ['jquery', '$http', '$q', function($, $http, $q) {
    function getGeolocationCoordinates() {
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(
            function(position) { deferred.resolve(position.coords); },
            function(error) { deferred.resolve(null); }
        );
        return deferred.promise;
    }

    function readFile(fileBlob) {
        var deferred = $q.defer();
        var reader = new FileReader();
        reader.onload = function () { deferred.resolve(reader.result); };
        reader.onerror = function () { deferred.reject(); };
        try {
            reader.readAsDataURL(fileBlob);
        } catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }

    function uploadFile(fileData) {
        // var jQueryPromise = $.ajax({
        //     method: 'POST',
        //     url: '<endpoint for our files storage upload action>',
        //     data: fileData
        // });

        var deferred = $.Deferred();
        setTimeout(function() {
            deferred.resolve('www.myimage.com/123');
        }, 200);

        var jQueryPromise = deferred.promise();

        return $q.when(jQueryPromise);
    }

    var reserveCount = 0;
    function reserveUsername(username) {
        // return $http.post('<endpoint for username reservation action>', {
        //     username: username
        // }).$promise;
        var deferred = $q.defer();
        setTimeout(function() {
            if (reserveCount > 0 && reserveCount % 3 === 0) {
                deferred.reject('error reserving "' + username + '"');
            } else {
                var token = 'token' + reserveCount;
                deferred.resolve({
                    token: token,
                    username: username
                });
            }
            reserveCount ++;
        }, 300);

        return deferred.promise;
    }

    return {
        getGeolocationCoordinates: getGeolocationCoordinates,
        readFile: readFile,
        uploadFile: uploadFile,
        reserveUsername: reserveUsername
    };
}]);