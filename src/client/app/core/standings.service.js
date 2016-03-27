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
     * Calculate a player's OMW% and OGW%.
     *
     * @param {Object} player The player to calculate stats for.
     */
    function calculateOpponentStats(player) {
      var opponentsGameSum = 0;
      var opponentsMatchSum = 0;

      player.opponentsGameWinPercentage = 0;
      player.opponentsMatchWinPercentage = 0;

      player.opponentIds.forEach(function(opponentId) {
        var opponent = Player.get({id: opponentId});

        opponentsGameSum += opponent.gameWinPercentage;
        opponentsMatchSum += opponent.matchWinPercentage;
      });

      player.opponentsGameWinPercentage = opponentsGameSum /
          player.opponentIds.length;
      player.opponentsMatchWinPercentage = opponentsMatchSum /
          player.opponentIds.length;
      player.save();
    }

    /**
     * Calculate the stats for a given Player.
     *
     * @param {Object} player The Player to calculate stats for.
     * @param {Array}  rounds An array of completed rounds to pull stats from.
     */
    function calculatePlayerStats(player, rounds) {
      player.byes = 0;
      player.gamePoints = 0;
      player.gameWinPercentage = 0;
      player.gamesPlayed = 0;
      player.matchPoints = 0;
      player.matchWinPercentage = 0;
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
            scorePoints(player, pairing.player2Id, pairing.player1GameWins,
                pairing.player2GameWins, pairing.draws);
            break;
          } else if (pairing.player2Id === player.id) {
            scorePoints(player, pairing.player1Id, pairing.player2GameWins,
                pairing.player1GameWins, pairing.draws);
            break;
          }
        }
      });

      player.matchWinPercentage = Math.max(+(player.matchPoints /
          (player.matchesPlayed * 3) * 100).toFixed(4), 33.3333);
      player.gameWinPercentage = Math.max(+(player.gamePoints /
          (player.gamesPlayed * 3) * 100).toFixed(4), 33.3333);

      player.save();
    }

    /**
     * Calculate the standings for all players considering all completed rounds.
     */
    function calculateStandings() {
      var players = Player.query();
      var rank = 1;
      var rounds = Round.query().filter(function(round) {
        return round.done;
      });

      players.forEach(function(player) {
        calculatePlayerStats(player, rounds);
      });

      players.forEach(function(player) {
        calculateOpponentStats(player);
      });

      players.sort(playerStandingsComparator);

      players.forEach(function(player) {
        player.rank = rank++;
      });
    }

    /**
     * Comparator for sorting players for standings.
     *
     * @param  {Object} a The first player to be compared.
     * @param  {Object} b The second player to be compared.
     * @return {Number}   Negative if a ranks higher, positive if b ranks
     *                    higher, 0 if equal.
     */
    function playerStandingsComparator(a, b) {
      /* jshint -W074 */
      // Ignoring complexity warning since there's not much we can do about this
      // to make comparing simpler.
      if (a.matchPoints > b.matchPoints) {
        return -1;
      } else if (a.matchPoints < b.matchPoints) {
        return 1;
      }

      if (a.opponentsMatchWinPercentage > b.opponentsMatchWinPercentage) {
        return -1;
      } else if (a.opponentsMatchWinPercentage <
          b.opponentsMatchWinPercentage) {
        return 1;
      }

      if (a.gameWinPercentage > b.gameWinPercentage) {
        return -1;
      } else if (a.gameWinPercentage < b.gameWinPercentage) {
        return 1;
      }

      if (a.opponentsGameWinPercentage > b.opponentsGameWinPercentage) {
        return -1;
      } else if (a.opponentsGameWinPercentage < b.opponentsGameWinPercentage) {
        return 1;
      }

      return 0;
    }

    /**
     * Track match and game points that a player gained against a given
     * opponent.
     *
     * @param {Object} player     The player to track points for.
     * @param {Number} opponentId That player's opponent's ID.
     * @param {Number} gameWins   The number of games in the match the player
     *                            won.
     * @param {Number} gameLosses The number of games the player lost.
     * @param {Number} draws      The number of games in the match that drew.
     */
    function scorePoints(player, opponentId, gameWins, gameLosses, draws) {
      player.gamePoints += gameWins * 3;
      player.gamePoints += draws;
      player.gamesPlayed += gameWins + gameLosses + draws;
      player.matchesPlayed += 1;

      if (opponentId !== -1) {
        player.opponentIds.push(opponentId);
      }

      if (gameWins > gameLosses) {
        player.matchPoints += 3;
        player.matchesWon += 1;

        if (opponentId === -1) {
          // Had a bye.
          player.byes += 1;
        }
      }
    }
  }
})();
