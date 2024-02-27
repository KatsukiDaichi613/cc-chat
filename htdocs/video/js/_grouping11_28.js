var group_mode = "O";
var video_mode = "I";
var uStyle = [];



//----------------------------------------------------------
//常時
$(function () {

  if (TEST == 1) {

    for (let i = 0; i < 4; i++) {
      addVideo("peerId" + i, "id" + i);
    }

  }


  $('#TEST').on('click', function () {
    for (let i = 0; i < 4; i++) {
      setUserList("id" + i, "USER" + i, Math.round(Math.random() * 500 + 100), Math.round(Math.random() * 350 + 100), 0);
    }

    setUserList("myVideoID", "myself", 250, 250, 0);

    icon_group();

  });


  //初期設定
  styling();
  if (step == 3) {

    //ーーーーーーーーー
    $('[name=group-mode]').change(function () {
      // 選択されているvalue属性値を取り出す
      group_mode = $('[name=group-mode]').val();
      icon_group();
    });

    $('[name=video-mode]').change(function () {
      // 選択されているvalue属性値を取り出す
      video_mode = $('[name=video-mode]').val();
      video_style();
    });



    $('#settingOpen').on('click', function () {
      // 選択されているvalue属性値を取り出す
      $('.pure-u-1-3').toggle();

    });

    icon_group();

  }

  //----------------------------------------------------------
  //RoomIn
  function RoomIn() {
    //  styling();
    //移動させる。
  }
  //----------------------------------------------------------

  //----------------------------------------------------------
  //初期設定
  function styling() {

    //space-wrap
    for (let i = 0; i < 3; i++) {

      const spaceGroup = i + 1;

      const spaceDiv = '<div class="local-space drop_area" id="local-space' + spaceGroup + '" data-group="' + spaceGroup + '"><img src="img/bg_cafe.jpg"></div>';

      $('#space-wrap').append($(spaceDiv)).trigger("create");

    }

    $('.local-space').each(function (i, valueI) {
      $(this).css({
        'width': spaceStyle[i]['width'] + 'px',
        'height': spaceStyle[i]['height'] + 'px',
        'top': spaceStyle[i]['centerY'] - spaceStyle[i]['height'] / 2 + 'px',
        'left': spaceStyle[i]['centerX'] - spaceStyle[i]['width'] / 2 + 'px'
      });
    });

    //mark-wrap
    for (let i = 0; i < 3; i++) {

      const markGroup = i + 1;

      const markDivBG = '<div class="local-mark-bg" id="local-mark-bg' + markGroup + '" data-group="' + markGroup + '"></div>';

      $('#mark-wrap').append($(markDivBG)).trigger("create");

      const markDiv = '<div class="local-mark" id="local-mark' + markGroup + '" data-group="' + markGroup + '"><img src="img/landmark.png"></div>';

      $('#mark-wrap').append($(markDiv)).trigger("create");

    }

    $('.local-mark').each(function (i, valueI) {
      $(this).css({
        'width': markStyle[i]['width'] + 'px',
        'height': markStyle[i]['height'] + 'px',
        'top': markStyle[i]['centerY'] - markStyle[i]['height'] / 2 + 'px',
        'left': markStyle[i]['centerX'] - markStyle[i]['width'] / 2 + 'px'
      });
    });

    $('.local-mark-bg').each(function (i, valueI) {
      $(this).css({
        'width': markStyle[i]['width'] * 5/2 + 'px',
        'height': markStyle[i]['height'] * 5/2 + 'px',
        'top': markStyle[i]['centerY'] - markStyle[i]['height'] * 5/4 + 'px',
        'left': markStyle[i]['centerX'] - markStyle[i]['width'] * 5/4 + 'px'
      });
    });
    //
  }

  //----------------------------------------------------------
  //ビデオ追加
  function addVideo(peerId, id) {

    const videoDiv = '<div class="remote_wrap video_wrap video_' + peerId +
      '" id="' + id + '" data-group="0">' +
      '<video class="remote-video style-video" muted="true" autoplay playsinline>' +
      '</video><label></label></div>';

    $('#their-videos').append($(videoDiv)).trigger("create");
    //------
    const videoBack = '<div class="icon_group video_' + peerId +
      '" id="bg_' + id + '" data-group="0">' +
      '</div>';

    $('#videos-bg').append($(videoBack)).trigger("create");

    //-----
    const videoDivS = '<div class="side_video_wrap video_' + peerId +
      '" id="' + 'side_' + id + '" data-group="0">' +
      '<label>' + '</label>' +
      '<video class="side_style-video" muted="true" autoplay playsinline>' +
      '</video></div>';

    $('#group-videos').append($(videoDivS)).trigger("create");
  }
  //----------------------------------------------------------
  //他ユーザーの移動
  function setUserList(ID, Name, x, y, group) {
    uStyle[ID] = {
      Name,
      x,
      y,
      group
    };
    setUserHtml(ID);
    moveVideo(ID);
  }

  //DOM操作
  function setUserHtml(ID) {
    $('#' + ID).children('label').html(uStyle[ID].Name);
    $('#' + ID).attr('data-group', uStyle[ID].group);
    $('#bg_' + ID).attr('data-group', uStyle[ID].group);

    $('#side_' + ID).children('label').html(uStyle[ID].Name);


    volumeChange(); //仮
  }

  //アイコンアニメーション
  function moveVideo(ID) {
    $('#' + ID).animate({
      "top": uStyle[ID].y - 50 + "px",
      "left": uStyle[ID].x - 50 + "px"
    }, 300);
  }

  //----------------------------------------------------------
  //ビデオの表示方法
  function video_style() {
    if (video_mode == "I") {
      $('#video-container').attr('data-video', "I");
    } else if (video_mode == "S") {
      $('#video-container').attr('data-video', "S");
    }

  }

  //----------------------------------------------------------
  //音量調整
  function volumeChange() {
    if (group_mode == "O") { //減衰
      $('video').attr('muted', false);

      //      $('.style-video').children('video').attr('muted', false);
      //      $('.side_style-video').children('video').attr('muted', false);

    } else { //無音

      let users = Object.keys(uStyle).length; //人数
      let uKeys = []; //ID一覧
      for (let i = 0; i < users; i++) {
        uKeys.push(Object.keys(uStyle)[i]);
      }

      const myGroup = uStyle["myVideoID"].group;

      $.each(uKeys, function (i, vI) {
        const Ig = uStyle[vI].group;
        if (myGroup == Ig && myGroup != 0) {
          $('#' + vI).children('video').attr('muted', false);
          $('#side_' + vI).children('video').attr('muted', false);
          console.log("FALSE!!!!");
        } else {
          $('#' + vI).children('video').attr('muted', true);
          $('#side_' + vI).children('video').attr('muted', true);
        }
      });

    }
    $('#myVideoID').children('video').attr('muted', false);


    $('#side_myVideoID').children('video').attr('muted', false);

  }
  //----------------------------------------------------------
  //グルーピング
  function icon_group() {
    if (group_mode == "O") {
      $('div.group_modeA').hide();
      $('div.group_modeB').hide();
      $('div.group_modeC').hide();
      icon_groupO();
    } else if (group_mode == "A") {
      $('div.group_modeA').show();
      $('div.group_modeB').hide();
      $('div.group_modeC').hide();
      icon_groupA();
    } else if (group_mode == "B") {
      $('div.group_modeA').hide();
      $('div.group_modeB').show();
      $('div.group_modeC').hide();
      icon_groupB();
    } else if (group_mode == "C") {
      $('div.group_modeA').hide();
      $('div.group_modeB').hide();
      $('div.group_modeC').show();
      icon_groupC();
    } else {

    }
  }

  function icon_groupC() {
    //初期化

    $('.icon_group').remove();

    let users = Object.keys(uStyle).length; //人数
    let uKeys = []; //ID一覧
    for (let i = 0; i < users; i++) {
      uKeys.push(Object.keys(uStyle)[i]);
      uStyle[uKeys[i]].group = 0;
    }

    $.each(uKeys, function (i, vI) {
      let groupOK = false;
      const Ix = uStyle[vI].x;
      const Iy = uStyle[vI].y;
      $.each(markStyle, function (j, vJ) {
        const Jx = markStyle[j].centerX;
        const Jy = markStyle[j].centerY;

        //処設定
        const groupingLength = markStyle[j]['width'] * 3/2;

        let dbLength = Math.pow((Ix - Jx), 2) + Math.pow((Iy - Jy), 2);
        if (groupOK == true) {

        } else if (dbLength < Math.pow(groupingLength, 2)) {
          uStyle[vI].group = j + 1;
          groupOK = true;

        } else {
          uStyle[vI].group = 0;
        }


      });
    });

    $.each(uKeys, function (i, vI) {

      const videoBack = '<div class="icon_group " id="bg_' + vI + '" data-group="0"></div>';

      $('#videos-bg').append($(videoBack)).trigger("create");


      $('#bg_' + vI).css({
        "top": uStyle[vI].y - 100 + "px",
        "left": uStyle[vI].x - 100 + "px"
      });

      setUserHtml(vI);
    });

    return;

  }

  function icon_groupB() {
    //初期化

    $('.icon_group').remove();

    let users = Object.keys(uStyle).length; //人数
    let uKeys = []; //ID一覧
    for (let i = 0; i < users; i++) {
      uKeys.push(Object.keys(uStyle)[i]);
      uStyle[uKeys[i]].group = 0;
    }

    $.each(uKeys, function (i, vI) {
      let groupOK = false;
      const Ix = uStyle[vI].x;
      const Iy = uStyle[vI].y;

      $.each(spaceStyle, function (j, vJ) {
        const Jx = spaceStyle[j].centerX;
        const Jy = spaceStyle[j].centerY;
        const Jw = spaceStyle[j].width;
        const Jh = spaceStyle[j].height;

        let dbX = Math.abs(Jx - Ix) * 2 / Jw;
        let dbY = Math.abs(Jy - Iy) * 2 / Jh;
        if (groupOK == true) {

        } else if (dbX < 1 && dbY < 1) {
          uStyle[vI].group = j + 1;
          groupOK = true;

        } else {
          uStyle[vI].group = 0;
        }


      });
    });

    $.each(uKeys, function (i, vI) {

      const videoBack = '<div class="icon_group " id="bg_' + vI + '" data-group="0"></div>';

      $('#videos-bg').append($(videoBack)).trigger("create");


      $('#bg_' + vI).css({
        "top": uStyle[vI].y - 100 + "px",
        "left": uStyle[vI].x - 100 + "px"
      });

      setUserHtml(vI);
    });

    return;

  }

  function icon_groupA() {

    //console.log(Object.keys(uStyle));
    //console.log(Object.keys(uStyle).length);
    //console.log(Object.keys(uStyle)[0]);


    //処設定
    const groupingLength = 200;
    //初期化

    $('.icon_group').remove();

    let users = Object.keys(uStyle).length; //人数
    let uKeys = []; //ID一覧
    for (let i = 0; i < users; i++) {
      uKeys.push(Object.keys(uStyle)[i]);
      uStyle[uKeys[i]].group = i + 1;
    }

    $.each(uKeys, function (i, vI) {
      const Ix = uStyle[vI].x;
      const Iy = uStyle[vI].y;
      $.each(uKeys, function (j, vJ) {
        const Jx = uStyle[vJ].x;
        const Jy = uStyle[vJ].y;

        if (i != j) {
          let dbLength = Math.pow((Ix - Jx), 2) + Math.pow((Iy - Jy), 2);
          if (dbLength < Math.pow(groupingLength, 2)) {
            const icon_groupMin = Math.min(uStyle[vI].group, uStyle[vJ].group);
            const icon_groupMax = Math.max(uStyle[vI].group, uStyle[vJ].group);

            $.each(uKeys, function (k, vK) {
              if (uStyle[vK].group == icon_groupMax) {
                uStyle[vK].group = icon_groupMin;
              }
            });
          }
        }

      });
    });

    $.each(uKeys, function (i, vI) {

      const videoBack = '<div class="icon_group " id="bg_' + vI + '" data-group="0"></div>';

      $('#videos-bg').append($(videoBack)).trigger("create");


      $('#bg_' + vI).css({
        "top": uStyle[vI].y - 100 + "px",
        "left": uStyle[vI].x - 100 + "px"
      });

      setUserHtml(vI);
    });

    return;


  }


  function icon_groupO() {


    //処設定
    const groupingLength = 200;
    //初期化

    $('.icon_group').remove();

    let users = Object.keys(uStyle).length; //人数
    let uKeys = []; //ID一覧
    for (let i = 0; i < users; i++) {
      uKeys.push(Object.keys(uStyle)[i]);
      uStyle[uKeys[i]].group = 0;
    }

    $.each(uKeys, function (i, vI) {

      const videoBack = '<div class="icon_group " id="bg_' + vI + '" data-group="0"></div>';

      $('#videos-bg').append($(videoBack)).trigger("create");


      $('#bg_' + vI).css({
        "top": uStyle[vI].y - 100 + "px",
        "left": uStyle[vI].x - 100 + "px"
      });

      setUserHtml(vI);
    });

    return;


  }

  //----------------------------------------------------------
  //ドラッグドロップ

  if (step == 3) {
    $("#myVideoID").draggable({
      containment: "#video-container",
      //snap:"#video-container",

      // ドラッグ開始時に呼ばれる
      start: function (event, ui) {},
      // ドラッグ中に呼ばれる
      drag: function (event, ui) {

        uStyle["myVideoID"].x = ui.position.left + 50;
        uStyle["myVideoID"].y = ui.position.top + 50;
        //icon_group();
      },
      // ドラッグ終了時に呼ばれる
      stop: function (event, ui) {

        uStyle["myVideoID"].x = ui.position.left + 50;
        uStyle["myVideoID"].y = ui.position.top + 50;
        icon_group();

        dropEnd(ui.position.top, ui.position.left);
      }
    });
    $('.drop_area').droppable({
      activate: function (e, ui) {
        //ドラッグが開始されました
      },
      over: function (e, ui) {
        //ドロップエリアに入りました
        localSpaceIn($(this).attr('data-group'));
      },
      out: function (e, ui) {
        //ドロップエリアから外れました
        console.log("no");
        localSpaceOut(0);
      },
      drop: function (e, ui) {
        //ドロップされました
        dropEnd(ui.position.top, ui.position.left);
      }
    });

  }


  function dropEnd(upTop, upLeft) {
    //確定
    //SendReplacedA(myID,myName,upLeft,upTop);
  }

  function localSpaceIn(group) {
    $(".drag-and-drop").attr('data-group', group);
  }

  function localSpaceOut(group) {
    $(".drag-and-drop").attr('data-group', group);
  }

});
