//----------------------------------------------------------
//常時
$(function () {
  //初期設定
  styling();
  test_bgStyling();

  ApriIn();
  uiClick();
  dragdrop();
  timer();

});

//----------------------------------------------------------
//uiのボタンイベント
function uiClick() {
  //録音
  $('#in-room').on('click', function () {
//    AudioContextMake();
  });

  //ボタン
  $('#settingOpen').on('click', function () {
    $('.Setting-wrap').toggle();
  });

  //ユーザー一覧
  $('#removeUser').on('click', function () {
    if (manager) {
      $('.Manager-wrap').toggle();
      setScreenList();
    }
  });

  //ユーザーネーム表示
//  $(document).on('mouseenter', '.video_wrap', function () {
//    $(this).find('.icon-label').show();
//  });
//  $(document).on('mouseleave', '.video_wrap', function () {
//    $(this).find('.icon-label').hide();
//  });

  //自分のアイコン選択
  $('.select-icon').on('click', function () {
    myIcon = $(this).attr('data-icon');
    $('.select-icon').removeClass("set");
    $(this).addClass("set");
    $('#myVideoID').attr('data-icon', myIcon);
  });

  //ーーーーーーーーー
  $('[name=group-mode]').change(function () {
    if (manager) {
      group_mode = $('[name=group-mode]').val();
      group_style();

      managerSend();
    }
  });
  //ーーーーーーーーー
  $('[name=video-mode]').change(function () {
    if (manager) {
      video_mode = Number($('[name=video-mode]').val());
      video_style();
      managerSend();
    }
  });

  //ーーーーーーーーー
  //テストモード
  $('[name=test-mode]').change(function () {
    if (manager) {
      test_val = $('[name=test-mode]').val();
      test_time = getTime() + 2;
      test_style();
      managerSend();
    }
  });

  //キャリブレ
  $('[name=record]').on('click', function () {
    calibration();
  });

  //removeUser
  $('input[name=test-form]').on('keyup', function () {
    if (manager) {
      if (test_mode == "A") {} else {
        var removeID = $(this).val();
        setUserList(removeID, 0, 50, 50, 0, 0, 0, false);
        userSend2(removeID);
      }

    }
  });

  //移動でもんすと
  $('#TEST').on('click', function () {
    if (manager) {
      if (TEST == 0) {

      } else if (TEST == 1) {

//        for (let i = 0; i < 6; i++) {
//          setUserList('peerId' + i, 'USER' + i, Math.round(Math.random() * 600 + 100), Math.round(Math.random() * 400 + 200), Math.round(Math.random() * 360), 0, i + 1, true);
//        }

        for (let i = 0; i < 6; i++) {
          setUserList('peerId' + i, 'USER' + i, testStyle[i].x, testStyle[i].y, testStyle[i].v, 0, i + 1, true);
        }
        
      }
      onUserSet();
      icon_groupSelf();
      selfBg();
    }
  });

  const grantStr = 'gr';
  const grantStrM = 'grm';
  const cameramanStr = 'co';

  //コマンド
  $('input[name=grant-form]').on('keyup', function () {
    var grant = $(this).val();
    if (grant == grantStr) {
      manager = true;
      $('#grantSetting').fadeIn();
      $('#nowUserSetting').fadeOut();
      managerID = myID;
      manager_mute = false;


    } else if (grant == grantStrM) {
      manager = true;
      $('#grantSetting').fadeIn();
      $('#nowUserSetting').fadeOut();
      managerID = myID;
      manager_mute = true;


    } else if (grant == cameramanStr) {
      cameraman = true;

    } else {
      manager = false;
      $('#grantSetting').fadeOut();
      $('#nowUserSetting').fadeIn();
      managerID = '';
    }
  });

  //
  //  $('#introVolume').on('click', function () {
  //    introVolume = $(this).val() / 100;
  //        $('#m0').get(0).volume = introVolume;
  //        $('#m1').get(0).volume = introVolume;
  //        $('#m2').get(0).volume = introVolume;
  //        $('#m3').get(0).volume = introVolume;
  //        $('#m4').get(0).volume = introVolume;
  //  });

}
//----------------------------------------------------------
//manager
function setScreenList() {
  $('.screenUser').remove();

  $('.video_wrap').each(function (index, element) {

    //データID取得
    const userID = $(element).attr('data-user');
    const userName = uStyle[userID].Name;

    const screenUser = '<p class="screenUser" data-user="userID">' + userName + ' : ' + userID + '</p>';

    $('.Manager-wrap').append($(screenUser)).trigger("create");
  });


}

