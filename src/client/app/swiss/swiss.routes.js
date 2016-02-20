(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  /**
   * Configure the states for the swiss view.
   *
   * @param  {Object} $stateProvider Angular's state provider.
   */
  function stateConfig($stateProvider) {
    $stateProvider
      .state('swiss', {
        url: '/swiss',
        abstract: true,
        templateUrl: 'app/swiss/swiss.html'
        //controller: 'SwissController',
        //controllerAs: 'swiss'
      })
      .state('swiss.players', {
        url: '',
        templateUrl: 'app/swiss/swiss.players.html',
        controller: 'PlayersController',
        controllerAs: 'vm'
      })
      .state('swiss.rounds', {
        url: '/rounds',
        templateUrl: 'app/swiss/swiss.rounds.html'
      })
      .state('swiss.standings', {
        url:'/standings',
        templateUrl: 'app/swiss/swiss.standings.html'
      });
  }
})();
