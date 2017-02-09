var tiles, board, treasureCards, floodCards, players;

//MOVE PLAYER doesn't work

function game() {
  tiles = makeTiles();
  treasureCards = makeCards();
  floodCards = makeFloodCards();
  board = makeBoard();
  players = makePlayers(2);
  setStartingPlayers();
  var tDiscard = [], fDiscard=[], waterLevel = 0, floodDrawAmount;
  drawInitialFlood();
  checkWaterLevel();

  function setStartingPlayers() {
    players.forEach(function(p){
      board.forEach(function(tile){
            if(tile.index==p.location){
              console.log("placing player ", p, tile);
              tile.addPlayer(p);
              //return false;
            }
      })
    })

  }

  function checkWaterLevel(){
    switch (true) {
      case waterLevel<3:
        floodDrawAmount = 2;
        break;
      case waterLevel<6:
        floodDrawAmount = 3;
        break;
      case waterLevel<8:
        floodDrawAmount = 4;
        break;
      case waterLevel<10:
        floodDrawAmount = 5;
        break;
    }
  }

  function drawInitialFlood(){
    for(var i = 0; i<6; i++){
      // board[floodCards.pop()].floodTile();
      fDiscard.push(floodTile(floodCards.pop()))
    }
  }

  function floodTile(index){
    if(board[index]==-1){
      alert("That tile is already completely flooded!")
    }
    else{
      board[index].floodTile()
      if(board[index].floodLevel>2){
        console.log("Oh no! That tile has completely flooded!")
        board[index]=-1;
      }
      else{
        console.log(board[index].name + " has been flooded!")
      }
    }
    return index;
  }

  return {
    getBoard: board,
    getCards: treasureCards,
    getFloodCards: floodCards,
    incWaterLevel: function() {
      return this.waterLevel++;
    },
    checkWaterLevel: function() {
      checkWaterLevel();
    },

    floodTile: function(i) {
      floodTile(i);
    }

  }


}


function makeBoard(){
  var b = [];
  for(var i = 0; i<36; i++){
    if(i == 0 || i == 1 || i == 4 || i == 5 ||
       i == 6 || i == 11 || i == 24 || i == 29 ||
       i == 30 || i == 31 || i == 34 || i == 35) {
         b.push(-1);
       }
       else{
         b.push(tiles.shift());
       }
  }
  return b;

}

function makePlayers(p){
  var a = [];
  var roles = shuffle([1,2,3,4,5,6]);
  for(var i = 0; i < p; i++){
    a.push(makePlayer(roles.pop()));
  }
  //alert(p);
  return a;
}

function makePlayer(r){

  function setName(role){
    switch(role){
      case 1:
        return "Explorer";
      case 2:
        return "Engineer";
      case 3:
        return "Messenger";
      case 4:
        return "Pilot";
      case 5:
        return "Diver";
      case 6:
        return "Navigator";
    }
  }

  function setStart(role){
    switch(role){
      case 1:
        return 10;
      case 2:
        return 11;
      case 3:
        return 12;
      case 4:
        return 13;
      case 5:
        return 14;
      case 6:
        return 15;
    }
  }

  return {
    role: r,
    name: setName(r),
    start: setStart(r),
    location: setStart(r),
    hand: [treasureCards.pop(), treasureCards.pop()],
    updateLocation: function(l){
      this.location = l;
      return this.location;
    }
  }
}

function makeCards() {
  var c = [];
  for(var i = 0; i<28; i++){
      c.push(makeCard(i));
  }
  return shuffle(c);

}

function makeCard(type){

  function setTitle(t){
    switch (true) {
      case t < 5:
          return "The Crystal of Fire";
      case t < 10:
          return "The Ocean's Chalice";
      case t < 15:
          return "The Statue of the Wind";
      case t < 20:
          return "The Earth Stone";
      case t < 23:
          return "Water Rises!";
      case t < 26:
          return "Helicopter Lift";
      case t < 28:
          return "Sandbags";
    }
  }

  return {
    type: type,
    title: setTitle(type)
  }
}

function makeFloodCards() {
  var f = [];
  for(var i = 2; i < 34; i++){
    if(i == 4 || i == 5 ||
       i == 6 || i == 11 || i == 24 || i == 29 ||
       i == 30 || i == 31){}
    else{
      f.push(i);
    }
  }
  return shuffle(f);
}

function makeTiles() {
  var t = [];
  for(var i = 0; i<24; i++){
    t.push(makeTile(i))
  }
  return shuffle(t);
}

function makeTile(index){
  function setName(i){
    return ""+i;
  }

  function setType(i){
    if(i<10){
      return "Normal"; //0, normal tile
    }
    else if(i<16){
      return "Starting"; //1, starting tile
    }
    else {
      return "Treasure"; //2, treasure tile
    }
  }



  return {
    index: index,
    name: setName(index),
    type: setType(index),
    floodLevel: 0, //0 is fine, 1 is swamped, 2 is flooded
    floodTile: function(){
      return this.floodLevel++;
    },
    drainTile: function() {
      return this.floodLevel--;
    },
    players: [],
    addPlayer: function (p){
      this.players.push(p);
      console.log("added player", p);
      return this.players;
    },
    removePlayer: function(p){ //takes a player
      console.log(this.players);
      this.players.forEach(function(e, i){ //goes thru the players array
        console.log("Player and index are");
        if(e.name==p.name){ //if player in the array's name == player passed in's name
          console.log("Player and index are", e, i);
          this.players.splice(i,1); //remove the index where the two names matched
          return false; //exit the loop
        }
      });
    }


  }
}

function getTileFromBoard(index){
  board.forEach(function(e, i){
    if(e.index==index){
      return i;
    }
  })
}

function movePlayer(player, dest){
  if(player.location != dest){ //if the place you're starting does not equal your destination
    if(player.location != -1 || player.location >=2 ){ //if the place you're going is not completely flooded or does not exist
    console.log(board[player.location]);
      player.updateLocation(dest);
      board[player.location].removePlayer(player); //gets rid of specific player
      board[dest].addPlayer(player); //does not work!!!
    }
  }
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
