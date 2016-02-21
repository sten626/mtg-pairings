(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('PlayersController', PlayersController);

  PlayersController.$inject = ['playerService'];

  function PlayersController(playerService) {
    var vm = this;

    vm.addPlayer = addPlayer;
    vm.editingPlayer = null;
    vm.editPlayer = editPlayer;
    vm.playerName = '';
    vm.players = [];
    vm.removePlayer = removePlayer;
    vm.savePlayer = savePlayer;

    activate();

    //////////

    function activate() {
      vm.players = playerService.getPlayers();
    }

    function addPlayer() {
      if (vm.playerName !== '') {
        playerService.createPlayer(vm.playerName);
        vm.playerName = '';
      }
    }

    function editPlayer(player) {
      vm.editingPlayer = player;
      vm.playerName = player.name;
    }

    function removePlayer(player) {
      playerService.removePlayer(player);
    }

    function savePlayer() {
      vm.editingPlayer.name = vm.playerName;
      playerService.savePlayers();
      vm.editingPlayer = null;
      vm.playerName = '';
    }
  }
})();
