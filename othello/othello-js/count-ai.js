(function () {
  // okay, O is othello
  var O = othello;

  function sum(ns) {
    // what is t, what is n
    return ns.reduce(function (t, n) {return t + n;});
  }

  function scoreBoard(board, player) {
    // opponent is the next player of the play in O othello
    var opponent = O.nextPlayer(player);
    // what is v
    return sum($.map(board, function (v) {return v == player;})) -
           sum($.map(board, function (v) {return v == opponent;}));
  }

  O.registerAI({
    // O is othello, register ai
    findTheBestMove: function (gameTree) {
      var scores =
        gameTree.moves.map(function (m) {
          return scoreBoard(O.force(m.gameTreePromise).board, gameTree.player);
        });
      var maxScore = Math.max.apply(null, scores);
      return gameTree.moves[scores.indexOf(maxScore)]
    }
  });
})();
// vim: expandtab softtabstop=2 shiftwidth=2 foldmethod=marker
