(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('SwissController', SwissController);

  SwissController.$inject = ['$state'];

  /**
   * Controller for the Swiss views.
   *
   * @param {Object} $state ui-router's state object.
   */
  function SwissController($state) {
    var vm = this;

    vm.activePlayer = {
      name: '',
      dropped: false
    };
    vm.addButtonText = 'Add Player';
    vm.begin = begin;
    vm.clearActiveMatchResult = clearActiveMatchResult;
    vm.createMatches = createMatches;
    vm.deleteResults = deleteResults;
    vm.editPlayer = editPlayer;
    vm.isMatchSubmitDisabled = isMatchSubmitDisabled;
    vm.matchData = [];
    vm.numberOfRounds = 3;
    vm.players = [];
    vm.redoMatches = redoMatches;
    vm.removePlayer = removePlayer;
    vm.roundsFilter = roundsFilter;
    vm.savePlayer = savePlayer;
    vm.searchQuery = '';
    vm.setActiveMatch = setActiveMatch;
    vm.showOutstanding = true;
    vm.showStandingsPill = false;
    vm.standingsSearch = '';
    vm.standingsSearchFilter = standingsSearchFilter;
    vm.submitMatchResult = submitMatchResult;

    ////////////

    /**
     * Begin's the tournement.
     */
    function begin() {
      vm.currentRound = {
        round: 1,
        matches: []
      };
      vm.matchData.push(vm.currentRound);

      $state.go('swiss.rounds');
    }

    /**
     * Clears the active match.
     */
    function clearActiveMatch() {
      vm.activeMatch = null;
    }

    /**
     * Clears the result of the active match.
     */
    function clearActiveMatchResult() {
      vm.activeMatch.player1GameWins = 0;
      vm.activeMatch.player1Result = 'Awaiting Result';
      vm.activeMatch.player2GameWins = 0;
      vm.activeMatch.player2Result = 'Awaiting Result';
      vm.activeMatch.draws = 0;
      vm.activeMatch.complete = false;
      vm.currentRound.complete = false;

      if (vm.currentRound.round === 1) {
        vm.showStandingsPill = false;
      }
    }

    /**
     * Clears the active player object.
     */
    function clearActivePlayer() {
      vm.activePlayer = {
        name: '',
        dropped: false
      };

      vm.addButtonText = 'Add Player';
    }

    /**
     * Generate pairings for a given round.
     */
    function createMatches() {
      var players;
      var tableNumber = 1;

      if (vm.currentRound.round === 1) {
        players = shufflePlayers();

        while (players.length >= 2) {
          vm.currentRound.matches.push({
            table: tableNumber,
            player1: players[0],
            player1GameWins: 0,
            player1Result: 'Awaiting Result',
            player2: players[1],
            player2GameWins: 0,
            player2Result: 'Awaiting Result',
            draws: 0,
            complete: false
          });

          players.splice(0, 2);
          tableNumber += 1;
        }

        if (players.length === 1) {
          // Odd number of players, give a bye.
          vm.currentRound.matches.push({
            table: tableNumber,
            player1: players[0],
            player1GameWins: 2,
            player1Result: '***Bye***',
            player2: {name: ''},
            player2GameWins: 0,
            player2Result: '',
            draws: 0,
            complete: true
          });
        }
      }
    }

    /**
     * Delete all the results for the current round.
     */
    function deleteResults() {
      vm.currentRound.matches.forEach(function(match) {
        match.player1GameWins = 0;
        match.player1Result = 'Awaiting Result';
        match.player2GameWins = 0;
        match.player2Result = 'Awaiting Result';
        match.draws = 0;
        match.complete = false;
      });

      vm.currentRound.complete = false;

      if (vm.currentRound.round === 1) {
        vm.showStandingsPill = false;
      }
    }

    /**
     * Load an existing player as the active player for editing.
     *
     * @param  {Object} player The player to set as active.
     */
    function editPlayer(player) {
      vm.activePlayer = player;
      vm.addButtonText = 'Save Player';
    }

    /**
     * Generates opponents match win and game win percentages for a player.
     *
     * @param  {Object} player The player to make calculations for.
     */
    function generateOpponentStats(player) {
      var opponentsMatchWinPercentageSum = 0;
      var opponentsGameWinPercentageSum = 0;
      var opponentsCount = player.opponents.length;

      if (opponentsCount > 0) {
        player.opponents.forEach(function(opponent) {
          var matchPoints = opponent.matchPoints;
          var potentialMatchPoints = opponent.matchesPlayed * 3;
          var gamePoints = opponent.gamePoints;
          var potentialGamePoints = opponent.gamesPlayed * 3;
          opponentsMatchWinPercentageSum += Math.max(
            matchPoints / potentialMatchPoints,
            1 / 3);
          opponentsGameWinPercentageSum += gamePoints / potentialGamePoints;
        });

        player.opponentsMatchWinPercentage = +(opponentsMatchWinPercentageSum /
            opponentsCount * 100).toFixed(2);
        player.opponentsGameWinPercentage = +(opponentsGameWinPercentageSum /
            opponentsCount * 100).toFixed(2);
      }
      else {
        // Player has only had a bye.
        player.opponentsMatchWinPercentage = 0;
        player.opponentsGameWinPercentage = 0;
      }
    }

    /**
     * Calculates match and game stats for a player.
     *
     * @param  {Object} player The player to get stats for.
     */
    function generatePlayerStats(player) {
      player.matchPoints = 0;
      player.matchWins = 0;
      player.matchLosses = 0;
      player.matchDraws = 0;
      player.matchByes = 0;
      player.matchesPlayed = 0;
      player.opponents = [];
      player.gamePoints = 0;
      player.gameWins = 0;
      player.gameLosses = 0;
      player.gameDraws = 0;
      player.gamesPlayed = 0;
      player.gameWinPercentage = 0;

      vm.matchData.forEach(function(round) {
        round.matches.forEach(function(match) {
          if (match.player1 === player) {
            if (match.player1Result !== '***Bye***') {
              if (match.player1GameWins > match.player2GameWins) {
                player.matchPoints += 3;
                player.matchWins += 1;
              } else if (match.player1GameWins === match.player2GameWins) {
                player.matchPoints += 1;
                player.matchDraws += 1;
              } else {
                player.matchLosses += 1;
              }

              player.matchesPlayed += 1;
              player.opponents.push(match.player2);
              player.gamePoints += match.player1GameWins * 3 + match.draws;
              player.gameWins += match.player1GameWins;
              player.gameLosses += match.player2GameWins;
              player.gameDraws += match.draws;
              player.gamesPlayed += match.player1GameWins +
                  match.player2GameWins + match.draws;
              player.gameWinPercentage = +(player.gamePoints / 3 /
                  player.gamesPlayed * 100).toFixed(2);
            } else {
              // Player had a bye
              player.matchPoints += 3;
              player.matchByes += 1;
              player.gamePoints += 6;
              player.gameWins += 2;
              player.gamesPlayed += 2;
              player.gameWinPercentage = +(player.gamePoints / 3 /
                  player.gamesPlayed * 100).toFixed(2);
            }
          } else if (match.player2 === player) {
            if (match.player2GameWins > match.player1GameWins) {
              player.matchPoints += 3;
              player.matchWins += 1;
            } else if (match.player2GameWins === match.player1GameWins) {
              player.matchPoints += 1;
              player.matchDraws += 1;
            } else {
              player.matchLosses += 1;
            }

            player.matchesPlayed += 1;
            player.opponents.push(match.player1);
            player.gamePoints += match.player2GameWins * 3 + match.draws;
            player.gameWins += match.player2GameWins;
            player.gameLosses += match.player1GameWins;
            player.gameDraws += match.draws;
            player.gamesPlayed += match.player1GameWins +
                match.player2GameWins + match.draws;
            player.gameWinPercentage = +(player.gamePoints / 3 /
                player.gamesPlayed * 100).toFixed(2);
          }
        });
      });
    }

    /**
     * Calculate the standings of the players.
     */
    function generateStandings() {
      var rank = 1;

      vm.players.forEach(function(player) {
        generatePlayerStats(player);
      });

      vm.players.forEach(function(player) {
        generateOpponentStats(player);
      });

      vm.players.sort(playerStandingsCompareFunction);

      vm.players.forEach(function(player) {
        player.rank = rank++;
      });
    }

    /**
     * Function for calculating the recommended number of rounds based on number
     * of players.
     *
     * @return {number} The recommended number of rounds.
     */
    function getRecommendedNumberOfRounds() {
      return Math.max(Math.ceil(Math.log2(vm.players.length)), 3);
    }

    /**
     * Controls if the match submit button is enabled or not.
     *
     * @return {Boolean} True if button should be disabled, false otherwise.
     */
    function isMatchSubmitDisabled() {
      if (vm.activeMatch) {
        if (vm.activeMatch.player1GameWins +
            vm.activeMatch.player2GameWins +
            vm.activeMatch.draws === 0) {
          return true;
        }

        if (vm.activeMatch.player1GameWins +
            vm.activeMatch.player2GameWins +
            vm.activeMatch.draws > 3) {
          return true;
        }
      }

      return false;
    }

    /**
     * Compare function for sorting the standings table.
     *
     * @param  {Object} a First player to be compared.
     * @param  {Object} b Second player to be compared.
     * @return {number}   Negative if a ranks higher, positive if b ranks
     *                    higher, 0 if equal.
     */
    function playerStandingsCompareFunction(a, b) {
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
     * Clears the pairings for the current round.
     */
    function redoMatches() {
      vm.currentRound.matches = [];
      vm.currentRound.complete = false;

      if (vm.currentRound.round === 1) {
        vm.showStandingsPill = false;
      }
    }

    /**
     * Remove a player from the players array.
     *
     * @param  {Object} player The player to be removed from the array.
     */
    function removePlayer(player) {
      vm.players.splice(vm.players.indexOf(player), 1);

      if (player === vm.activePlayer) {
        clearActivePlayer();
      }
    }

    /**
     * Filter for viewing pairings.
     *
     * @param  {Object}  match The match to check for filtering.
     * @return {Boolean}       True if the match should be shown, false
     *                         otherwise.
     */
    function roundsFilter(match) {
      if (vm.showOutstanding && match.complete) {
        return false;
      }

      var trimmedQuery = vm.searchQuery.trim();

      if (trimmedQuery) {
        trimmedQuery = trimmedQuery.toLowerCase();

        if (match.player1.name.toLowerCase().indexOf(trimmedQuery) !== -1) {
          return true;
        }
        if (match.player2.name.toLowerCase().indexOf(trimmedQuery) !== -1) {
          return true;
        }
        if ('' + match.table === trimmedQuery) {
          return true;
        }

        return false;
      }

      return true;
    }

    /**
     * Saves the active player, whether it be new or edited.
     */
    function savePlayer() {
      if (vm.players.indexOf(vm.activePlayer) === -1) {
        vm.players.push(vm.activePlayer);
        vm.numberOfRounds = getRecommendedNumberOfRounds();
      }

      clearActivePlayer();
    }

    /**
     * Sets the active match.
     *
     * @param {Object} match The match to set as active.
     */
    function setActiveMatch(match) {
      if (match.player1Result !== '***Bye***') {
        vm.activeMatch = match;
      }
    }

    /**
     * Shuffles the players array and returns a shallow copy.
     *
     * @return {Array} A shuffled shallow copy of the players array.
     */
    function shufflePlayers() {
      var currentIndex = vm.players.length;
      var playersCopy = vm.players.slice();
      var randomIndex;
      var tempValue;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        tempValue = playersCopy[currentIndex];
        playersCopy[currentIndex] = playersCopy[randomIndex];
        playersCopy[randomIndex] = tempValue;
      }

      return playersCopy;
    }

    /**
     * Filter for the standings table.
     *
     * @param  {Object}  player The player to check for the filter.
     * @return {Boolean}        True if player should be shown, false otherwise.
     */
    function standingsSearchFilter(player) {
      var trimmedSearch = vm.standingsSearch.trim();

      if (trimmedSearch) {
        trimmedSearch = trimmedSearch.toLowerCase();

        if (player.name.toLowerCase().indexOf(trimmedSearch) !== -1) {
          return true;
        }

        return false;
      }

      return true;
    }

    /**
     * Submit the match results for the active match, from player 1's
     * perspective.
     *
     * @param  {number} wins   The number of game wins for player 1.
     * @param  {number} losses The number of game wins for player 2.
     * @param  {number} draws  The number of draws between the players.
     */
    function submitMatchResult(wins, losses, draws) {
      if (!draws) {
        draws = 0;
      }

      vm.activeMatch.player1GameWins = wins;
      vm.activeMatch.player2GameWins = losses;
      vm.activeMatch.draws = draws;
      vm.activeMatch.player1Result = wins + '/' + losses + '/' + draws;
      vm.activeMatch.player2Result = losses + '/' + wins + '/' + draws;
      vm.activeMatch.complete = true;

      clearActiveMatch();

      var outstandingMatches = vm.currentRound.matches.filter(function(match) {
        return match.complete === false;
      });

      if (outstandingMatches.length === 0) {
        vm.currentRound.complete = true;
        vm.showStandingsPill = true;
        generateStandings();
        $state.go('swiss.standings');
      }
    }
  }
})();
