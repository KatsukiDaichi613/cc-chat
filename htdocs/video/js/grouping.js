//----------------------------------------------------------

//----------------------------------------------------------
//初期設定
function styling() {
  $('.Manager-wrap').hide();

  //mark-wrap
  for (let i = 0; i < markStyle.length; i++) {

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
      'width': markStyle[i]['width'] * 5 / 2 + 'px',
      'height': markStyle[i]['height'] * 5 / 2 + 'px',
      'top': markStyle[i]['centerY'] - markStyle[i]['height'] * 5 / 4 + 'px',
      'left': markStyle[i]['centerX'] - markStyle[i]['width'] * 5 / 4 + 'px'
    });
  });
  //icons

  for (let i = 1; i < 17; i++) {
    const markDiv = '<div class="select-icon" data-icon="' + i + '"></div>';

    $('#icons').append($(markDiv)).trigger("create");
  }
}

//----------------------------------------------------------
//ビデオ追加
function addVideo(peerId, id) {

  const videoDiv = '<div class="remote_wrap video_wrap ' + peerId +
    '" id="' + id + '" data-group="0"  data-task="A" data-user="' + peerId + '" data-icon="0">' +
    '<div class="style-eye"></div>' +
    '<div class="video-clip"><video class="remote-video style-video" autoplay playsinline>' +
    '</video><label class="icon-label">name</label><label class="side-label">name</label></div></div>';

  $('#their-videos').append($(videoDiv)).trigger("create");

  $('.video_wrap[data-user="' + peerId + '"]').animate({
    "top": 250 - iconLength / 2 + "px",
    "left": 250 - iconLength / 2 + "px"
  }, 300);
}

//----------------------------------------------------------
//他ユーザーの移動

////////
function setUserList(pID, Name, x, y, v, group, icon, online) {
  if (pID == myID) {
    if (uStyle[pID]) {
      uStyle[pID].Name = myName;
      uStyle[pID].x = myX;
      uStyle[pID].y = myY;
      uStyle[pID].v = myV;
      uStyle[pID].group = myGroup;
      uStyle[pID].icon = myIcon;
      uStyle[pID].online = online;
    } else {
      uStyle[pID] = {
        Name,
        x,
        y,
        v,
        icon,
        online
      };
    }
  } else {

    if (uStyle[pID]) {
      uStyle[pID].Name = Name;
      uStyle[pID].x = x;
      uStyle[pID].y = y;
      uStyle[pID].v = v;
      uStyle[pID].group = group;
      uStyle[pID].icon = icon;
      uStyle[pID].online = online;
    } else {
      uStyle[pID] = {
        Name,
        x,
        y,
        v,
        group,
        icon,
        online
      };
    }
  }
  DOMs(pID);
}

//
let sidevideos = 0;

function DOMs(pID) {
  if (uStyle[pID].online) {
    setUserHtml(pID);
    moveVideo(pID);
    //sideVideoSet(pID);
  } else {
    //退出したら消去
    $('.video_wrap[data-user="' + pID + '"]').remove();
  }
}

function DOMs2(pID) {
  setUserGroup(pID);
  volumeChange(pID);
}


//DOM操作
function setUserHtml(ID) {

  $('.video_wrap[data-user="' + ID + '"]').find('label').html(uStyle[ID].Name);

  if (ID != myID) {

    $('.video_wrap[data-user="' + ID + '"]').attr('data-icon', uStyle[ID].icon);
  }

}

//アイコンアニメーション
function moveVideo(ID) {
  if (ID != myID) {
    $('.video_wrap[data-user="' + ID + '"]').animate({
      "top": uStyle[ID].y - iconLength / 2 + "px",
      "left": uStyle[ID].x - iconLength / 2 + "px"
    }, 300);
  }
}

function setUserGroup(ID) {
  $('.video_wrap[data-user="' + ID + '"]').attr('data-group', uStyle[ID].group);
  if (ID != myID) {
    if (group_mode == "D") {
      if (manager) {
      $('.self-rangeD[data-user="' + ID + '"]').remove();

      const userShadowD = '<div class="self-rangeD their-rangeD" data-user="' + ID + '"></div>';
      $('#ShadowD').prepend($(userShadowD)).trigger("create");
      $('.self-rangeD[data-user="' + ID + '"]').css({
        "top": uStyle[ID].y + "px",
        "left": uStyle[ID].x + "px"
      });
    }
  } else if (group_mode == "B") {

    let userVstyle = uStyle[ID].v - 45;
    let userVradians = uStyle[ID].v * Math.PI / 180;
    $('.remote_wrap[data-user="' + ID + '"]').find('.style-eye').css({
      "transform": "rotate(" + userVstyle + "deg)"
    });

    $('.self-rangeB[data-user="' + ID + '"]').remove();

    const userShadowB = '<div class="self-rangeB their-rangeB" data-user="' + ID + '"></div>';
    $('#ShadowB').prepend($(userShadowB)).trigger("create");
    $('.self-rangeB[data-user="' + ID + '"]').css({
      "top": uStyle[ID].y + "px",
      "left": uStyle[ID].x + "px",
      "transform": "rotate(" + uStyle[ID].v + "deg)"
    });

  }
}
}

