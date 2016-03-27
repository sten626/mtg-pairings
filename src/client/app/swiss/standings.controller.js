(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('StandingsController', StandingsController);

  StandingsController.$inject = ['Player', 'StandingsService'];

  /**
   * Controller for managing the standings view.
   *
   * @param {Object} Player           Our service for managing Players.
   * @param {Object} StandingsService Our service for calculating standings.
   */
  function StandingsController(Player, StandingsService) {
    var vm = this;
    vm.players = null;

    activate();

    //////////

    /**
     * Initialize the standings view.
     */
    function activate() {
      vm.players = Player.query();
      StandingsService.calculateStandings();
    }
  }
})();