//----------------------------------------------------------
//send
function managerSend() {
  if (TEST == 0) {
    //グループ方法情報
    SendRoom();
  }
}

let road_record = [];
road_record[21] = [];
road_record[22] = [];
road_record[23] = [];
road_record[24] = [];
road_record[21][0] = 0;
road_record[22][0] = 0;
road_record[23][0] = 0;
road_record[24][0] = 0;

function userSend() {
  if (TEST == 0) {
    SendReplaced();
    if (test_val >= 21 && test_val <= 24) {
      const getTimeN = getTime();
      road_record[test_val][getTimeN] = [myX, myY, myV];
    } else {}
  }
}

function userSend2(ID) {
  if (TEST == 0) {
    SendReplaced2(ID);
  }
}

function userRecordSend() {
  if (TEST == 0) {
    for (var i = 21; i <= 24; i++) {
      //recording = false;
      voice_per[i] = Math.floor(10000 * voice_time[i] / recording_time[i]);
      voice_per[i] = voice_per[i] / 100;

      if (recording_time[i] > 1) {
        SendVoiceRecord(i);
      }
    }
  }
}
//----------------------------------------------------------
//ApriIn
function ApriIn() {
  if (TEST == 0) {
    videoSetting();

  } else if (TEST == 1) {

    myID = 'peerMy';
    myName = 'myself';
    $('.local_wrap').attr('data-user', myID);
    setUserList(myID, myName, 250, 250, 0, 0, myIcon, true);
    group_style();

    for (let i = 0; i < 6; i++) {
      addVideo('peerId' + i, 'id' + i);
    }
    for (let i = 0; i < 6; i++) {
      setUserList('peerId' + i, 'USER' + i, Math.round(Math.random() * 600 + 100), Math.round(Math.random() * 400 + 200), Math.round(Math.random() * 360), 0, i + 1, true);
    }
  }
}
//----------------------------------------------------------
//RoomIn
function RoomIn() {
  if (TEST == 0) {
    $('.Setting-wrap').fadeOut();

    $('.local_wrap').attr('data-user', myID);
    setUserList(myID, myName, 250, 250, 0, 0, myIcon, true);
    onUserSet();

    if (manager) {
      managerSend();
    }

    //入室する時情報をsend
    SendReplaced(myID, myName, 250, 250, 0, 0, myIcon, true);
    $('.local_wrap').attr('data-user', myID);
    //  styling();
    //移動させる。

  }
}
//----------------------------------------------------------
//RoomOut
function RoomOut() {
  if (TEST == 0) {
    SendReplaced(myID, myName, myX, myY, myV, 0, myIcon, false);
  }
}

//----------------------------------------------------------
//実験
//----------------------------------------------------------
//テスト表示方法

var testAudioInterval;
var testTaskInterval;

let test_val_record = 0;

function test_style() {
  if (test_val_record != test_val) {
    test_val_record = test_val;
    if (test_val >= 10 && test_val <= 19) {
      test_mode = "A"
    } else if (test_val >= 20 && test_val <= 29) {
      test_mode = "B"
    } else {
      test_mode = "O"
    }

    //testAudio_stop();
    testTask_stop();

    if (test_mode == "O") {} else if (test_mode == "A") {
      testAudio_style();
    } else if (test_mode == "B") {
      testTask_style();
    }
  }
}

function testAudio_stop() {
  $('#test1').hide();
  $('.timer').html('0:00');
  $('.test1-lead').hide();
  $('.test1-volume').hide();
  $('.answer-music').remove();
  $('.test1-answer').hide();
  //  $('#m0').get(0).pause();
  //  $('#m1').get(0).pause();
  //  $('#m2').get(0).pause();
  //  $('#m3').get(0).pause();
  //  $('#m4').get(0).pause();
  //  $('#m0').get(0).currentTime = 0;
  //  $('#m1').get(0).currentTime = 0;
  //  $('#m2').get(0).currentTime = 0;
  //  $('#m3').get(0).currentTime = 0;
  //  $('#m4').get(0).currentTime = 0;
  clearInterval(testAudioInterval);
}

