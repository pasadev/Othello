let useCookies = false;
let useSpeech = false;
let showOptions = false;


var keyboardSelectedPosition = document.querySelector(".selected");
var attackable = document.querySelectorAll(".attackable");
function gameBoardNoFocusStart(){
  
};

(function (O) {
  'use strict';

  // User Interface {{{1
  function addSelectedOnGameboardRefresh(player, selectedPosition){
    var selectedPositionId= selectedPosition.id;
    var addSelected = document.getElementById(selectedPositionId);

    addSelected.classList.add("selected");
    addSelected.focus();

  }

  function drawGameBoard(board, player, moves, selectedPosition="") {
    // define the gameBoard
    var ss = [];
    // define the attackable tiles
    var attackable = [];
    //forEach move, if move isn't a passing move show attackable tiles
    moves.forEach(function (m) {
      if (!m.isPassingMove)
        attackable[O.ix(m.x, m.y)] = true;

    });



    ss.push('<div id="game-table" tabindex="0">');
    // for y create columns
    for (var y = -1; y < O.N; y++) {
      ss.push('<div class="game-tr">');
      // for  y column create x cells
      for (var x = -1; x < O.N; x++) {
        if (0 <= y && 0 <= x) {
          // tabindex to make cells focusable
          ss.push('<div tabindex="0" aria-label="'+String.fromCharCode('a'.charCodeAt(0)+x)+(y + 1));
          ss.push(' ');
          ss.push(attackable[O.ix(x, y)] ? 'attackable' : '')
          ss.push(' ');
          ss.push(attackable[O.ix(x, y)] ? player : board[O.ix(x, y)]);
          ss.push('"')
          ss.push(' class="');
          ss.push('cell');
          ss.push(' ');
          // if tile is attackable, player name as class, if not show board[O.ix(x, y)] returns what is on the tiled
          ss.push(attackable[O.ix(x, y)] ? player : board[O.ix(x, y)]);
          // console.log(board[O.ix(x, y)])
          ss.push(' ');
          // if tile is attackable put attackable in class, if not put nothing
          ss.push(attackable[O.ix(x, y)] ? 'attackable' : 'not-attackable');
          ss.push('" id="');
          // cell coordinates in id
          ss.push('cell_' + x + '_' + y);
          ss.push('">');
          ss.push('<span class="disc"></span>');
          ss.push('</div>');
        } else if (0 <= x && y === -1) {
          // add letters on top x row
          ss.push('<div class="game-header-x">' + String.fromCharCode('a'.charCodeAt(0)+x) + '</div>');
        } else if (x === -1 && 0 <= y) {
          // add numbers on left y column
          ss.push('<div class="game-header-y">' + (y + 1) + '</div>');
        } else /* if (x === -1 && y === -1) */ {
          // empty space top left
          ss.push('<div class="game-header"></div>');
        }
      }
      ss.push('</div>');
    }
    ss.push('</div>');

      // add created gameBoard into the html on #game-board
    $('#game-board').html(ss.join(''));
      // give the name of the player to the html
    $('#current-player-name').text(player);


    if (selectedPosition !== ""){
      if (selectedPosition !== null){

        console.log(selectedPosition)
        addSelectedOnGameboardRefresh(player, selectedPosition)
    }
    }
  }

  

  function resetUI() {
    $('#console').empty();
    $('#message').empty();
  }




  // this is where i add keyboard functionality
  function setUpUIToChooseMove(gameTree) {


    //reinitialize the values inside array

    $('#message').text('Choose your move.');
    // m = move i think
    gameTree.moves.forEach(function (m, i) {
      // console.log(gameTree);
      // when move is pass
      // can only pass when player cannot play
      if (m.isPassingMove) {

          //if (useSpeech = true){speakMove("pass");};
          
      
        $('#console').append(
          // add button to pass
          $('<input type="button" aria-label="No moves possible, Button to pass the turn" class="btn pass-button">')
          // val is jquery, gives the button the value with 0.nameMove(m)
          .val(O.nameMove(m))
          .click(function () {
            shiftToNewGameTree(O.force(m.gameTreePromise));
          })
        );

        console.log(document.querySelector(".pass-button"))
        document.querySelector(".pass-button").focus();

      } else {
        // adds an event listener for all the x and y coordinates of m
        
        if (true) {

              // behavior of game is erratic,
              // solution is creating the click listener
              // and manually create a click event on enter
              $('#cell_' + m.x + '_' + m.y)
              .click(function () {
                shiftToNewGameTree(O.force(m.gameTreePromise));
              });

              
         
          

          if (keyboardSelectedPosition !== null) {

           

            document.addEventListener("keydown",function(e){handleEnter(e, m)});

            function handleEnter(e, m) {
              if (keyboardSelectedPosition === document.querySelector('#cell_' + m.x + '_' + m.y))
                {
                  if (e.key === "Enter"){

                  // refresh the variable keyboardSelectedPosition
                    keyboardSelectedPosition = document.querySelector(".selected");
                        //console.log(keyboardSelectedPosition);
                        //console.log(document.querySelector('#cell_' + m.x + '_' + m.y));
                        
                          if (useSpeech ===true && e.key === "Enter"){speakMove("attacked");};
                     
                     
                        keyboardSelectedPosition.click();
                       // below solution created erratic behavior in what gameTree was sent
                       // click() works
                       // return shiftToNewGameTree(O.force(m.gameTreePromise));
                      };
                      
                   
                  }
                  //if not enter go out
                return
                }
            //handle enter stopped here
          }
        }
        
      
    }
    //forEach has ended here
  })
}

    


  function setUpUIToReset() {
    //either resets games
    resetGame();
    //  repeat games has been checked start new game when game is over
    if ($('#repeat-games:checked').length)
      startNewGame();

  }

  var minimumDelayForAI = 500;  // milliseconds
  function chooseMoveByAI(gameTree, ai) {
    // parameters are gameTree and ai
    $('#message').text('Now thinking...');
    setTimeout(
      function () {
        // input start time and end time, makes the move after
        var start = Date.now();
        // sends gametreepromise as chosen by the ai
        var newGameTree = O.force(ai.findTheBestMove(gameTree).gameTreePromise);
        // the squares of the board start at 0 on x and y
        var aiMove = ai.findTheBestMove(gameTree);
        //console.log(ai.findTheBestMove(gameTree));
        var end = Date.now();
        var delta = end - start;
        // set the time limit for the ai to make a move.
        setTimeout(
          function () {
            if (useSpeech === true){speakMove("opponentAttacked", aiMove)};
            // speak where it attacked
            shiftToNewGameTree(newGameTree);
          },
          Math.max(minimumDelayForAI - delta, 1)
        );
      },
      1
    );
  }

  function showWinner(board) {
    var r = O.judge(board);
    $('#message').text(
      r === 0 ?
      'The game ends in a draw.' :
      // what is O
      'The winner is ' + (r === 1 ? O.BLACK : O.WHITE) + '.'
    );

    document.querySelector('#message').focus();
  }

  var playerTable = {};

  function makePlayer(playerType) {
    if (playerType === 'human') {
      return setUpUIToChooseMove;
    } else {
      var ai = O.makeAI(playerType);
      // gameTree and ai chooses move
      return function (gameTree) {
        chooseMoveByAI(gameTree, ai);
      };
    }
  }

  function blackPlayerType() {
    return $('#black-player-type').val();
  }

  function whitePlayerType() {
    return $('#white-player-type').val();
  }

  function swapPlayerTypes() {
    var t = $('#black-player-type').val();
    $('#black-player-type').val($('#white-player-type').val()).change();
    $('#white-player-type').val(t).change();
  }

  function shiftToNewGameTree(gameTree) {
    // add parameters, reset ui,
    drawGameBoard(gameTree.board, gameTree.player, gameTree.moves, keyboardSelectedPosition);
    resetUI();
    // no more moves, show winner
    if (gameTree.moves.length === 0) {
      showWinner(gameTree.board);
      recordStat(gameTree.board);
      // if repeat games, show stat of how many times played
      if ($('#repeat-games:checked').length)
        showStat();
      setUpUIToReset();
    } else {
      // continue game is my guess
      playerTable[gameTree.player](gameTree);
    }
  }

  var stats = {};

  // calculate stats

  function recordStat(board) {
    var s = stats[[blackPlayerType(), whitePlayerType()]] || {b: 0, w: 0, d: 0};
    var r = O.judge(board);
    if (r === 1)
      s.b++;
    if (r === 0)
      s.d++;
    if (r === -1)
      s.w++;
    stats[[blackPlayerType(), whitePlayerType()]] = s;
  }

  function showStat() {
    var s = stats[[blackPlayerType(), whitePlayerType()]];
    $('#stats').text('Black: ' + s.b + ', White: ' + s.w + ', Draw: ' + s.d);
  }

  function resetGame() {
    $('#preference-pane :input:not(#repeat-games)')
      .removeClass('disabled')
      .removeAttr('disabled');
  }

  function startNewGame(){
    // when starting game can't change parameters anymore
    // added the ids i don't want to be disabled
    $('#preference-pane :input:not(#repeat-games, #mouse-play-method, #keyboard-play-method, #text-to-speech, #start-button)')
      .addClass('disabled')
      .attr('disabled', 'disabled');
    playerTable[O.BLACK] = makePlayer(blackPlayerType());
    playerTable[O.WHITE] = makePlayer(whitePlayerType());
    shiftToNewGameTree(O.makeInitialGameTree());
    //console.log(O.makeInitialGameTree())

    var gameBoardFirstAttackable = document.querySelector(".attackable");
    var gameBoardAttackable = document.querySelectorAll(".attackable");

    var keyboardSelectedPosition = document.querySelector(".selected");
    if (keyboardSelectedPosition !== null){
      keyboardSelectedPosition.classList.remove("selected");
    }
    keyboardSelectedPosition = gameBoardFirstAttackable;

    keyboardSelectedPosition.classList.add("selected");
    keyboardSelectedPosition.focus()
    console.log(keyboardSelectedPosition);

    $('#attackable').click(function () {
                shiftToNewGameTree(O.force(m.gameTreePromise));
              });
    
    

    gameBoardAttackable.forEach (attackableCell => attackableCell.addEventListener("keydown",(function (e) {
      if (e.key === "Enter"){
        console.log("hello click")
    keyboardSelectedPosition.click();
  };
    })));
   
    
   // setUpUIToChooseMove(O.makeInitialGameTree());
  }

  // Original code copyright Jukka 


    




  // fetch all sibling elements on dom

  const siblings = (elem) => {
    // create an empty array
    let siblings = [];

    // if no parent, return empty list
    if (!elem.parentNode) {
        return siblings;
    }

    // first child of the parent node
    let sibling = elem.parentNode.firstElementChild;

    // loop through next siblings until `null`
    do {
        // push sibling to array
        if (sibling != elem) {
            siblings.push(sibling);
        }
    } while (sibling = sibling.nextElementSibling);
    
    return siblings;
  };

  // giveCoordinates


  function giveCoordinates(
  directionCall="", 
  blackTiles, 
  whiteTiles, 
  attackableBlackTiles, 
  attackableWhiteTiles, 
  keyboardSelectedPosition) {
    
    let t;
    //console.log(keyboardSelectedPosition.id)

     // speak when on tile
     for (t=0; t<blackTiles.length; t++){
      //console.log(blackTiles[t])
      if (keyboardSelectedPosition === blackTiles[t]){
        var matches = keyboardSelectedPosition.id.match(/\d+/g);
        //console.log(matches);
        speakMove("black", matches[0], matches[1])
        return
      }

    }
    for (t=0; t<whiteTiles.length; t++){
      if (keyboardSelectedPosition === whiteTiles[t]){
        var matches = keyboardSelectedPosition.id.match(/\d+/g);
        speakMove("white", matches[0], matches[1])
        return
      }
    }
    for (t=0; t<attackableBlackTiles.length; t++) {
      if (keyboardSelectedPosition === attackableBlackTiles[t]){
        var matches = keyboardSelectedPosition.id.match(/\d+/g);
        speakMove("attackable", matches[0], matches[1])
        return
      }
    }
    for (t=0; t<attackableWhiteTiles.length; t++) {
      if (keyboardSelectedPosition === attackableWhiteTiles[t]){
        var matches = keyboardSelectedPosition.id.match(/\d+/g);
        speakMove("attackable", matches[0], matches[1])
        return
      }
    }
    // else, speech move direction
    var matches = keyboardSelectedPosition.id.match(/\d+/g);
    //speakMove(directionCall, matches[0], matches[1] );
  }


  function detectFocusOnCell() {
    let cellDetect = document.querySelector('.cell');
    cellDetect.addEventListener("focus", changeFocusAndSelected());
    keyboardSelectedPosition = document.querySelector(".selected");
    keyboardSelectedPosition.classList.remove('selected');
    cellDetect.classList.add('selected');
  };

  let gameOn = false;
// if a certain cell is focused, using tab for example, make the cell Selected.
  function selectFocusedCell() {
    //function  is called when change in focus in cell is detected

    var cells = document.querySelectorAll('.cell');
    
    if(gameOn === false){
      for (let i = 0; i < cells.length; ++i) {
        if (cells[i].classList.contains("attackable")) {
          console.log("hello")
          gameOn = true;
          return
        } else {continue}
      }
    
    } else if (gameOn === true) {
        for (let j = 0; j < cells.length; ++j) {
    
          if (e.target == cells[j]) {
            console.log("game on and targetting cell")
                //this condition is fucky
            if (keyboardSelectedPosition !== null){
              // selected exists because if it did not the above if would be true
            console.log(cells[j]);
            // remove previous selected
            keyboardSelectedPosition = document.querySelector(".selected");
            keyboardSelectedPosition.classList.remove("selected");
            //cell.classList.remove(":focus");
    
              // make the focused cell selected
              // cell in this case is the one which had :focus
              keyboardSelectedPosition = cells[j];
              // select the focused cell and add selected to it.
              keyboardSelectedPosition.classList.add("selected");
              keyboardSelectedPosition.focus();
              //keyboardSelectedPosition.classList.add(":focus");
              return
    
            } else {
            
              console.log("no selected on board")
    
              keyboardSelectedPosition = cells[j];
              // select the focused cell and add selected to it.
              keyboardSelectedPosition.classList.add("selected");
              keyboardSelectedPosition.focus();
              return
    
            }
          }
        }
      }
}

// by defining gameOn outside of function, it does not get redefined each time
// that the function is called

function selectHoveredCell(e) {
  //function is called when change in hover of cell is detected
  var cells = document.querySelectorAll('.cell');
  var gameBoard = document.querySelector("#game-board")

  //console.log(gameOn)

  if(gameOn === false){
  for (let i = 0; i < cells.length; ++i) {
    if (cells[i].classList.contains("attackable")) {
      console.log("hello")
      gameOn = true;
      return
    } else {continue}
  }

} else if (gameOn === true) {
    for (let j = 0; j < cells.length; ++j) {

      if (e.target == cells[j]) {
        //console.log("game on and targetting cell")
            //this condition is fucky
            keyboardSelectedPosition = document.querySelector(".selected")
        if (keyboardSelectedPosition !== null){
          // selected exists because if it did not the above if would be true
        //console.log(cells[j]);
        // remove previous selected
        keyboardSelectedPosition.classList.remove("selected");
        //cell.classList.remove(":focus");

          // make the focused cell selected
          // cell in this case is the one which had :focus
          keyboardSelectedPosition = cells[j];
          // select the focused cell and add selected to it.
          keyboardSelectedPosition.classList.add("selected");
          keyboardSelectedPosition.focus();
          //keyboardSelectedPosition.classList.add(":focus");
          return

        } else {
        
          console.log("no selected on board")

          keyboardSelectedPosition = cells[j];
          // select the focused cell and add selected to it.
          keyboardSelectedPosition.classList.add("selected");
          keyboardSelectedPosition.focus();
          return

        }
      }
    }
  }
  // foreach below does not work for some reason
  /*cells.forEach(cell => function(){
    console.log("hello there")
    if (cell.classList.contains('attackable') ) {
      console.log("attackable found")
      return
    } else {
      console.log("no attackable")
    }
    })*/
}

 
  function handleArrowKeys(e) {

    keyboardSelectedPosition = document.querySelector(".selected");
    if (keyboardSelectedPosition == null) {
      console.log("null")
      return
    }

    //console.log(keyboardSelectedPosition);
    // refresh the variable keyboardSelectedPosition
    var nextColumn = keyboardSelectedPosition.nextElementSibling;
    //console.log(nextColumn);
    var previousColumn = keyboardSelectedPosition.previousElementSibling;
    //console.log(previousColumn);
    var currentCellRow = keyboardSelectedPosition.parentElement;
    //console.log(currentCellRow);

    let nodeListOfRows = siblings(document.querySelector(".game-tr"));
    //console.log( nodeListOfRows);
    let p;
    let l;
    
    var blackTiles= document.querySelectorAll(".black.not-attackable");
    var whiteTiles= document.querySelectorAll(".white.not-attackable");
    var attackableWhiteTiles = document.querySelectorAll(".white.attackable");
    var attackableBlackTiles = document.querySelectorAll(".black.attackable");

   
   //console.log(keyboardSelectedPosition.id);

    if (keyboardSelectedPosition !== null) {

      // arrowup
      if (e.key == "ArrowUp"){
        //console.log("arrowup")
        e.preventDefault();

        for (p=0; p < nodeListOfRows.length; p++) {
          
           if (currentCellRow === nodeListOfRows[p]) 
           {
             for (l=1; l < currentCellRow.childNodes.length; l++)
             {
              if (keyboardSelectedPosition === currentCellRow.childNodes[l])
              {
                if (nodeListOfRows[p-1] !== undefined) {
                  keyboardSelectedPosition.classList.remove("selected");
                  var nextPosition = nodeListOfRows[p-1].childNodes[l];
                  keyboardSelectedPosition = nextPosition;
                  keyboardSelectedPosition.classList.add("selected");
                  keyboardSelectedPosition.focus();
                  if (useSpeech === true) {
                    giveCoordinates(
                    "up", 
                    blackTiles, 
                    whiteTiles, 
                    attackableBlackTiles, 
                    attackableWhiteTiles, 
                    keyboardSelectedPosition);
                  }
                }
                else {console.log("stay on the board please");}
              }
             }
              return 
           }
          }
        }

        // arrowdown
      if (e.key == "ArrowDown"){
          e.preventDefault();

        //console.log("arrowdown")
          for (p=nodeListOfRows.length; p >= 0 ; p--) {
             if (currentCellRow === nodeListOfRows[p]) 
             {
               for (l=1; l < currentCellRow.childNodes.length; l++)
               {
                if (keyboardSelectedPosition === currentCellRow.childNodes[l])
                {
                  if (nodeListOfRows[p+1] !== undefined) {
                    keyboardSelectedPosition.classList.remove("selected");
                    var nextPosition = nodeListOfRows[p+1].childNodes[l];
                    keyboardSelectedPosition = nextPosition;
                    keyboardSelectedPosition.classList.add("selected");
                    keyboardSelectedPosition.focus();

                    if (useSpeech === true){
                      giveCoordinates(
                      "down", 
                      blackTiles, 
                      whiteTiles, 
                      attackableBlackTiles, 
                      attackableWhiteTiles, 
                      keyboardSelectedPosition);   
                    }
                  }
                  else {console.log("stay on the board please");}
                }
               }
                return 
             }
            }
          }

        // arrowleft
      if (e.key == "ArrowLeft"){
        //console.log("arrowleft")
          e.preventDefault();
          for (p=0; p < nodeListOfRows.length; p++) {
             if (currentCellRow === nodeListOfRows[p]) 
             {
               for (l=0; l < currentCellRow.childNodes.length; l++)
               {
                if (keyboardSelectedPosition === currentCellRow.childNodes[l])
                {
                  if ( nodeListOfRows[p].childNodes[l-1] !==  nodeListOfRows[p].childNodes[0]) {
  
                    keyboardSelectedPosition.classList.remove("selected");
                    var nextPosition = previousColumn;
                    keyboardSelectedPosition = nextPosition;
                    keyboardSelectedPosition.classList.add("selected");
                    keyboardSelectedPosition.focus();


                    if (useSpeech === true) {
                      giveCoordinates(
                      "left", 
                      blackTiles, 
                      whiteTiles, 
                      attackableBlackTiles, 
                      attackableWhiteTiles, 
                      keyboardSelectedPosition);
                    };
                  }
                  else {
                    console.log("stay on the board please");
                  }
                }
              }
            }
          }
        }

          //arrowright
      if (e.key == "ArrowRight"){

          e.preventDefault();
          //console.log("arrowright");

          if (nextColumn !== null) {
            //console.log("mission going as expected right");
            keyboardSelectedPosition.classList.remove("selected");
            keyboardSelectedPosition = nextColumn;
            keyboardSelectedPosition.classList.add("selected");
            keyboardSelectedPosition.focus();

            
            if (useSpeech === true){      
              giveCoordinates(
              "right", 
              blackTiles, 
              whiteTiles, 
              attackableBlackTiles, 
              attackableWhiteTiles, 
              keyboardSelectedPosition);
          };
            return;} 
            else {console.log("please don't step off the board");}
          }
    }
}

  // choose between keyboard or mouse to play
  /*
  function choosePlayMethod(e, cookieParameter) {
    console.log(e.target.id);
    var targetId = e.target.id;
    var mouseMethodCheck = document.getElementById('mouse-play-method');
    var keyboardMethodCheck = document.getElementById('keyboard-play-method');

    $('input[type="checkbox"]').on('change', function() {
      console.log("there has been a change");

      if (targetId == "mouse-play-method" || cookieParameter === "mouse") {
        keyboardMethodCheck.checked = false;
        mouseMethodCheck.checked = true;

        setCookie('keyboardOrMouse', 'mouse', 3)

        document.removeEventListener("keydown", handleArrowKeys);
  
      }
      else if (targetId == "keyboard-play-method" || cookieParameter === "keyboard") {
        mouseMethodCheck.checked = false;
        keyboardMethodCheck.checked = true;

        setCookie('keyboardOrMouse', 'keyboard', 3)

        document.addEventListener("keydown",function(e){handleArrowKeys(e)});


      };




 });

  }
  */

  function chooseGameboardSizeButton(e, cookieParameter) {
    var targetId = e.target.id;
    var smallGameboardButton = document.getElementById('small-gameboard-button');
    var bigGameboardButton = document.getElementById('big-gameboard-button');

    let screenWidth = document.documentElement.clientWidth;
    let screenHeight = document.documentElement.clientHeight;
    let pixelWidthInVW = 100 / screenWidth; //result in vw
    let pixelHeightInVH = 100 / screenHeight; //result in vh
  
    let size;
    
    $('input[type="checkbox"]').on('change', function() {
      console.log("there has been a change");


      if (targetId == "small-gameboard-button" || cookieParameter === "small") {
        bigGameboardButton.checked = false;
        smallGameboardButton.checked = true;

        //setCookie('keyboardOrMouse', 'mouse', 3)

          let size = 40;
          let newBoardSizeBasedOnWidth = size / pixelWidthInVW;
          let newBoardSizeBasedOnHeight = size / pixelHeightInVH;
   
        if (screenWidth <= screenHeight){
          gameBoard.style.height = newBoardSizeBasedOnWidth+"px";
          gameBoard.style.width = newBoardSizeBasedOnWidth+"px";
        }
        else if (screenWidth > screenHeight) {
          gameBoard.style.height = newBoardSizeBasedOnHeight+"px";
          gameBoard.style.width = newBoardSizeBasedOnHeight+"px";
        }}

      else if (targetId == "big-gameboard-button" || cookieParameter === "big") {
        bigGameboardButton.checked = true;
        smallGameboardButton.checked = false;
        //setCookie('keyboardOrMouse', 'keyboard', 3)

        let size = 85;
        let newBoardSizeBasedOnWidth = size / pixelWidthInVW;
        let newBoardSizeBasedOnHeight = size / pixelHeightInVH;
   
    if (screenWidth <= screenHeight){
      gameBoard.style.height = newBoardSizeBasedOnWidth+"px";
      gameBoard.style.width = newBoardSizeBasedOnWidth+"px";
    }
    else if (screenWidth > screenHeight) {
      gameBoard.style.height = newBoardSizeBasedOnHeight+"px";
      gameBoard.style.width = newBoardSizeBasedOnHeight+"px";
      };
    }
  })
}

function checkHowManyAttackables(){
  var attackables = document.querySelectorAll(".attackable");


}

function focusOutOfGameBoard(e){
  var focusCheck = document.activeElement;
   var gameTable = document.querySelector("#game-table");
   keyboardSelectedPosition = document.querySelector(".selected");
  
    if (gameTable.contains(focusCheck)) {
      if (keyboardSelectedPosition == null) {

        keyboardSelectedPosition = document.querySelector("#cell_0_0");
        keyboardSelectedPosition.classList.add("selected");
        console.log(keyboardSelectedPosition)
        console.log("added")
        // Don't know why existing eventlistener didn't work.
        keyboardSelectedPosition.addEventListener("click", function () {
          shiftToNewGameTree(O.force(m.gameTreePromise));
        });

        return;
      }
      
      if (e.key === 'Tab') {
      var nextFocus = document.querySelector("#focus-out")
      keyboardSelectedPosition.classList.remove("selected");
      nextFocus.focus();
      }
    }
  

}
  

  function handleUseSpeech(e, cookieParameter) {
    //var targetId = e.target.id;
    var textToSpeech = document.getElementById('text-to-speech');
    let optionsButton = document.querySelector('#text-to-speech-options');
    //console.log(optionsButton);

    //console.log(textToSpeech.checked)
    if (textToSpeech.checked === true || cookieParameter === true) {
      showOptions = true;
      useSpeech = true;
      setCookie('voiceSynthesis', 'true', 3)
      //console.log(document.cookie)
    }

      if (textToSpeech.checked === false || cookieParameter === false) {
        showOptions = false;
        useSpeech = false;
        setCookie('voiceSynthesis', 'false', 3)

      }
    //  toggleOptionsButton();

      
  };



    // Here is where startup things start. Don't know what {{{}}} is.
  // Startup {{{1

  // Check if there are cookies
  document.addEventListener('DOMContentLoaded', function() {
    //check whether playing with keyboard or playing with mouse in cookie
    var selectedPlayMethod = getCookieValue('keyboardOrMouse');
    //console.log(selectedPlayMethod);

    //var mouseMethodCheck = document.getElementById('mouse-play-method');
    //var keyboardMethodCheck = document.getElementById('keyboard-play-method');

    /*if (selectedPlayMethod != ''){
      // because of the way i created the choosePlayMethod,
      // I define the starting defaults here
      if (selectedPlayMethod == "keyboard") {
        keyboardMethodCheck.checked = true;
        mouseMethodCheck.checked = false;
        document.addEventListener("keydown",function(e){handleArrowKeys(e)});
      }
      else if (selectedPlayMethod == "mouse") {
        keyboardMethodCheck.checked = false;
        mouseMethodCheck.checked = true;
        document.removeEventListener("keydown", handleArrowKeys);
      }
    };
    */

    // check if voicesynthesis is on or off

   // var voiceSynthesisOnOff = getCookieValue('voiceSynthesis');
   // var textToSpeech = document.getElementById('text-to-speech');
    //console.log(voiceSynthesisOnOff);

   //   if (voiceSynthesisOnOff === "true") {
   //   textToSpeech.checked = true;

   //   handleUseSpeech('', true);

    //  }
    // else if (voiceSynthesisOnOff === "false") {
    //    textToSpeech.checked = false;

    //    handleUseSpeech('', false);
     // }

  /*  themeSelect.value = selectedTheme;
    saveclass = saveclass ? saveclass : document.body.className;
    document.body.className = saveclass + ' ' + selectedTheme;
    */

    var voiceRate = getCookieValue('voiceRate');
      if (voiceRate != "") {
        const rate = document.querySelector('#rate');
        //console.log(voiceRate);
        rate.value = parseFloat(voiceRate);
        //console.log(parseFloat(voiceRate));

        var rateValue = document.querySelector('#rate-value');
        rateValue.textContent = rate.value;
            }

    var voicePitch = getCookieValue('voicePitch');
        if (voicePitch != "") {
          const pitch = document.querySelector('#pitch');
          pitch.value = parseFloat(voicePitch);

          var pitchValue = document.querySelector('#pitch-value');
          pitchValue.textContent = pitch.value;
        }
  
});
// end domcontentloaded

// change gameboard size

const gameBoard = document.querySelector('#game-board');
const optionsContainer = document.querySelector('#options');
const boardSize = document.querySelector('#board-size');
const boardSizeValue = document.querySelector('#board-size-value');
const main = document.querySelector('#main');

// 
console.log(optionsContainer.offsetWidth + gameBoard.offsetWidth)
if (window.innerHeight <= window.innerWidth) {
  
  if (main.offsetWidth >= optionsContainer.offsetWidth + gameBoard.offsetWidth){
    gameBoard.style.float = "left";
    gameBoard.style.marginLeft = "auto";
    optionsContainer.style.float = "right";

  }

}

/* 
  
  boardSize.addEventListener('change', 
  function() { 
    boardSizeValue.textContent = boardSize.value+"%";
    // calculate pixels of viewport width
    let screenWidth = document.documentElement.clientWidth;
    let screenHeight = document.documentElement.clientHeight;
    let pixelWidthInVW = 100 / screenWidth; //result in vw
    let pixelHeightInVH = 100 / screenHeight; //result in vh

    let newBoardSizeBasedOnWidth = boardSize.value / pixelWidthInVW;
    let newBoardSizeBasedOnHeight = boardSize.value / pixelHeightInVH;
    // gives the new width in pixels.

    if (screenWidth <= screenHeight){
      gameBoard.style.height = newBoardSizeBasedOnWidth+"px";
      gameBoard.style.width = newBoardSizeBasedOnWidth+"px";
    }
    else if (screenWidth > screenHeight) {
      gameBoard.style.height = newBoardSizeBasedOnHeight+"px";
      gameBoard.style.width = newBoardSizeBasedOnHeight+"px";
    }
  });
  */
// stop

  $('#game-board').mouseover(function(e){selectHoveredCell(e)});
document.addEventListener("keydown",function(e){focusOutOfGameBoard(e)});

  // $('.cell').change(function() {selectFocusedCell(); selectHoveredCell;})
  //above does not work
  $('#play-method').click(function(e) {choosePlayMethod(e);});
  $('#gameboard-form').click(function(e){chooseGameboardSizeButton(e)})
  $('#text-to-speech').click(function(e) {handleUseSpeech(e)});
  $('#start-button').click(function () {startNewGame();});
  $('#speak-button').click(function () {speakTest();});
  $('#add-new-ai-button').click(function () {O.addNewAI();});
  $('#swap-player-types-button').click(function () {swapPlayerTypes();});
  
  document.addEventListener("keydown",function(e){handleArrowKeys(e)});


  //$('#keyboard-play-method').click(function () {setUpUIToChooseMove});
  //$('#mouse-play-method').click(function () {setUpUIToChooseMove});

  resetGame();
  drawGameBoard(O.makeInitialGameBoard(), '-', []);



  //}}}
})(othello);
// vim: expandtab softtabstop=2 shiftwidth=2 foldmethod=marker
