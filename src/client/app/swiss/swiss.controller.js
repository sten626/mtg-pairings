(function() {
  'use strict';

  angular
    .module('mtgPairings.swiss')
    .controller('SwissController', SwissController);

  SwissController.$inject = ['Round'];

  /**
   * Controller for the Swiss views.
   *
   * @param {Object} $state ui-router's state object.
   */
  function SwissController(Round) {
    var vm = this;

    vm.showRoundsPill = showRoundsPill;

    ////////////

    function showRoundsPill() {
      if (Round.query().length > 0) {
        return true;
      }

      return false;
    }
  }
})();
