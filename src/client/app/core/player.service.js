(function() {
  'use strict';

  angular
    .module('mtgPairings.core')
    .factory('playerService', playerService);

  function playerService() {
    var service = {
      createPlayer: createPlayer,
      getPlayers: getPlayers,
      removePlayer: removePlayer,
      savePlayers: savePlayers
    };
    var nextId = 1;
    var players = [];

    return service;

    //////////

    function createPlayer(name) {
      var newPlayer = {
        id: nextId++,
        name: name
      };

      players.push(newPlayer);
      localStorage.setItem('players', angular.toJson(players));

      return newPlayer;
    }

    function getPlayers() {
      var i;
      var maxId;

      players = angular.fromJson(localStorage.getItem('players'));

      if (!players) {
        players = [];
        nextId = 1;
      } else {
        for (i = 0; i < players.length; i++) {
          if (!maxId || players[i].id > maxId) {
            maxId = players[i].id;
          }
        }

        nextId = maxId + 1;
      }

      return players;
    }

    function removePlayer(player) {
      var index = players.indexOf(player);
      players.splice(index, 1);

      localStorage.setItem('players', angular.toJson(players));
    }

    function savePlayers() {
      localStorage.setItem('players', angular.toJson(players));
    }
  }
})();
