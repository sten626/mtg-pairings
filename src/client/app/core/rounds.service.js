(function() {
  'use strict';

  angular
    .module('mtgPairings.core')
    .factory('Round', RoundService);

  RoundService.$inject = ['Player'];

  function RoundService(Player) {
    var rounds = [];

    function Round(roundData) {
      angular.extend(this, {
        id: nextId(),
        pairings: []
      });

      if (roundData) {
        angular.extend(this, roundData);
      }

      rounds.push(this);
    }

    angular.extend(Round, {
      query: query
    });

    Round.prototype = {
      generatePairings: generatePairings,
      save: save
    };

    /*
    var service = {
      generatePairings: generatePairings,
      getRounds: getRounds,
      startRound: startRound
    };
    var nextId = 1;
    */

    return Round;

    //////////

    function generatePairings() {
      var player1;
      var player2;
      var shuffledPlayers;
      var table = 1;

      if (this.id === 1) {
        shuffledPlayers = Player.shuffle();

        while (shuffledPlayers.length >= 2) {
          player1 = shuffledPlayers.shift();
          player2 = shuffledPlayers.shift();
          this.pairings.push({
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
          this.pairings.push({
            id: table++,
            player1Id: player1.id,
            player2Id: -1
          });
        }

        localStorage.setItem('rounds', angular.toJson(rounds));
      }
    }

    function nextId() {
      if (!nextId.id) {
        nextId.id = 1;
      }

      return nextId.id++;
    }

    function query() {
      var i;
      var maxId = 0;
      var roundsString = localStorage.getItem('rounds');
      var roundsData = roundsString ? angular.fromJson(roundsString) : [];

      rounds = [];

      for (i = 0; i < roundsData.length; i++) {
        if (roundsData[i].id > maxId) {
          maxId = roundsData[i].id;
        }

        new Round(roundsData[i]);
      }

      nextId.id = maxId + 1;

      return rounds;
    }

    function save() {
      localStorage.setItem('rounds', angular.toJson(rounds));
    }

    function getRounds() {
      rounds = angular.fromJson(localStorage.getItem('rounds'));
      return rounds;
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
