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
      if (rounds.length > 0) {
        return true;
      }

      return false;
    }
  }
})();
