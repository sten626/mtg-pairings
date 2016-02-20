(function() {
  'use strict';

  angular
    .module('mtgPairings.core')
    .factory('playerService', playerService);

  function playerService() {
    var service = {
      createPlayer: createPlayer,
      getPlayers: getPlayers
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
      players = angular.fromJson(localStorage.getItem('players'));

      if (!players) {
        players = [];
      }

      nextId = players.length + 1;

      return players;
    }
  }
})();