//サイドビデオ位置
function sideVideoSet(ID) {
  if (video_mode == "S") {
    const myGroup = uStyle[myID].group;

    const Ig = uStyle[ID].group;

    if (myGroup == Ig && myGroup != 0) {

      $('.video_wrap[data-user="' + ID + '"]').find('video').css({
        "top": 60 + "px",
        "left": 150 * sidevideos - 30 + "px"
      });

      $('.video_wrap[data-user="' + ID + '"]').find('label.side-label').css({
        "top": 170 + "px",
        "left": 150 * sidevideos + 20 + "px",
        "display": "block"
      });

      sidevideos = sidevideos + 1;
    } else {

      $('.video_wrap[data-user="' + ID + '"]').find('label.side-label').css({
        "display": "none"
      });
    }

  }

}

//----------------------------------------------------------
//自分の影関連
function selfBg() {
  if (group_mode == "A") {
    //    $('#bg_myVideoID').css({
    //      "top": myY - 100 + "px",
    //      "left": myX - 100 + "px"
    //    });

  } else if (group_mode == "D") {
    $('#my-rangeD').css({
      "top": myY + "px",
      "left": myX + "px"
    });

    $('#my-rangeD3').css({
      "top": myY - voiceLength + "px",
      "left": myX - voiceLength + "px",
    });
  } else if (group_mode == "B") {

    let myVstyle = myV - 45;
    let myVradians = myV * Math.PI / 180;

    $('#my-rangeB').css({
      "top": myY + "px",
      "left": myX + "px",
      "transform": "rotate(" + myV + "deg)"
    });

    $('#my-rangeB3').css({
      "top": myY - voiceLength + "px",
      "left": myX - voiceLength + "px",
    });

    $('#my-eye').css({
      "transform": "rotate(" + myVstyle + "deg)"
    });

  }
}
//自分の向き
function selfVector(vx, vy) {
  if (group_mode == "B") {
    let radianMyV = Math.atan2(vy - myY, vx - myX);
    myV = 180 * radianMyV / Math.PI;

    while (myV < 0) {
      myV += 360;
    }
    while (myV > 360) {
      myV -= 360;
    }
  }
}
//----------------------------------------------------------
//音量調整
function volumeChange(ID) {


  if (ID != myID) {
    const myGroup = uStyle[myID].group;
    const Ig = uStyle[ID].group;

    const muteVideo = $('.video_wrap[data-user="' + ID + '"]').find('video');

    let userVolume = 0;

    if (myGroup == Ig && myGroup != 0) {
      userVolume = 0.5;
      muteVideo.removeClass("mute");
    } else {
      userVolume = 0.0;
      muteVideo.addClass("mute");
    }

    if (group_mode == "D" || group_mode == "B") {
      //減衰
      const Ix = uStyle[ID].x;
      const Iy = uStyle[ID].y;
      const Jx = myX;
      const Jy = myY;

      let dbLength = Math.sqrt(Math.pow((Ix - Jx), 2) + Math.pow((Iy - Jy), 2)); //max250
      let zeroLength = 100; // 500px=10m 100px=0m d+
      let deltaDB = 60 - 20 * Math.log10((dbLength) / 50);
      if (myGroup == Ig && myGroup != 0) {
        userVolume = 0.5 * deltaDB / 60;
        //        userVolume = 0.5;
      } else if (dbLength < 300) {
        userVolume = 0.0;
      } else {
        userVolume = 0.01 * deltaDB / 60;
      }
    }
    //    console.log(userVolume + '=>' + uStyle[ID].Name);

    if (manager_mute) {

    } else {
      if (ID == managerID) {
        userVolume = 0.5; //全てのユーザーに届ける
      }
      if (manager) {
        userVolume = 0.5; //全てのユーザーの声が聞こえる
      }
      if (cameraman) {
        userVolume = 0.5; //全てのユーザーの声が聞こえる
      }
    }

    if (TEST == 0) {
      const muteVideoVolume = muteVideo.get(0);
      muteVideoVolume.volume = userVolume;
    }

  }
}
//----------------------------------------------------------
//----------------------------------------------------------
//----------------------------------------------------------
//onユーザー

function onUserSet() {
  //リセット
  onUser.length = 0;
  onUserID.length = 0;

  $(".video_wrap").each(function (index, element) {

    //データID取得
    var userID = $(element).attr('data-user');

    //onユーザー更新
    onUser.push(uStyle[userID]);
    onUserID.push(userID);

    //ユーザー番号
    //uStyle[userID]["index"] = index;
  });
}



//----------------------------------------------------------
//ビデオの表示方法
function video_style() {
  let now_video_style = "映像タイプ:";
  if (video_mode == "I") {
    $('#video-container').attr('data-video', "I");
    now_video_style = "映像タイプ:アイコン式";
  } else if (video_mode == "S") {
    $('#video-container').attr('data-video', "S");
    now_video_style = "映像タイプ:サイド式";
  }
  $('.now-video-mode').html(now_video_style);
}
//----------------------------------------------------------
//グルーピング
let group_mode_record = "Z";

