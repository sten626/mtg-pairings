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
      }

      clearActivePlayer();
    }
  }
})();
