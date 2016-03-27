(function() {
  'use strict';

  angular
    .module('mtgPairings.core')
    .factory('Round', RoundService);

  RoundService.$inject = ['Player'];

  /**
   * Service for managing Rounds.
   *
   * @param {Object} Player The Player service, which lets us interact with the
   *                        players.
   */
  function RoundService(Player) {
    var rounds = [];

    /**
     * Constructor for a Round.
     *
     * @param {Object} roundData Properties to apply to the new Round.
     */
    function Round(roundData) {
      angular.extend(this, {
        id: nextId(),
        pairings: []
      });

      if (roundData) {
        angular.extend(this, roundData);
      }
    }

    angular.extend(Round, {
      query: query
    });

    Round.prototype = {
      generatePairings: generatePairings,
      save: save
    };

    return Round;

    //////////

    /**
     * Generate pairings for the Round.
     */
    function generatePairings() {
      /* jshint validthis: true */
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
            player2Id: player2.id,
            player1GameWins: 0,
            player2GameWins: 0,
            draws: 0,
            done: false
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
            player2Id: -1,
            player1GameWins: 2,
            player2GameWins: 0,
            draws: 0,
            done: true
          });
        }

        localStorage.setItem('rounds', angular.toJson(rounds));
      }
    }

    /**
     * Get the next ID to use for new Rounds.
     *
     * @return {Number} The next ID to use.
     */
    function nextId() {
      if (!nextId.id) {
        nextId.id = 1;
      }

      return nextId.id++;
    }

    /**
     * Fetch all Rounds for localStorage and return them.
     *
     * @return {Array} All existing Rounds.
     */
    function query() {
      var maxId = 0;
      var roundsString;
      var roundsData;

      // If rounds is empty, fetch from localStorage.
      if (rounds.length === 0) {
        roundsString = localStorage.getItem('rounds');
        roundsData = roundsString ? angular.fromJson(roundsString) : [];

        roundsData.forEach(function(roundData) {
          var round;

          if (roundData.id > maxId) {
            maxId = roundData.id;
          }

          round = new Round(roundData);
          round.save();
        });

        nextId.id = maxId + 1;
      }

      return rounds;
    }

    /**
     * Add the Round to the rounds array and save to localStorage.
     */
    function save() {
      /* jshint validthis: true */
      if (rounds.indexOf(this) === -1) {
        rounds.push(this);
      }

      localStorage.setItem('rounds', angular.toJson(rounds));
    }
  }
})();
