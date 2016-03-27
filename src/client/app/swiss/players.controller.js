(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('PlayersController', PlayersController);

  PlayersController.$inject = ['$state', 'Player'];

  /**
   * Controller for the players view.
   *
   * @param {Object} $state Angular's state service.
   * @param {Object} Player Our Player service for managing players.
   */
  function PlayersController($state, Player) {
    var vm = this;

    vm.addPlayer = addPlayer;
    vm.editingPlayer = null;
    vm.editPlayer = editPlayer;
    vm.numberOfRounds = 3;
    vm.playerName = '';
    vm.players = [];
    vm.removePlayer = removePlayer;
    vm.savePlayer = savePlayer;
    vm.startRounds = startRounds;

    activate();

    //////////

    /**
     * Initialize the players view.
     */
    function activate() {
      vm.players = Player.query();
      vm.numberOfRounds = Player.recommendedNumberOfRounds();
    }

    /**
     * Button clicked for creating a player based on entered name.
     */
    function addPlayer() {
      if (vm.playerName !== '') {
        var player = new Player({
          name: vm.playerName
        });

        player.save();
        vm.playerName = '';
        vm.numberOfRounds = Player.recommendedNumberOfRounds();
      }
    }

    /**
     * Load a player back into the text box for name editing.
     *
     * @param  {Object} player The Player to edit.
     */
    function editPlayer(player) {
      if (player) {
        vm.editingPlayer = player;
        vm.playerName = player.name;
      }
    }

    /**
     * Remove a Player from the list of entered players.
     *
     * @param  {Object} player The Player to remove.
     */
    function removePlayer(player) {
      if (player) {
        player.remove();
        vm.numberOfRounds = Player.recommendedNumberOfRounds();
      }
    }

    /**
     * Save the Player being edited, and reset the player text box.
     */
    function savePlayer() {
      vm.editingPlayer.name = vm.playerName;
      vm.editingPlayer.save();
      vm.editingPlayer = null;
      vm.playerName = '';
    }

    /**
     * Start the tournement, go to the rounds view.
     */
    function startRounds() {
      $state.go('swiss.rounds');
    }
  }
})();