function testAudio_play(timeTC) {
  if (timeTC == 1) {
    //    if (test_val == 10) {
    //      $('#m0').get(0).volume = introVolume;
    //      $('#m0').get(0).play();
    //    } else if (test_val == 11) {
    //      $('#m1').get(0).volume = introVolume;
    //      $('#m1').get(0).play();
    //    } else if (test_val == 12) {
    //      $('#m2').get(0).volume = introVolume;
    //      $('#m2').get(0).play();
    //    } else if (test_val == 13) {
    //      $('#m3').get(0).volume = introVolume;
    //      $('#m3').get(0).play();
    //    } else if (test_val == 14) {
    //      $('#m4').get(0).volume = introVolume;
    //      $('#m4').get(0).play();
    //    }
  }
  //  for (var i = 0; i < 6; i++) {
  //    if (timeTC == 15 + 30 * i) {
  //      const ansMusic = '<p class="answer-music">' + test_ans[test_val - 10][i] + '</p>'
  //      $('.test1-answer').append(ansMusic).trigger("create");
  //    }
  //  }

}

function testAudio_style() {
  //  if (test_val == 19) {
  //    $('.test1-lead').show();
  //  } else {
  //    $('.test1-volume').show();
  //    $('.test1-answer').show();
  //  }
  //
  //  testAudioInterval = setInterval(function () {
  //    if (test_val >= 10 && test_val <= 18) {
  //      let timeTC = current_time - test_time;
  //      let timeM = Math.floor(timeTC / 60);
  //      let timeS = timeTC % 60;
  //
  //      if (timeTC < 0) {
  //        let countdown = 0 - timeTC;
  //        $('.timer').html('まもなく開始します' + countdown);
  //      } else if (timeTC > 185) {
  //        $('.timer').html('終了しました。');
  //        $('.bell').get(0).play();
  //        testAudio_stop();
  //      } else if (timeTC >= 0) {
  //        if (timeS < 10) {
  //          $('.timer').html(timeM + ':0' + timeS);
  //        } else {
  //          $('.timer').html(timeM + ':' + timeS);
  //        }
  //        testAudio_play(timeTC);
  //      }
  //    }
  //  }, 1000);
}

function testTask_stop() {
  $('.timer').html('');
  $('.test2-lead').hide();
  $('.record').hide();
  clearInterval(testTaskInterval);
}

function testTask_play() {}

const task_stop_time = 360;
let timeTC = 0;

function testTask_style() {
  $('#test2').show();
  if (test_val == 29) {
    $('.test2-lead').show();
    userRecordSend();
  } else if (test_val == 20) {
    $('.record').show();
    //    $('#testStart').get(0).play();
  } else {

  }

  testTaskInterval = setInterval(function () {
    if (manager) {
      if (test_val >= 21 && test_val <= 24) {
        timeTC = current_time - test_time;
        let timeM = Math.floor(timeTC / 60);
        let timeS = timeTC % 60;

        if (timeTC < 0) {
          let countdown = 0 - timeTC;
          $('.timer').html('まもなく開始します' + countdown);
        } else if (timeTC >= task_stop_time) {
          $('.timer').html('終了しました。');
          if (timeTC == task_stop_time) {}
          $('.bell').get(0).play();
          testTask_stop();
        } else if (timeTC >= 0) {
          if (timeS < 10) {
            $('.timer').html(timeM + ':0' + timeS);
          } else {
            $('.timer').html(timeM + ':' + timeS);
          }
        }
      }
    }

  }, 1000);


}
//-------------------
//初期位置
function test_bgStyling() {
  //bg
  for (let i = 0; i < 10; i++) {

    let bgX = 600 + 200 * Math.sin(i * 2 * Math.PI / 10) - 50;
    let bgY = 350 + 200 * Math.cos(i * 2 * Math.PI / 10) - 50;

    const bgDiv = '<div class="initial-spot" style="top:' + bgY + 'px; left: ' + bgX + 'px">S</div>';

    $('#test1').append($(bgDiv)).trigger("create");
  }
  //$('#test1').hide();
  $('#test2').hide();
}

function timer() {
  setInterval(function () {
    current_time = getTime();
    let current_cord = returnTime(current_time);
    $('.currentTime').html(current_cord);
  }, 1000);
}

function getTime() {
  var dt = new Date();
  var time = dt.getHours() * 3600 + dt.getMinutes() * 60 + dt.getSeconds();
  return time;
}

function returnTime(val) {
  let valH = Math.floor(val / 3600);
  let valM = Math.floor((val % 3600) / 60);
  let valS = Math.floor(val % 60);
  let valT = valH + "時" + valM + "分" + valS + "秒";
  return valT;
}
