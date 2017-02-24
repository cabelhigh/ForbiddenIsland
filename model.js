var tiles, board, treasureCards, floodCards, players;
var tDiscard = [], fDiscard=[], waterLevel = 0, floodDrawAmount;

function game() {
  tiles = makeTiles();
  treasureCards = makeCards();
  floodCards = makeFloodCards();
  board = makeBoard();
  players = makePlayers(3);
  addWaterRisesCards();
  setStartingPlayers();
  drawInitialFlood();
  checkWaterLevel();

  //Places the players on their 'starting' tiles
  function setStartingPlayers() {
    players.forEach(function(p){
      board.forEach(function(tile){
            if(tile.id==p.location){
              console.log("placing player ", p, tile);
              tile.addPlayer(p);
              //return false;
            }
      })
    })

  }

  //Increments the floodDrawAmount if the waterLevel has increased
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

  //Draws the initial flood cards, floods the tiles, and places them in the discard pile
  function drawInitialFlood(){
    for(var i = 0; i<6; i++){
      fDiscard.push(floodTile(floodCards.pop()))
    }
  }

  //'Floods' tiles by either incrementing their floodLevel if it's <2 or by replacing the tile with a -1 if it's > 2
  function floodTile(index){
    if(board[index]==-1){ //If the indicated index is already -1, i.e flooded
      alert("That tile is already completely flooded!")
    }
    else{
      board[index].floodTile()  //Calls floodTile() on the Tile, which I just realized is confusing
      if(board[index].floodLevel>2){ //If, after flooding the tile, the floodLevel is > 2
      //  alert(board[index].name +" That tile has completely flooded!")
        board[index]=-1; //Replace the tile with a -1
      }
      else{
  //      alert(board[index].name + " has been flooded!") //Note that the tile has been partially// flooded
      }
    }
    return index;
  }

  function addWaterRisesCards(){
    for(var i = 25; i<28; i++){ //Don't put Water rises until AFTER the players have been dealt their initial hand
        treasureCards.push(makeCard(i));
    }
    treasureCards=shuffle(treasureCards)
  }

  return {
    getBoard: board,
    getCards: treasureCards,
    getFloodCards: floodCards,
    drawFlood: function() {
      for(var i = 0; i<floodDrawAmount; i++){
        fDiscard.push(floodTile(floodCards.pop()))
      }
    },
    shuffleInFlood: function(){
      shuffle(fDiscard).forEach(function(e){
        floodCards.push(e);
      })
      fDiscard = [];
    },
    incWaterLevel: function() {
      waterLevel++;
      checkWaterLevel();
      return waterLevel;
    },
    getFloodDrawAmount: function() {
      return floodDrawAmount;
    },

    floodTile: function(i) {
      floodTile(i);
    }

  }


}

//Returns a 'b' array with -1s (empty tiles) and shuffled tiles from the 'tiles' array
function makeBoard(){
  var b = [];
  for(var i = 0; i<36; i++){
    if(i == 0 || i == 1 || i == 4 || i == 5 ||
       i == 6 || i == 11 || i == 24 || i == 29 ||
       i == 30 || i == 31 || i == 34 || i == 35) {
         b.push(-1); //Puts -1s only on the edges of the board, as per the FI rules
       }
       else{
         b.push(tiles.shift()); //puts the top tile in the 'tiles' array into the 'b' array
       }
  }
  return b;

}

//Makes a specified number of players for the game
function makePlayers(p){
  var a = []; //Array of players, to be returned into the 'players' array
  var roles = shuffle([1,2,3,4,5,6]); //the six different roles, randomly assigned to the different players
  for(var i = 0; i < p; i++){ //for each player in the num of players specified
    a.push(makePlayer(roles.pop())); //make a player with the last num in the shuffled 'roles' array and push it to the 'a' array
  }
  return a;
}

//'player' constructor, takes in a role
function makePlayer(r){

  //Sets a name based on the numberic role, as per the FI rules
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
        return "Navigatress";
    }
  }

  //Sets a starting location (is tile id, not array index)
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
    start: setStart(r), //refers to the tile id
    location: setStart(r), //refers to the tile id
    hand: [treasureCards.pop(), treasureCards.pop()],
    drawCards: function(){
      var draw1 = treasureCards.pop(), draw2 = treasureCards.pop();
      if(draw1.title=="Water Rises!"&&draw2.title=="Water Rises!") {
        return -2;
      }
      else if(draw1.title=="Water Rises!"){
        this.hand.push(draw2);
        return -1;
      }
      else if(draw2.title=="Water Rises!"){
        this.hand.push(draw1);
        return -1;
      }
      else{
        this.hand.push(draw1, draw2);
        return this.hand;

      }
    },
    updateLocation: function(l){
      this.location = l;
      return this.location;
    }
  }
}

