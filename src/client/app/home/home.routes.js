(function() {
  'use strict';

  angular
    .module('mtgPairings.home')
    .config(stateConfig)
    .run(stateRun);

  stateConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  /**
   * Configure the home state.
   *
   * @param  {Object} $stateProvider     Angular's state provider.
   * @param  {Object} $urlRouterProvider Angular's url router provider.
   */
  function stateConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/home/home.html'
      });
  }

  stateRun.$inject = ['$rootScope', '$state'];

  /**
   * Add the state to the root scope.
   *
   * @param  {Object} $rootScope Angular's root scope.
   * @param  {Object} $state     Angular's state object.
   */
  function stateRun($rootScope, $state) {
    $rootScope.$state = $state;
  }
})();
