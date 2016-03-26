(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('PlayersController', PlayersController);

  PlayersController.$inject = ['$state', 'Player'];

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

    function activate() {
      vm.players = Player.query();
      vm.numberOfRounds = Player.recommendedNumberOfRounds();
    }

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

    function editPlayer(player) {
      vm.editingPlayer = player;
      vm.playerName = player.name;
    }

    function removePlayer(player) {
      player.remove();
      vm.numberOfRounds = Player.recommendedNumberOfRounds();
    }

    function savePlayer() {
      vm.editingPlayer.name = vm.playerName;
      vm.editingPlayer.save();
      vm.editingPlayer = null;
      vm.playerName = '';
    }

    function startRounds() {
      $state.go('swiss.rounds');
    }
  }
})();
