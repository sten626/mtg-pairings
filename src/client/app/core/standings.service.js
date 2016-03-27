(function() {
  'use strict';

  angular
    .module('mtgPairings.core')
    .factory('StandingsService', StandingsService);

  StandingsService.$inject = ['Player', 'Round'];

  /**
   * Service for calculating standings.
   *
   * @param {Object} Player Our service for managing players.
   * @param {Object} Round  Our service for managing rounds.
   */
  function StandingsService(Player, Round) {
    var service = {
      calculateStandings: calculateStandings
    };

    return service;

    //////////

    /**
     * Calculate the stats for a given Player.
     *
     * @param {Object} player The Player to calculate stats for.
     * @param {Object} rounds An array of completed rounds to pull stats from.
     */
    function calculatePlayerStats(player, rounds) {
      player.matchPoints = 0;
      player.matchesDrawn = 0;
      player.matchesPlayed = 0;
      player.matchesWon = 0;
      player.opponentIds.length = 0;

      rounds.forEach(function(round) {
        var i;
        var pairing;
        var pairings = round.pairings;

        for (i = 0; i < pairings.length; i++) {
          pairing = pairings[i];

          if (pairing.player1Id === player.id) {
            player.matchesPlayed += 1;
            player.opponentIds.push(pairing.player2Id);

            if (pairing.player1GameWins > pairing.player2GameWins) {
              player.matchPoints += 3;
              player.matchesWon += 1;
            } else if (pairing.player1GameWins === pairing.player2GameWins) {
              player.matchPoints += 1;
              player.matchesDrawn += 1;
            }

            break;
          } else if (pairing.player2Id === player.id) {
            player.matchesPlayed += 1;
            player.opponentIds.push(pairing.player1Id);

            if (pairing.player2GameWins > pairing.player1GameWins) {
              player.matchPoints += 3;
              player.matchesWon += 1;
            } else if (pairing.player2GameWins === pairing.player1GameWins) {
              player.matchPoints += 1;
              player.matchesDrawn += 1;
            }

            break;
          }
        }
      });
    }

    /**
     * Calculate the standings for all players considering all completed rounds.
     */
    function calculateStandings() {
      var players = Player.query();
      var rounds = Round.query().filter(function(round) {
        return round.done;
      });

      players.forEach(function(player) {
        calculatePlayerStats(player, rounds);
      });
    }
  }
})();
