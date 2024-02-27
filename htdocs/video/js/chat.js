// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAOxPelYYEnsuZigrCAP93KqyqoLwAhbJw",
  authDomain: "chatapp-1e1bc.firebaseapp.com",
  databaseURL: "https://chatapp-1e1bc.firebaseio.com",
  projectId: "chatapp-1e1bc",
  storageBucket: "chatapp-1e1bc.appspot.com",
  messagingSenderId: "874357376353",
  appId: "1:874357376353:web:3897d7b3977203074c7120",
  measurementId: "G-74XVKMYNYQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//----------------------------------------
//Msg送信準備
var Fpost = firebase.database();

//----------------------------------------
//送信して更新

function SendVoiceRecord(test_val) {
  Fpost.ref('_rec/' + roomId + '/' + test_val + '/' + myID).set({
    userID: myID,
    userName: myName,
    voiceTime: voice_per[test_val],
    roadRecord: road_record[test_val]
  });
}

//function SendRoadRecord(test_val) {
//  Fpost.ref('_rec/' + roomId + '/' + test_val + '/' + myID + '/road/' + road_counter).set({
//    userName: myName,
//    time: timeTC,
//    x: myX,
//    y: myY,
//    v: myV
//  });
//}

function SendRoom() {
  Fpost.ref('_set/' + roomId + '/Room').set({
    videoMode: video_mode,
    groupMode: group_mode,
    managerID: myID,
    managerMute: manager_mute,
    testVal: test_val,
    testTime: test_time
  });
}

function SendReplaced() {
  Fpost.ref('_men/' + roomId + '/' + myID).set({
    userID: myID,
    userName: myName,
    x: myX,
    y: myY,
    v: myV,
    group: 0,
    icon: myIcon,
    online: true
  });
}

function SendReplaced2(userID) {
  Fpost.ref('_men/' + roomId + '/' + userID).set({
    userID: userID,
    userName: 0,
    x: 0,
    y: 0,
    v: 0,
    group: 0,
    icon: 0,
    online: false
  });
}

//----------------------------------------
//Msg受信処理
var FpRefRec = Fpost.ref('_rec/' + roomId + '/' + test_val + '/');
var FpRefSet = Fpost.ref('_set/' + roomId + '/');
var FpRefMen = Fpost.ref('_men/' + roomId + '/');



FpRefRec.on('child_changed', function (data) {

  if (manager) {
    getInfo();
  }

  function getInfo() {
    $('.video_wrap').each(function (i, valueI) {
      const userKey = $(this).attr('data-user');
      const w = data.child(userKey).val();
      console.log(test_val +'=='+ w.userName +'=='+ w.voiceTime);
    });
  }

});


FpRefSet.on('child_changed', function (data) {

  if (manager) {

  } else {
    getInfo();
  }

  function getInfo() {
    const w = data.child("Room").val();
    video_mode = w.videoMode;
    group_mode = w.groupMode;
    test_val = w.testVal;
    test_time = w.testTime;
    managerID = w.managerID;
    manager_mute = w.managerMute;

    video_style();
    group_style();
    test_style();

    icon_groupSelf();
    selfBg(); //移動しないため
  }
});

FpRefMen.on('child_changed', function (data) {
  //  const v = data.val();
  //  const w = data.child(myID).val();


  getInfo();


  function getInfo() {
    $('.video_wrap').each(function (i, valueI) {
      const userKey = $(this).attr('data-user');
      const w = data.child(userKey).val();
      setUserList(w.userID, w.userName, w.x, w.y, w.v, w.group, w.icon, w.online);

    });
    onUserSet();
    icon_groupSelf();
  }

});
//FpRef.on('child_removed', function (data) {});
//
//FpRef.on('child_added', function (data) {});
