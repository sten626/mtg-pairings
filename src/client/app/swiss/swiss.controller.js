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

    vm.activePlayer = {name: ''};
    vm.addButtonText = 'Add Player';
    vm.begin = begin;
    vm.createMatches = createMatches;
    vm.editPlayer = editPlayer;
    vm.matchData = [];
    vm.numberOfRounds = 3;
    vm.outstandingFilter = outstandingFilter;
    vm.players = [];
    vm.removePlayer = removePlayer;
    vm.savePlayer = savePlayer;
    vm.setActiveMatch = setActiveMatch;
    vm.showOutstanding = true;
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
     * Clears the active player object.
     */
    function clearActivePlayer() {
      vm.activePlayer = {name: ''};
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
            player1Result: 'Awaiting Result',
            player2: {name: 'BYE'},
            player2GameWins: 0,
            player2Result: 'Awaiting Result',
            draws: 0,
            complete: false
          });
        }
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
     * Function for calculating the recommended number of rounds based on number
     * of players.
     *
     * @return {number} The recommended number of rounds.
     */
    function getRecommendedNumberOfRounds() {
      return Math.max(Math.ceil(Math.log2(vm.players.length)), 3);
    }

    /**
     * Filters matches for outstanding checkbox.
     *
     * @param  {Object}  match The match to check for the filter.
     * @return {boolean}       True if we should show the match, false
     *                         otherwise.
     */
    function outstandingFilter(match) {
      if (vm.showOutstanding && match.complete) {
        return false;
      }

      return true;
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
      vm.activeMatch = match;
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
    }
  }
})();
