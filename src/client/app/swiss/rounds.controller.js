(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('RoundsController', RoundsController);

  RoundsController.$inject = ['roundsService'];

  function RoundsController(roundsService) {
    var vm = this;
    vm.rounds = [];
    vm.selectedRound;

    activate();

    //////////

    function activate() {
      if (vm.rounds.length === 0) {
        vm.rounds = roundsService.startRound(1);
        vm.selectedRound = vm.rounds[0];
      }
    }
  }
})();
