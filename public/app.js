(function() {
	var app = angular.module('glass', []);

	app.factory('socket', function ($rootScope) {
	  var socket = io.connect();
	  return {
	    on: function (eventName, callback) {
	      socket.on(eventName, function () {  
	        var args = arguments;
	        $rootScope.$apply(function () {
	          callback.apply(socket, args);
	        });
	      });
	    },
	    emit: function (eventName, data, callback) {
	      socket.emit(eventName, data, function () {
	        var args = arguments;
	        $rootScope.$apply(function () {
	          if (callback) {
	            callback.apply(socket, args);
	          }
	        });
	      })
	    }
	  };
	});

	app.controller('WebcamController', ['$scope','socket', function($scope,socket){
		$scope.img = "empty";
		this.sendPic = function(){
			//socket.emit("testFormData", $scope.img);
		};

	}]);
	

	


})();