//Returns a shuffled deck of treasure cards, as per the FI rules
function makeCards() {
  var c = [];
  for(var i = 0; i<25; i++){ //Don't put Water rises until AFTER the players have been dealt their initial hand
      c.push(makeCard(i));
  }
  return shuffle(c);

}

//'card' constructor, takes in the type of card
function makeCard(type){

  //returns the name of the card and some HTML if the card is to be styled
  function setTitle(t){
    switch (true) {
      case t < 5:
          return '<span class="fCard">The Crystal of Fire</span>';
      case t < 10:
          return '<span class="oCard">The Ocean\'s Chalice</span>';
      case t < 15:
          return '<span class="wCard">The Statue of the Wind</span>';
      case t < 20:
          return '<span class="eCard">The Earth Stone</span>';
      case t < 22:
          return "Sandbags";
      case t < 25:
          return "Helicopter Lift";
      case t < 28:
          return "Water Rises!"

    }
  }

  return {
    type: type,
    title: setTitle(type)
  }
}

//Returns a shuffled array of numbers that correspond to indexes in our 'board' array
function makeFloodCards() {
  var f = [];
  for(var i = 2; i < 34; i++){ //refers to board indexes
    if(i == 4 || i == 5 ||
       i == 6 || i == 11 || i == 24 || i == 29 ||
       i == 30 || i == 31){}
    else{
      f.push(i);
    }
  }
  return shuffle(f);
}

//Returns a shuffled list of board tiles
function makeTiles() {
  var t = [];
  for(var i = 0; i<24; i++){
    t.push(makeTile(i))
  }
  return shuffle(t);
}

//'tile' constructor, takes in an id which determines both its identifier and the type of tile it is
function makeTile(id){

  //The 'name' is just a stringified 'id', unsure why it exists
  function setName(i){
    return ""+i;
  }

  //Sets the different types based on the 'id'
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

  //Sets the different CSS classes based on the 'id'
  function setClass(i){

    switch (i) {
      case 16:
      case 17:
        return "earth";
      case 18:
      case 19:
        return "wind";
      case 20:
      case 21:
        return "fire";
      case 22:
      case 23:
        return "ocean";
      default:
        return "";

    }
  }



  return {
    id: id,
    name: setName(id),
    type: setType(id),
    tClass: setClass(id),
    floodLevel: 0, //0 is fine, 1 is swamped, 2 is flooded
    floodTile: function(){
      return this.floodLevel++;
    },
    drainTile: function() {
      return this.floodLevel--;
    },
    playersOnTile: [],
    addPlayer: function (p){
      this.playersOnTile.push(p);
      console.log("added player", p, this.playersOnTile);
      return this.playersOnTile;
    },
    removePlayer: function(p){ //takes a player
      var potLength = this.playersOnTile.length; //'this' JUST MEANS the current closure, not the object itsel
      var potRet = this.playersOnTile;
      console.log("WHY",potLength);
      for(var inc = 0; inc < potLength; inc++){ //for the num of players on the tile
        if(potRet[inc].name==p.name){ //if the current element's name is the name of the player passed in
          if(potLength<=1){ //if the tile only has one player on it

            console.log("setting players to empty");
            potRet = []; //just reset the array
        }
        else { //if not, splice the player out
            console.log("Splicing...", potRet.splice(inc,1)); //remove the index where the two names matched
            console.log("Players now ", potRet );
        }
        break;
      }
    }
    this.playersOnTile=potRet;

    }


  }
}

//Takes a player, removes them from their location, and adds them to a new one
function movePlayer(player, dest){ //dest is data-index/array index value but needs to be converted to tile index
  if(player.location != dest){ //if the place you're starting does not equal your destination
    if(player.location != -1 || player.location >=2 ){ //if the place you're going is not completely flooded or does not exist
      var oldLoc = player.location;
      console.log("HERE",board[getTileFromBoard(oldLoc)]);
      board[getTileFromBoard(oldLoc)].removePlayer(player); //gets rid of specific player
      player.updateLocation(board[dest].id);
      board[dest].addPlayer(player);
      console.log(board[getTileFromBoard(oldLoc)], board[dest]);
    }
  }
}

//Takes in a tile id, returns the corresponding array index
function getTileFromBoard(id){
  var ind = -1;
  board.forEach(function(e, i){ //forEach's cannot be returned or broken out of
    if(e.id==id){
      ind = i;
    }
  });

  return ind;
}

//Takes in an array index, gets back the corresponding tile
function getTileFromIndex(index){ //index refers to array index
  return board[index];
}

//A simple shuffle function
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
