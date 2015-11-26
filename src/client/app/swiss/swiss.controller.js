(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('SwissController', SwissController);

  /**
   * Controller for the Swiss views.
   */
  function SwissController() {
    var vm = this;

    vm.activePlayer = {name: ''};
    vm.addButtonText = 'Add Player';
    vm.editPlayer = editPlayer;
    vm.numberOfRounds = 3;
    vm.players = [];
    vm.removePlayer = removePlayer;
    vm.savePlayer = savePlayer;

    ////////////

    /**
     * Clears the active player object.
     */
    function clearActivePlayer() {
      vm.activePlayer = {name: ''};
      vm.addButtonText = 'Add Player';
    }

    /**
     * Load an existing player as the active player for editing.
     *
     * @param  {Object} player The player to set as active.
     */
    function editPlayer(player) {
      vm.activePlayer = player;
      vm.addButtonText = 'Save Player';
    }

    /**
     * Function for calculating the recommended number of rounds based on number
     * of players.
     *
     * @return {number} The recommended number of rounds.
     */
    function getRecommendedNumberOfRounds() {
      var playersCount = vm.players.length;

      if (playersCount <= 8) {
        return 3;
      } else if (playersCount <= 16) {
        return 4;
      } else if (playersCount <= 32) {
        return 5;
      } else if (playersCount <= 64) {
        return 6;
      } else if (playersCount <= 128) {
        return 7;
      } else if (playersCount <= 256) {
        return 8;
      } else if (playersCount <= 512) {
        return 9;
      } else {
        return 10;
      }
    }

    /**
     * Remove a player from the players array.
     *
     * @param  {Object} player The player to be removed from the array.
     */
    function removePlayer(player) {
      vm.players.splice(vm.players.indexOf(player), 1);

      if (player === vm.activePlayer) {
        clearActivePlayer();
      }
    }

    /**
     * Saves the active player, whether it be new or edited.
     */
    function savePlayer() {
      if (vm.players.indexOf(vm.activePlayer) === -1) {
        vm.players.push(vm.activePlayer);
        vm.numberOfRounds = getRecommendedNumberOfRounds();
      }

      clearActivePlayer();
    }
  }
})();
