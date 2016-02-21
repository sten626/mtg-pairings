(function() {
  'use strict';

  angular
    .module('mtgPairings.core')
    .factory('roundsService', roundsService);

  roundsService.$inject = ['playerService'];

  function roundsService(playerService) {
    var service = {
      generatePairings: generatePairings,
      startRound: startRound
    };
    var nextId = 1;
    var rounds = [];

    return service;

    //////////

    function generatePairings(roundNum) {
      var player1;
      var player2;
      var round = {
        id: roundNum,
        pairings: []
      };
      var shuffledPlayers;
      var table = 1;

      if (roundNum === 1) {
        shuffledPlayers = playerService.shuffledPlayers();

        while (shuffledPlayers.length >= 2) {
          player1 = shuffledPlayers.shift();
          player2 = shuffledPlayers.shift();
          round.pairings.push({
            id: table++,
            player1Id: player1.id,
            player2Id: player2.id
          });

          player1 = null;
          player2 = null;
        }

        if (shuffledPlayers.length === 1) {
          // Odd number of players; someone gets a bye.
          player1 = shuffledPlayers.shift();
          round.pairings.push({
            id: table++,
            player1Id: player1.id,
            player2Id: -1
          });
        }

        pairings.push(round);
        localStorage.setItem('pairings', angular.toJson(pairings));
      }
    }

    function startRound(roundNum) {
      rounds.push({
        id: roundNum,
        pairings: []
      });

      return rounds;
    }
  }
})();
