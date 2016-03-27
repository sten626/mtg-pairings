(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('SwissController', SwissController);

  SwissController.$inject = ['Round'];

  /**
   * Controller for the Swiss views.
   *
   * @param {Object} Round Our service for managing Rounds.
   */
  function SwissController(Round) {
    var rounds;
    var vm = this;

    vm.showRoundsPill = showRoundsPill;
    vm.showStandingsPill = showStandingsPill;

    activate();

    ////////////

    /**
     * Initialize the swiss controller/view.
     */
    function activate() {
      rounds = Round.query();
    }

    /**
     * Determines whether the Rounds nav pill should be shown.
     *
     * @return {Boolean} True if pill should be shown, false otherwise.
     */
    function showRoundsPill() {
      return rounds.length > 0;
    }

    /**
     * Determines whether the Standings nav pill should be shown.
     *
     * @return {Boolean} True if pill should be shown, false otherwise.
     */
    function showStandingsPill() {
      var completeRounds = rounds.filter(function(round) {
        return round.done;
      });

      return completeRounds.length > 0;
    }
  }
})();
