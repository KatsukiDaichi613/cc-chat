/* eslint-disable require-jsdoc */

function videoSetting() {

  // Peer object----------------------------------------------------
  const peer = new Peer({
    key: window.__SKYWAY_KEY__,
    debug: 3,
  });

  let localStream;
  let room;

  //----------------------
  //peer*/*/*/*/*/*/*/*/*/*
  //----------------------

  peer.on('open', () => {

    myID = peer.id; //自分のvideoIDをchatIDトシテモ使う
    $('#my-id').text(peer.id);
    // Get things started----------------------------------------------------
    step1();
  });

  peer.on('error', err => {
    alert(err.message);
    // Return to step 2 if error occurs----------------------------------------------------
    step2();
  });

  //----------------------
  //call*/*/*/*/*/*/*/*/*/*
  //----------------------
  $('#make-call').on('submit', e => {
    e.preventDefault();
    // Initiate a call!----------------------------------------------------
    const roomName = $('#join-room').val();
    const userName = $('#user-name').val();
    if (!roomName || !userName) {
      return;
    }
    myName = userName;
    room = peer.joinRoom('mesh_video_' + roomName, {
      stream: localStream
    });

    $('#room-id').text(roomName);
    roomId = roomName; //ルームのIDをchatルームIDトシテモ使う
    step3(room);
    
    RoomIn(); //入室時に実行する
    
  });


  //----------------------
  //end-call*/*/*/*/*/*/*/*/*/*
  //----------------------

  $('#end-call').on('click', () => {
    room.close();
    
    RoomOut();//退室時に実行する
    step2();
  });

  //----------------------
  // Retry if getUserMedia fails*/*/*/*/*/*/*/*/*/*
  //----------------------
  $('#step1-retry').on('click', () => {
    $('#step1-error').hide();
    step1();
  });

  //----------------------
  // set up audio and video input selectors*/*/*/*/*/*/*/*/*/*
  //----------------------
    
  let audioSwitch = true;
  $('#audiomute').on('click', () => {
    audioSwitch = !audioSwitch;
    const updateAudioEnabled = () => {
      if (localStream) {
        localStream.getAudioTracks()[0].enabled = audioSwitch;
      }
    }
    updateAudioEnabled();
    if (audioSwitch) {
      $('#audiomute').removeClass("off");
    } else {
      $('#audiomute').addClass("off");
    }
  });

  let videoSwitch = true;
  $('#videomute').on('click', () => {
    videoSwitch = !videoSwitch;
    const updateVideoEnabled = () => {
      if (localStream) {
        localStream.getVideoTracks()[0].enabled = videoSwitch;
      }
    }
    updateVideoEnabled();
    if (videoSwitch) {
      $('#videomute').removeClass("off");
    } else {
      $('#videomute').addClass("off");
    }
  });
  

  //----------------------
  // s*/*/*/*/*/*/*/*/*/*
  //----------------------

  const audioSelect = $('#audioSource');
  const videoSelect = $('#videoSource');
  const selectors = [audioSelect, videoSelect];

  navigator.mediaDevices.enumerateDevices()
    .then(deviceInfos => {
      const values = selectors.map(select => select.val() || '');
      selectors.forEach(select => {
        const children = select.children(':first');
        while (children.length) {
          select.remove(children);
        }
      });
    
    // video & audio ソース　のhtml変更

      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = $('<option>').val(deviceInfo.deviceId);

        if (deviceInfo.kind === 'audioinput') {
          option.text(deviceInfo.label ||
            'Microphone ' + (audioSelect.children().length + 1));
          audioSelect.append(option);
        } else if (deviceInfo.kind === 'videoinput') {
          option.text(deviceInfo.label ||
            'Camera ' + (videoSelect.children().length + 1));
          videoSelect.append(option);
        }
      }

      selectors.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.children()).some(n => {
            return n.value === values[selectorIndex];
          })) {
          select.val(values[selectorIndex]);
        }
      });

      videoSelect.on('change', step1);
      audioSelect.on('change', step1);
    });
  //--------------------------------------------------------------------------------------------------------
  // set up audio and video input selectors----------------------------------------------------
  //--------------------------------------------------------------------------------------------------------
  //step1---------------------------------------
  function step1() {
    step = 1;

    // Get audio/video stream
    const audioSource = $('#audioSource').val();
    const videoSource = $('#videoSource').val();
    const constraints = {
      audio: {
        deviceId: audioSource ? {
          exact: audioSource
        } : undefined
      },
      video: {
        deviceId: videoSource ? {
          exact: videoSource
        } : undefined
      },
    };

    //////////////////////////////////////////////
    ///////------///////////////////------////////
    getMediaDefault();

    function getMediaE() {
      navigator.webkitGetUserMedia('audio, video', function (localMediaStream) {
        var video = document.getElementById('my-video');
        video.src = window.webkitURL.createObjectURL(localMediaStream);
      }, onFailSoHard);


      step2();

    }

    function getMediaD() {

      navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
        getUserMedia: function (c) {
          return new Promise(function (y, n) {
            (navigator.mozGetUserMedia ||
              navigator.webkitGetUserMedia).call(navigator, c, y, n);
          });
        }
      } : null);

      if (!navigator.mediaDevices) {
        console.log("getUserMedia() not supported.");
        return;
      }

      // Prefer camera resolution nearest to 1280x720.

      var constraints = {
        audio: true,
        video: {
          width: 1280,
          height: 720
        }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          var video = document.getElementById('my-video');
          video.srcObject = stream
          video.onloadedmetadata = function (e) {
            video.play();
          };
        
          step2();
        
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });

    }
    function getMediaC() {

      // カメラ映像取得
      navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        .then(stream => {
          // 成功時にvideo要素にカメラ映像をセットし、再生
          const videoElm = document.getElementById('my-video');
          videoElm.srcObject = stream;
          videoElm.play();
          // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
          localStream = stream;

          if (room) {
            room.replaceStream(stream);
            return;
          }

          step2();

        }).catch(error => {
          // 失敗時にはエラーログを出力
          console.error('mediaDevice.getUserMedia() error:', error);
          return;
        });
    }
    function getMediaDefault() {

      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;

        if (room) {
          room.replaceStream(stream);
          return;
        }

        step2();
      }).catch(err => {
        $('#step1-error').show();
        console.error(err);
      });

    }
    
    ///////------///////////////////------////////
    //////////////////////////////////////////////
  }

  //step1---------------------------------------
  //step2---------------------------------------
  function step2() {
    step = 2;

    $('#their-videos').empty();
    $('#step1, #step3').hide();
    $('#step2').show();
    $('#join-room').focus();
  }

  //step2---------------------------------------
  //step3---------------------------------------
  function step3(room) {
    step = 3;

    // Wait for stream on the call, then set peer video display
    room.on('stream', stream => {
      const peerId = stream.peerId;
      const id = 'video_' + peerId + '_' + stream.id.replace('{', '').replace('}', '');
      
      addVideo(peerId, id); //ビデオ追加

      const el = $('#' + id).find('video').get(0);
      el.srcObject = stream;
      el.play();
    });

    room.on('removeStream', function (stream) {
      const peerId = stream.peerId;
      const id = 'video_' + peerId + '_' + stream.id.replace('{', '').replace('}', '');
      $('#' + id).remove();
    });

    // UI stuff
    room.on('close', step2);
    room.on('peerLeave', peerId => {
      $('.video_' + peerId).remove();
    });
    $('#step1, #step2').hide();
    $('#step3').show();
  }

  //step3---------------------------------------
  //--------------------------------------------------------------------------------------------------------
}
