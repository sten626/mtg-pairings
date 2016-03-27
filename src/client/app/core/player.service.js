(function() {
  'use strict';

  angular
    .module('mtgPairings.core')
    .factory('Player', PlayerService);

  /**
   * Service for managing players.
   */
  function PlayerService() {
    var players = [];

    /**
     * Constructor for a Player object.
     *
     * @param {Object} playerData Properties of the player being created.
     */
    function Player(playerData) {
      if (playerData) {
        angular.extend(this, {
          id: nextId(),
          name: ''
        });

        angular.extend(this, playerData);
      }
    }

    angular.extend(Player, {
      get: get,
      query: query,
      recommendedNumberOfRounds: recommendedNumberOfRounds,
      shuffle: shuffle
    });

    Player.prototype = {
      remove: remove,
      save: save
    };

    return Player;

    //////////

    /**
     * Searches for a single player in storage which matches the data given.
     *
     * @param  {Object} playerData An object containing one or more player
     *                             properties.
     * @return {Object|null}       The Player found, or null otherwise.
     */
    function get(playerData) {
      var failed;
      var i;
      var key;

      if (players.length === 0) {
        query();
      }

      if (playerData) {
        for (i = 0; i < players.length; i++) {
          failed = 0;

          for (key in playerData) {
            if (playerData.hasOwnProperty(key)) {
              if (playerData[key] !== players[i][key]) {
                failed += 1;
              }
            }
          }

          if (!failed) {
            return players[i];
          }
        }
      }

      return null;
    }

    /**
     * Gets the next ID to use for a newly created Player.
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
     * Loads all Players for localStorage and returns them.
     *
     * @return {Array} An array of all the existing Players.
     */
    function query() {
      var maxId = 0;
      var playersString;
      var playersData;

      // If players is empty, fetch from localStorage.
      if (players.length === 0) {
        playersString = localStorage.getItem('players');
        playersData = playersString ? angular.fromJson(playersString) : [];

        playersData.forEach(function(playerData) {
          var player;

          if (playerData.id > maxId) {
            maxId = playerData.id;
          }

          player = new Player(playerData);
          player.save();
        });

        nextId.id = maxId + 1;
      }

      return players;
    }

    /**
     * Calculates the recommended number of rounds, based on the number of
     * players.
     *
     * @return {Number} The recommended number of rounds.
     */
    function recommendedNumberOfRounds() {
      return Math.max(Math.ceil(Math.log2(players.length)), 3);
    }

    /**
     * Delete the Player from the players array and from localStorage.
     */
    function remove() {
      /* jshint validthis: true */
      players.splice(players.indexOf(this), 1);
      localStorage.setItem('players', angular.toJson(players));
    }

    /**
     * Adds the Player to the players array, and save to localStorage.
     */
    function save() {
      /* jshint validthis: true */
      if (players.indexOf(this) === -1) {
        players.push(this);
      }

      localStorage.setItem('players', angular.toJson(players));
    }

    /**
     * Shuffles the players array and returns a shallow copy.
     *
     * @return {Array} A shuffled shallow copy of the players array.
     */
    function shuffle() {
      Player.query();
      var currentIndex = players.length;
      var playersCopy = players.slice();
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
  }
})();
