var playerInc = 0;

function drawBoard() {
  board.forEach(function(e, i){
    if(e!==-1){
        $("td[data-index=" + i + "]").html("<p>"+e.name+"</p><p>"+e.type+'</p><div class="players"></div>').addClass(e.tClass);
        e.playersOnTile.forEach(function(p){
          console.log(e);

            switch (p.role) {
              case 1:
                  $("td[data-index=" + i + "]").find(".players").prepend('<div class="exp"></div>')
                break;
              case 2:
                  $("td[data-index=" + i + "]").find(".players").prepend('<div class="eng"></div>')
                break;
              case 3:
                  $("td[data-index=" + i + "]").find(".players").prepend('<div class="mes"></div>')
                break;
              case 4:
                  $("td[data-index=" + i + "]").find(".players").prepend('<div class="pil"></div>')
                break;
              case 5:
                  $("td[data-index=" + i + "]").find(".players").prepend('<div class="div"></div>')
                break;
              case 6:
                  $("td[data-index=" + i + "]").find(".players").prepend('<div class="nav"></div>')
                break;

            }
        }) //<div class="mes"></div><div class="exp"></div>
      if(e.floodLevel==1){
        $("td[data-index=" + i + "]").addClass("flooding")
      } else if(e.floodLevel==2){
        $("td[data-index=" + i + "]").html("");
        $("td[data-index=" + i + "]").attr("class", "blank")
      }
    }
  })
}

$(document).ready(function() {
  var g=game();
  drawBoard();

  $("td").on("click", function () {
    // if(!$(this).hasClass("blank")){
    //   g.floodTile($(this).attr("data-index"));
    //   drawBoard();
    // }
    console.log("PlayerInc at ", playerInc);
    if(adjCheck(getTileFromBoard(players[playerInc].location), $(this).data("index"))){

      movePlayer(players[playerInc], $(this).data("index"))
      drawBoard();
      if(playerInc==players.length-1){
        playerInc=0;
      }
      else{
        playerInc++;
      }

    }
  })

})

function adjCheck(playerLoc, clickLoc) { //checks if click was on valid adjacent tile
  //console.log(playerLoc, clickLoc);
  if((board[clickLoc+1]==board[playerLoc]||board[clickLoc-1]==board[playerLoc]
    || board[clickLoc+6]==board[playerLoc] || board[clickLoc-6]==board[playerLoc])&&board[clickLoc]!=-1&&board[clickLoc]!=board[playerLoc]){
      return true;
    }
    else {
      return false;
    }
}
