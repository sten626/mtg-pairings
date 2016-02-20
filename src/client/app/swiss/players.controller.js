(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('PlayersController', PlayersController);

  PlayersController.$inject = ['playerService'];

  function PlayersController(playerService) {
    var vm = this;

    vm.addPlayer = addPlayer;
    vm.newPlayerName = '';
    vm.players = [];
    vm.removePlayer = removePlayer;

    activate();

    //////////

    function activate() {
      vm.players = playerService.getPlayers();
    }

    function addPlayer() {
      if (vm.newPlayerName !== '') {
        playerService.createPlayer(vm.newPlayerName);
        vm.newPlayerName = '';
      }
    }

    function removePlayer(player) {
      playerService.removePlayer(player);
    }
  }
})();
