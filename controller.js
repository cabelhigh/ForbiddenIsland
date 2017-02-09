

function drawBoard() {
  board.forEach(function(e, i){
    if(e!==-1){
        $("td[data-index=" + i + "]").html("<p>"+e.name+"</p><p>"+e.type+'</p><div class="players"></div>');
          console.log(e.players.length>0);
        e.players.forEach(function(player){

            switch (player.role) {
              case 1:
                  $("td[data-index=" + i + "]").find(".players").append('<div class="exp"></div>')
                break;
              case 2:
                  $("td[data-index=" + i + "]").find(".players").append('<div class="eng"></div>')
                break;
              case 3:
                  $("td[data-index=" + i + "]").find(".players").append('<div class="mes"></div>')
                break;
              case 4:
                  $("td[data-index=" + i + "]").find(".players").append('<div class="pil"></div>')
                break;
              case 5:
                  $("td[data-index=" + i + "]").find(".players").append('<div class="div"></div>')
                break;
              case 6:
                  $("td[data-index=" + i + "]").find(".players").append('<div class="nav"></div>')
                break;

            }
        }) //<div class="mes"></div><div class="exp"></div>
      if(e.floodLevel==1){
        $("td[data-index=" + i + "]").attr("class", "flooding")
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
    if(!$(this).hasClass("blank")){
      g.floodTile($(this).attr("data-index"));
      drawBoard();
    }
  })

})
