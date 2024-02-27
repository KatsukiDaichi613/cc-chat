//----------------------------------------------------------
//ドラッグドロップ

function dragdrop() {
  $("#myVideoID").draggable({
    containment: "#video-container",
    //snap:"#video-container",

    // ドラッグ開始時に呼ばれる
    start: function (event, ui) {

    },
    // ドラッグ中に呼ばれる
    drag: function (event, ui) {

      myX = ui.position.left + 50;
      myY = ui.position.top + 50;

      selfBg();

    },
    // ドラッグ終了時に呼ばれる
    stop: function (event, ui) {

      myX = ui.position.left + 50;
      myY = ui.position.top + 50;

      dropEnd();
    }
  });
  $('.drop_area').droppable({
    activate: function (e, ui) {
      //ドラッグが開始されました
    },
    over: function (e, ui) {
      //ドロップエリアに入りました
    },
    out: function (e, ui) {
      //ドロップエリアから外れました
    },
    drop: function (e, ui) {
      //ドロップされました
    }
  });

  $("html").on("click contextmenu", function (e) {
    if (e.which == 3) {
      //右クリック
      selfVector(e.pageX, e.pageY);
      selfBg();

      dropEnd();
      return false;
    }
  });
}

function dropEnd() {
  if (step == 3) {
    if (TEST == 0) {
      //確定
      userSend();
    } else if (TEST == 1) {

      uStyle[myID].x = myX;
      uStyle[myID].y = myY;

      icon_groupSelf();
    }
  }
}
