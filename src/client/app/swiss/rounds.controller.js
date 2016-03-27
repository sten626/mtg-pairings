(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('RoundsController', RoundsController);

  RoundsController.$inject = ['Player', 'Round'];

  /**
   * Controller for the rounds view.
   *
   * @param {Object} Player Our service for managing Players.
   * @param {Object} Round  Our service for managing Rounds.
   */
  function RoundsController(Player, Round) {
    var vm = this;
    vm.clearSelectedPairingResult = clearSelectedPairingResult;
    vm.createPairings = createPairings;
    vm.deleteResults = deleteResults;
    vm.getPlayerName = getPlayerName;
    vm.incrementDraws = incrementDraws;
    vm.incrementPlayer1GameWins = incrementPlayer1GameWins;
    vm.incrementPlayer2GameWins = incrementPlayer2GameWins;
    vm.pairingsFilter = pairingsFilter;
    vm.player1ResultDisplay = player1ResultDisplay;
    vm.player2ResultDisplay = player2ResultDisplay;
    vm.redoPairings = redoPairings;
    vm.rounds = [];
    vm.searchQuery = '';
    vm.selectedPairing = null;
    vm.selectedRound = null;
    vm.setSelectedPairing = setSelectedPairing;
    vm.showOutstanding = true;
    vm.submitMatchResults = submitMatchResults;

    activate();

    //////////

    /**
     * Initialize the rounds controller/view.
     */
    function activate() {
      vm.rounds = Round.query();

      if (vm.rounds.length === 0) {
        var round = new Round();
        round.save();
      }

      vm.selectedRound = vm.rounds[0];
    }

    /**
     * Remove the entered results for the selected pairing.
     */
    function clearSelectedPairingResult() {
      if (vm.selectedPairing) {
        vm.selectedPairing.player1GameWins = 0;
        vm.selectedPairing.player2GameWins = 0;
        vm.selectedPairing.draws = 0;
        vm.selectedPairing.done = false;

        vm.selectedRound.save();
        vm.selectedPairing = null;
      }
    }

    /**
     * Generate pairings for the current round.
     */
    function createPairings() {
      vm.selectedRound.generatePairings();
    }

    /**
     * Delete the results of all pairings for the current round.
     */
    function deleteResults() {
      if (vm.selectedRound) {
        vm.selectedRound.pairings.forEach(function(pairing) {
          if (pairing.player2Id !== -1) {
            pairing.player1GameWins = 0;
            pairing.player2GameWins = 0;
            pairing.draws = 0;
            pairing.done = false;
          }
        });

        vm.selectedRound.save();
      }
    }

    /**
     * Get the name of a player.
     *
     * @param  {Number} id The ID of the player to find.
     * @return {String}    The name of the player.
     */
    function getPlayerName(id) {
      var player = Player.get({id: id});
      return player ? player.name : 'BYE';
    }

    /**
     * Add 1 to the draws on the selected pairing, up to a max of 3.
     */
    function incrementDraws() {
      if (vm.selectedPairing && vm.selectedPairing.draws < 3) {
        vm.selectedPairing.draws++;
      }
    }

    /**
     * Add 1 to player 1's game wins on the selected pairing, up to a max of 2.
     */
    function incrementPlayer1GameWins() {
      if (vm.selectedPairing && vm.selectedPairing.player1GameWins < 2) {
        vm.selectedPairing.player1GameWins++;
      }
    }

    /**
     * Add 1 to player 2's game wins on the selected pairing, up to a max of 2.
     */
    function incrementPlayer2GameWins() {
      if (vm.selectedPairing && vm.selectedPairing.player2GameWins < 2) {
        vm.selectedPairing.player2GameWins++;
      }
    }

    /**
     * Filter for the pairings table; filters by table ID or name.
     *
     * @param  {Object}  pairing The pairing to either show or hide.
     * @return {Boolean}         True if it should be shown, false otherwise.
     */
    function pairingsFilter(pairing) {
      if (vm.showOutstanding && pairing.done) {
        return false;
      }

      var trimmedQuery = vm.searchQuery.trim();

      if (trimmedQuery) {
        trimmedQuery = trimmedQuery.toLowerCase();

        if (getPlayerName(pairing.player1Id).toLowerCase()
            .indexOf(trimmedQuery) !== -1) {
          return true;
        }

        if (getPlayerName(pairing.player2Id).toLowerCase()
            .indexOf(trimmedQuery) !== -1) {
          return true;
        }

        if ('' + pairing.id === trimmedQuery) {
          return true;
        }

        return false;
      }

      return true;
    }

    /**
     * Get a string representing player 1's match result.
     *
     * @param  {Object} pairing The pairing to get the result of.
     * @return {String}         Player 1's match result.
     */
    function player1ResultDisplay(pairing) {
      if (pairing.done) {
        return pairing.player1GameWins + '/' + pairing.player2GameWins + '/' +
            pairing.draws;
      } else {
        return 'Awaiting result';
      }
    }

    /**
     * Get a string representing player 2's match result.
     *
     * @param  {Object} pairing The pairing to get the result of.
     * @return {String}         Player 2's match result.
     */
    function player2ResultDisplay(pairing) {
      if (pairing.done) {
        if (pairing.player2Id > 0) {
          return pairing.player2GameWins + '/' + pairing.player1GameWins + '/' +
              pairing.draws;
        } else {
          return '';
        }
      } else {
        return 'Awaiting result';
      }
    }

    /**
     * Clears the generated pairings for the selected round and saves to
     * localStorage.
     */
    function redoPairings() {
      vm.selectedRound.pairings.length = 0;
      vm.selectedRound.save();
    }

    /**
     * Set a pairing as selected.
     *
     * @param {Object} pairing The pairing to select.
     */
    function setSelectedPairing(pairing) {
      vm.selectedPairing = pairing;
    }

    /**
     * Submit the selected pairing's results. Mark pairing as done.
     */
    function submitMatchResults() {
      if (vm.selectedPairing) {
        vm.selectedPairing.done = true;

        vm.selectedRound.save();
        vm.selectedPairing = null;
      }
    }
  }
})();
