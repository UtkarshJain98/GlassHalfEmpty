(function() {
    var app = angular.module('glass', []);

    app.factory('socket', function($rootScope) {
        var socket = io.connect();
        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    });

    app.controller('WebcamController', ['$scope', 'socket', function($scope, socket) {
        $scope.image = "emptyyy";
        $scope.isEmpty = "";
        $scope.isDirty = "";
        $scope.glassExists = "";

        this.sendPic = function(data) {
            var obj = {
                "testdot": data
            }

            socket.emit("testFormData", obj, function(data) {
                console.log("Ack received")
                console.log(data); // data will be 'woot'
                $scope.isEmpty = data.EmptyGlass;
                $scope.isDirty = data.WaterIsDirty;
                $scope.glassExists = data.GlassExists;
            });

            //takepicture()
            /*var millisecondsToWait = 3000;
            setTimeout(function() {
            	$('#video').click();
            }, millisecondsToWait);
            */
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var showToastButton = document.querySelector('#demo-show-toast');

            var msg = { message: 'Example Message # ' };
            snackbarContainer.MaterialSnackbar.showSnackbar(msg);
        };

    }]);





})();
