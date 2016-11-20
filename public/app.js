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
                $scope.isEmpty = 100 - (data.EmptyGlass * 100).toFixed(2);
                $scope.isDirty = (data.WaterIsDirty * 100).toFixed(2);
                $scope.glassExists = (data.GlassExists * 100).toFixed(2);
            });

            //takepicture()
            /*var millisecondsToWait = 3000;
            setTimeout(function() {
            	$('#video').click();
            }, millisecondsToWait);
            */
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var showToastButton = document.querySelector('#demo-show-toast');

            var msg = { message: 'Data Updated.' };

            if(data.GlassExists > 0.80)
            {
            	if(data.WaterIsDirty > 0.80 && data.EmptyGlass < 0.8)
            	{
            		msg = { message: 'Ooops! Your water is dirty and your glass is full. Turn your tap off and get a filter check.'};	
        		}
        		else if(data.WaterIsDirty > 0.80 && data.EmptyGlass > 0.8)
        		{
        			msg = { message: 'Ooops! Your glass is full, turn your tap off. Your water seems clean. Good job.' };
        		}
            }
            
            snackbarContainer.MaterialSnackbar.showSnackbar(msg);
        };

    }]);





})();
