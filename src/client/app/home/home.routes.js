(function() {
  'use strict';

  angular
    .module('mtgPairings.home')
    .config(routeConfig);

  routeConfig.$inject = ['$locationProvider', '$stateProvider'];

  function routeConfig($locationProvider, $stateProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/home/home.html'
      });
  }
})();
