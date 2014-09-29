window.module.directive('filePathChanged', function() {
    return {
        restrict: 'A',
        scope: {
            filePathChanged: '&'
        },
        link: function (scope, element, attrs) {
            element.bind('change', function() {
                scope.filePathChanged({ files: element.prop('files') });
            });
        }
    };
});


window.module.config(['$provide', function($provide) {
    $provide.decorator('$q', ['$delegate', function ($delegate) {
        var originalDeferFn = $delegate.defer;

        function appendStateToPromise(promise) {
            promise.state = 'pending';
            promise.then(function(value) {
                promise.state = 'fulfilled';
                promise.resolveValue = value;
            }, function(reason) {
                promise.state = 'rejected';
                promise.rejectReason = reason;
            });
        }

        $delegate.defer = function() {
            var deferred = originalDeferFn.apply($delegate, arguments);

            var promise = deferred.promise;


            // Original "then" function create a deferred without using $q.defer(). Therefore
            // there is a need to take the result and append the state in the resulted promise.
            var originalThen = promise.then;
            promise.then = function() {
                var resultPromise = $delegate.when(originalThen.apply(promise, arguments));

                appendStateToPromise(resultPromise);

                return resultPromise;
            };

            appendStateToPromise(promise);

            return deferred;
        }

        return $delegate;
    }]);
}]);