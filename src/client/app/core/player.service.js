(function() {
  'use strict';

  angular
    .module('mtgPairings.core')
    .factory('Player', PlayerService);

  function PlayerService() {
    /*
    var service = {
      createPlayer: createPlayer,
      getPlayer: getPlayer,
      getPlayers: getPlayers,
      recommendedNumberOfRounds: recommendedNumberOfRounds,
      removePlayer: removePlayer,
      savePlayers: savePlayers,
      shuffledPlayers: shuffledPlayers
    };
    var nextId = 1;
    var players = [];
    */
    function Player(playerData) {
      if (playerData) {
        angular.extend(this, {
          id: nextId(),
          name: ''
        });
        angular.extend(this, playerData);
        players.push(this);
      }
    }

    var players = [];

    angular.extend(Player, {
      query: query,
      recommendedNumberOfRounds: recommendedNumberOfRounds
    });

    angular.extend(Player.prototype, {
      remove: remove,
      save: save
    });

    return Player;

    //////////

    function nextId() {
      if (!nextId.id) {
        nextId.id = 1;
      }

      return nextId.id++;
    }

    function query() {
      var i;
      var maxId = 0;
      var player;
      var playersString = localStorage.getItem('players');
      var playersData = playersString ? angular.fromJson(playersString) : [];

      players = [];

      for (i = 0; i < playersData.length; i++) {
        if (playersData[i].id > maxId) {
          maxId = playersData[i].id;
        }

        player = new Player(playersData[i]);
      }

      nextId.id = maxId + 1;

      return players;
    }

    function recommendedNumberOfRounds() {
      return Math.max(Math.ceil(Math.log2(players.length)), 3);
    }

    function remove() {
      players.splice(players.indexOf(this), 1);
      localStorage.setItem('players', angular.toJson(players));
    }

    function save() {
      localStorage.setItem('players', angular.toJson(players));
    }

    /**
     * Shuffles the players array and returns a shallow copy.
     *
     * @return {Array} A shuffled shallow copy of the players array.
     */
    function shuffledPlayers() {
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
