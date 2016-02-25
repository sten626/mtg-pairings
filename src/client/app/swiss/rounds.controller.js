(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('RoundsController', RoundsController);

  RoundsController.$inject = ['playerService', 'roundsService'];

  function RoundsController(playerService, roundsService) {
    var vm = this;
    vm.createPairings = createPairings;
    vm.getPlayerName = getPlayerName;
    vm.rounds = [];
    vm.selectedRound;

    activate();

    //////////

    function activate() {
      vm.rounds = roundsService.getRounds();

      if (vm.rounds.length === 0) {
        vm.rounds = roundsService.startRound(1);
      }

      vm.selectedRound = vm.rounds[0];
    }

    function createPairings() {
      roundsService.generatePairings(vm.selectedRound.id);
    }

    function getPlayerName(id) {
      return playerService.getPlayer(id).name;
    }
  }
})();
