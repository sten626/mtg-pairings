(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('RoundsController', RoundsController);

  RoundsController.$inject = ['Round', 'Player'];

  function RoundsController(Round, Player) {
    var vm = this;
    vm.clearSelectedPairingResult = clearSelectedPairingResult;
    vm.createPairings = createPairings;
    vm.deleteResults = deleteResults;
    vm.getPlayerName = getPlayerName;
    vm.pairingsFilter = pairingsFilter;
    vm.player1ResultDisplay = player1ResultDisplay;
    vm.player2ResultDisplay = player2ResultDisplay;
    vm.redoPairings = redoPairings;
    vm.rounds = [];
    vm.searchQuery = '';
    vm.selectedPairing;
    vm.selectedRound;
    vm.setSelectedPairing = setSelectedPairing;
    vm.showOutstanding = true;
    vm.submitMatchResults = submitMatchResults;

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

    function clearSelectedPairingResult() {
      if (vm.selectedPairing) {
        vm.selectedPairing.player1GameWins = 0;
        vm.selectedPairing.player2GameWins = 0;
        vm.selectedPairing.draws = 0;
        vm.selectedPairing.done = false;

        vm.selectedRound.save();
        vm.selectedPairing = null;
      }
    }

    function createPairings() {
      vm.selectedRound.generatePairings();
    }

    function deleteResults() {
      var i;
      var pairing;

      if (vm.selectedRound) {
        for (i = 0; i < vm.selectedRound.pairings.length; i++) {
          pairing = vm.selectedRound.pairings[i];

          if (pairing.player2Id !== -1) {
            pairing.player1GameWins = 0;
            pairing.player2GameWins = 0;
            pairing.draws = 0;
            pairing.done = false;
          }
        }

        vm.selectedRound.save();
      }
    }

    function getPlayerName(id) {
      var player = Player.get({id: id});
      return player ? player.name : 'BYE';
    }

    function pairingsFilter(pairing) {
      if (vm.showOutstanding && pairing.done) {
        return false;
      }

      var trimmedQuery = vm.searchQuery.trim();

      if (trimmedQuery) {
        trimmedQuery = trimmedQuery.toLowerCase();

        if (getPlayerName(pairing.player1Id).toLowerCase().indexOf(trimmedQuery) !== -1) {
          return true;
        }

        if (getPlayerName(pairing.player2Id).toLowerCase().indexOf(trimmedQuery) !== -1) {
          return true;
        }

        if ('' + pairing.id === trimmedQuery) {
          return true;
        }

        return false;
      }

      return true;
    }

    function player1ResultDisplay(pairing) {
      if (pairing.done) {
        return pairing.player1GameWins + '/' + pairing.player2GameWins + '/' +
            pairing.draws;
      } else {
        return 'Awaiting result';
      }
    }

    function player2ResultDisplay(pairing) {
      if (pairing.done) {
        if (pairing.player2Id > 0) {
          return pairing.player2GameWins + '/' + pairing.player1GameWins + '/' +
              pairing.draws;
        } else {
          return '';
        }
      } else {
        return 'Awaiting result';
      }
    }

    function redoPairings() {
      vm.selectedRound.pairings.length = 0;
      vm.selectedRound.save();
    }

    function setSelectedPairing(pairing) {
      vm.selectedPairing = pairing;
    }

    function submitMatchResults() {
      if (vm.selectedPairing) {
        vm.selectedPairing.done = true;

        vm.selectedRound.save();
        vm.selectedPairing = null;
      }
    }
  }
})();
