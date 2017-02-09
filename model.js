var tiles, board, treasureCards, floodCards, players;

function game() {
  tiles = makeTiles();
  treasureCards = makeCards();
  floodCards = makeFloodCards();
  board = makeBoard();
  players = makePlayers(2);
  var tDiscard = [], fDiscard=[], waterLevel = 0, floodDrawAmount;
  drawInitialFlood();
  checkWaterLevel();

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
  alert(p);
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
    location: -1,
    hand: [treasureCards.pop(), treasureCards.pop()]
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
      return 0; //normal tile
    }
    else if(i<16){
      return 1; //starting tile
    }
    else {
      return 2; //treasure tile
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
    removePlayer: function(p){
      var index = -1;
      players.forEach(function(e, i){
        if(e.name==p.name){
          index = i;
        }
      })

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
  if(player.location != dest){
    if(player.location != -1){
    //  board[player.location]. //gets rid of specific player
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
