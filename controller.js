

function drawBoard() {
  board.forEach(function(e, i){
    if(e!==-1){
      if(e.floodLevel==1){
        $("td[data-index=" + i + "]").html("<p>Flooding!!!</p>");
        $("td[data-index=" + i + "]").attr("class", "flooding")
      } else if(e.floodLevel==2){
        $("td[data-index=" + i + "]").html("");
        $("td[data-index=" + i + "]").attr("class", "blank")
      }
      //if(e.)
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