function group_style() {
  if (group_mode != group_mode_record) {
    let now_group_style = "グループタイプ:";
    if (group_mode == "O") {
      $('#video-container').attr('data-group', "O");
      now_group_style = "グループタイプ:無し";
    } else if (group_mode == "A") {
      $('#video-container').attr('data-group', "A");
      now_group_style = "グループタイプ:全員通話式";
    } else if (group_mode == "B") {
      $('#video-container').attr('data-group', "B");
      now_group_style = "グループタイプ:方向式";
    } else if (group_mode == "C") {
      $('#video-container').attr('data-group', "C");
      now_group_style = "グループタイプ:シンボル式";
    } else if (group_mode == "D") {
      $('#video-container').attr('data-group', "D");
      now_group_style = "グループタイプ:距離式";
    }
    $('.now-group-mode').html(now_group_style);
    selfBg();
    group_mode_record = group_mode;
  }
}

function icon_groupSelf() {
  icon_groupBSelf()
  icon_groupCSelf();
  icon_groupDSelf();
  icon_groupOASelf();
}

//////////////////////////////////////////////



function icon_groupDSelf() {
  sidevideos = 0;

  if (group_mode == "D") {

    $.each(onUserID, function (i, vI) {
      uStyle[vI].group = 0;
    });


    //処設定
    const groupingLength = D_shadowLength / 2;

    $.each(onUserID, function (i, vI) {
      const Ix = uStyle[vI].x;
      const Iy = uStyle[vI].y;
      const Jx = uStyle[myID].x;
      const Jy = uStyle[myID].y;


      let dbLength = Math.pow((Ix - Jx), 2) + Math.pow((Iy - Jy), 2);
      if (dbLength < Math.pow(groupingLength, 2)) {
        uStyle[vI].group = 1;
      }

    });

    uStyle[myID].group = 1;

    $.each(onUserID, function (i, vI) {
      DOMs2(vI);
    });
  }
}
//////////////////////////////////////////////
function icon_groupCSelf() {
  if (group_mode == "C") {

    $.each(onUserID, function (i, vI) {
      uStyle[vI].group = 0;
    });

    $.each(onUserID, function (i, vI) {
      let groupOK = false;
      const Ix = uStyle[vI].x;
      const Iy = uStyle[vI].y;
      $.each(markStyle, function (j, vJ) {
        const Jx = markStyle[j].centerX;
        const Jy = markStyle[j].centerY;

        //処設定
        const groupingLength = markStyle[j]['width'] * 3 / 2;

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

    $.each(onUserID, function (i, vI) {
      DOMs2(vI);
    });

  }
}
//////////////////////////////////////////////
function icon_groupBSelf() {

  sidevideos = 0;

  if (group_mode == "B") {

    $.each(onUserID, function (i, vI) {
      uStyle[vI].group = 0;
    });


    //自分の範囲内のユーザーのグループ
    const groupingLength = B_shadowLength / 2;
    const groupingDegree = 45;

    const focusPos = 320;
    const FtoFLength = 400;

    $.each(onUserID, function (i, vI) {
      const Ix = uStyle[vI].x;
      const Iy = uStyle[vI].y;
      const Iv = uStyle[vI].v;

      const IvR = Iv * Math.PI / 180;
      const IxF = Ix + focusPos * Math.cos(IvR);
      const IyF = Iy + focusPos * Math.sin(IvR);

      //Math.cos(myV * Math.PI / 180)
      const Jx = myX;
      const Jy = myY;
      const Jv = myV;

      const JvR = Jv * Math.PI / 180;
      const JxF = Jx + focusPos * Math.cos(JvR);
      const JyF = Jy + focusPos * Math.sin(JvR);


      let MtoP_Length = Math.sqrt(Math.pow((Ix - Jx), 2) + Math.pow((Iy - Jy), 2));
      let FtoP_Length = Math.sqrt(Math.pow((IxF - Jx), 2) + Math.pow((IyF - Jy), 2));

      if (MtoP_Length + FtoP_Length < FtoFLength) {
        uStyle[vI].group = 1;
      }


      let MtoP_Length2 = Math.sqrt(Math.pow((Ix - Jx), 2) + Math.pow((Iy - Jy), 2));
      let FtoP_Length2 = Math.sqrt(Math.pow((JxF - Ix), 2) + Math.pow((JyF - Iy), 2));

      if (MtoP_Length2 + FtoP_Length2 < FtoFLength) {
        uStyle[vI].group = 1;
      }

    });

    uStyle[myID].group = 1;

    $.each(onUserID, function (i, vI) {
      DOMs2(vI);
    });
  }
}

function icon_groupOASelf() {
  if (group_mode == "O" || group_mode == "A") {
    $.each(onUserID, function (i, vI) {
      uStyle[vI].group = 1;
    });

    uStyle[myID].group = 1;

    $.each(onUserID, function (i, vI) {
      DOMs2(vI);
    });

  }
}
