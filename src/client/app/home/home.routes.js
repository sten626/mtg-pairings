(function() {
  'use strict';

  angular
    .module('mtgPairings.home')
    .config(routeConfig);

  routeConfig.$inject = ['$locationProvider', '$stateProvider'];

  /**
   * Configure the home state.
   *
   * @param  {Object} $locationProvider Angular's location provider.
   * @param  {Object} $stateProvider    Angular's state provider.
   */
  function routeConfig($locationProvider, $stateProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/home/home.html'
      });
  }
})();
