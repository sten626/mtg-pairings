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
    vm.searchQuery = '';
    vm.standingsFilter = standingsFilter;

    activate();

    //////////

    /**
     * Initialize the standings view.
     */
    function activate() {
      vm.players = Player.query();
      StandingsService.calculateStandings();
    }

    /**
     * Filters the standings table.
     *
     * @param  {Object}  player The Player to check.
     * @return {Boolean}        True if player should be shown, false otherwise.
     */
    function standingsFilter(player) {
      var trimmedQuery = vm.searchQuery.trim();

      if (trimmedQuery) {
        if (player.name.toLowerCase()
            .indexOf(trimmedQuery.toLowerCase()) !== -1) {
          return true;
        }

        return false;
      }

      return true;
    }
  }
})();
