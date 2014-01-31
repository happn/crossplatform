'use strict';

var app = angular.module('yoApp', ['ngCookies',
                                  'ngResource',
                                  'ngSanitize',
                                  'ngRoute',
                                  'ngTouch', 
                                  'snap']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  });

app.config(function(snapRemoteProvider) {
    snapRemoteProvider.globalOptions.disable = 'right';
  });

app.run(function($log, $http, $document, $rootScope){

  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();

  $rootScope.queryDate = (day<10 ? '0' : '') + day + (month<10 ? '0' : '') + month + d.getFullYear();
  
  $http({method: 'GET', url:'http://appserver.happn.de:8010/v1/week/' + $rootScope.queryDate})
      .success(function(data){
        $log.log('Ja ich lade was herunter');

        for (var i = 0; i< data.data.length; ++i){
          //var dateArray = data.data[i].date.split("/");
          $log.log(new Date(data.data[i].date));
          data.data[i].date = new Date(data.data[i].date);
        }
        
        $rootScope.menus = data.data;
        $log.log($rootScope.menus);
    });
});

