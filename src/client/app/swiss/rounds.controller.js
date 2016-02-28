(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('RoundsController', RoundsController);

  RoundsController.$inject = ['Round'];

  function RoundsController(Round) {
    var vm = this;
    vm.createPairings = createPairings;
    vm.getPlayerName = getPlayerName;
    vm.rounds = [];
    vm.selectedRound;

    activate();

    //////////

    function activate() {
      vm.rounds = Round.query();

      if (vm.rounds.length === 0) {
        var round = new Round();
        round.save();
      }

      vm.selectedRound = vm.rounds[0];
    }

    function createPairings() {
      vm.selectedRound.generatePairings();
    }

    function getPlayerName(id) {
      return playerService.getPlayer(id).name;
    }
  }
})();
