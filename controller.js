/** @jsx React.DOM */
var playerInc = 0; //keeps track of the current player, used in conjuction with the players array found in the model
var actions = 0; //controls the number of actions per turn
var g; //global game

//Draws the 'UI' on the side of the board, i.e. any elements that are not the board
function drawUI() {
  $("#colLeft").text(""); //refreshes colLeft each time
  console.log("HUH");
  players.forEach(function(e){ //for each player in players
    $("#colLeft").append('<div id='+e.name+'><h2>'+e.name+'  <div class="'+e.name.toLowerCase().substring(0,4)+' nameColor"></div></h2><h3>'+printHand(e)+'</h3');
    // $("#colLeft").append('<div id='+e.name+'></div>')
    // ReactDOM.render(
    //   <PlayerUI player=e />,
    //   document.getElementById('root').
    // )

    //^^Append their name with their color circle and their hand to colLeft
    if(players[playerInc].name==e.name){ //if they are the current player
      $("#"+e.name).find("h2").addClass("current") //add the underline
    }
  })
}

//Iterates thru a player's hand and returns it as a string
function printHand(p) {
  var str = "";
  p.hand.forEach(function (e){
    str+=e.title+" | ";
  })
  return str;
}

//Draws the game board on the screen, using the array 'board'
function drawBoard() {
  board.forEach(function(e, i){ //for each element (read: tile) in array 'board'
    if(e!==-1){ //if element != -1, meaning there is a tile
        $("td[data-index=" + i + "]").html("<p>"+e.name+"</p><p>"+e.type+'</p><div class="players"></div>').addClass(e.tClass); //print the name and the type of tile it is, along with any colors, if appropriate
        e.playersOnTile.forEach(function(p){ //if there are any players on that tile
          console.log(e);
              $("td[data-index=" + i + "]").find(".players").append('<div class="'+p.name.toLowerCase().substring(0,4)+'"></div>') //Add their color circle to the tile
        })
      if(e.floodLevel==1){
        $("td[data-index=" + i + "]").addClass("flooding") //if the tile has floodLevel 1, add a blue tint to it
      } else if(e.floodLevel==2){
        $("td[data-index=" + i + "]").html(""); //if the tile has floodLeve 2, remove it from the board
        $("td[data-index=" + i + "]").attr("class", "blank")
        $("td[data-index=" + i + "]").off("click") //That space can no longer be clicked
      } else {
        $("td[data-index=" + i + "]").removeClass("flooding")
      }
    }
  })
}

$(document).ready(function() {
  g=game(); //make a new game
  drawBoard(); //draw the initial board
  drawUI(); //draw the initial UI

  $("td").on("click", function () {
    if($("#move").is(":checked")){
      if(adjCheck(getTileFromBoard(players[playerInc].location), $(this).data("index"))){ //if the tile clicked is adjacent to the current player's current tile

      movePlayer(players[playerInc], $(this).data("index")) //move the current player to that tile
      drawBoard(); //redraw the board to show the movement
      actions++; //spend an action
      checkActions();
    }

  }
  else if ($("#shore").is(":checked")) {
    if(adjShoreCheck(getTileFromBoard(players[playerInc].location), $(this).data("index"))){
      board[$(this).data("index")].drainTile();
      drawBoard();
      actions++; //spend an action
      checkActions();
    }
  }
  })

})

function checkActions() {
  if(actions==3){ //if this is the third action the player has taken, increment the current player
    var drawCardsCheck = players[playerInc].drawCards();
    if(drawCardsCheck==-2){
      g.incWaterLevel();
      g.shuffleInFlood();
      g.incWaterLevel();
    //  alert("Oh no! You drew TWO water rises cards! You now draw " + g.getFloodDrawAmount() + " flood cards per draw.")
    } else if (drawCardsCheck==-1) {
      g.incWaterLevel();
      g.shuffleInFlood();
  //    alert("Oh no! You drew a water rises card! You now draw " + g.getFloodDrawAmount() + " flood cards per draw.")
    }
    if(playerInc==players.length-1){
      playerInc=0;
    }
    else{
      playerInc++;
    }
    actions=0;
    g.drawFlood()
    drawBoard();
    drawUI();
  }
}
//Checks if click was on valid adjacent tile, included current tile
function adjShoreCheck(playerLoc, clickLoc) {
  if((board[clickLoc+1]==board[playerLoc]||board[clickLoc-1]==board[playerLoc]
    || board[clickLoc+6]==board[playerLoc] || board[clickLoc-6]==board[playerLoc]||board[clickLoc]==board[playerLoc])&&board[clickLoc]!=-1&&board[clickLoc].floodLevel==1){
      //^^ If click was on a adjacent tile in the cardinal directions && the tile clicked was not a -1 tile AND the clicked location does not equal the player's current location
      return true;
    }
    else {
      return false;
    }
}

//Checks if click was on valid adjacent tile, used for movement
function adjCheck(playerLoc, clickLoc) {
  if((board[clickLoc+1]==board[playerLoc]||board[clickLoc-1]==board[playerLoc]
    || board[clickLoc+6]==board[playerLoc] || board[clickLoc-6]==board[playerLoc])&&board[clickLoc]!=-1&&board[clickLoc]!=board[playerLoc]){
      //^^ If click was on a adjacent tile in the cardinal directions && the tile clicked was not a -1 tile AND the clicked location does not equal the player's current location
      return true;
    }
    else {
      return false;
    }
}
