'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
// angular.module('myApp.services', []).
//   value('version', '0.1');


var app = angular.module('app', []);

// Notes from `AngularJS by O'Reilly`
// We define the socket service as a factory so that it
// is instantiated only once, and thus acts as a singleton
// for the scope of the application
app.factory('socket', function($rootScope) {
    var socket = io.connect('http://localhost:5000');
    return {
        on: function (initData, callback) {
            socket.on(initData, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        }
    };
});
