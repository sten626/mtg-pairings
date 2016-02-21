(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('PlayersController', PlayersController);

  PlayersController.$inject = ['$state', 'playerService'];

  function PlayersController($state, playerService) {
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

    function activate() {
      vm.players = playerService.getPlayers();
      vm.numberOfRounds = playerService.recommendedNumberOfRounds();
    }

    function addPlayer() {
      if (vm.playerName !== '') {
        playerService.createPlayer(vm.playerName);
        vm.playerName = '';
        vm.numberOfRounds = playerService.recommendedNumberOfRounds();
      }
    }

    function editPlayer(player) {
      vm.editingPlayer = player;
      vm.playerName = player.name;
    }

    function removePlayer(player) {
      playerService.removePlayer(player);
      vm.numberOfRounds = playerService.recommendedNumberOfRounds();
    }

    function savePlayer() {
      vm.editingPlayer.name = vm.playerName;
      playerService.savePlayers();
      vm.editingPlayer = null;
      vm.playerName = '';
    }

    function startRounds() {
      $state.go('swiss.rounds');
    }
  }
})();
