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
    vm.addPlayer = addPlayer;
    vm.players = [];
    vm.removePlayer = removePlayer;

    ////////////

    /**
     * Add an additional blank player to the players array.
     */
    function addPlayer() {
      vm.players.push(vm.activePlayer);
      clearActivePlayer();
    }

    /**
     * Clears the active player object.
     */
    function clearActivePlayer() {
      vm.activePlayer = {name: ''};
    }

    /**
     * Remove a player from the players array.
     *
     * @param  {Object} player The player to be removed from the array.
     */
    function removePlayer(player) {
      vm.players.splice(vm.players.indexOf(player), 1);
    }
  }
})();
