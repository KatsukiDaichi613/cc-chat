//  <button onclick="startRecording()">解析開始</button>
//  <button onclick="endRecording()">解析終了</button>

// クロスブラウザ定義
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// 変数定義
var localMediaStream = null;
var localScriptProcessor = null;
var audioContext;
var bufferSize = 1024;
var audioData = []; // 録音データ
var recordingFlg = false;

// 音声解析
var audioAnalyser = null;


// 録音バッファ作成（録音中自動で繰り返し呼び出される）
var onAudioProcess = function (e) {
  if (!recordingFlg) return;

  // 音声のバッファを作成
  var input = e.inputBuffer.getChannelData(0);
  var bufferData = new Float32Array(bufferSize);
  for (var i = 0; i < bufferSize; i++) {
    bufferData[i] = input[i];
  }
  audioData.push(bufferData);

  // 波形を解析
  analyseVoice();
};

// 解析用処理
var analyseVoice = function () {
  var fsDivN = audioContext.sampleRate / audioAnalyser.fftSize;
  var spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
  audioAnalyser.getByteFrequencyData(spectrums);

  var volumeSum = 0;
  var saying = false;

  for (var i = 0, len = spectrums.length; i < len; i++) {
    volumeSum += spectrums[i];
  }

  //console.log(spectrums.length);//1024
  if (volumeSum / spectrums.length > volume_Threshold) {
    saying = true;
    $('.voice').addClass('say');
  } else {
    $('.voice').removeClass('say');
  }

  if (test_val >= 21 && test_val <= 24) {
    if (saying) {
      voice_time[test_val] += 1;
      
    }
    recording_time[test_val] += 1;
  } else if (test_val == 20 && volume_Threshold_ing) {
    if (volumeSum / spectrums.length > 1) {
      volume_small_time++;
      volume_Threshold_sum = volume_Threshold_sum + (volumeSum / spectrums.length)
    }
  }
}
//-----------------------------------------------------------
let volume_Threshold = 1;
let volume_Threshold_ing = false;
let volume_small_time = 1;
let volume_Threshold_sum = 1;

let voice_time = [];
let recording_time = [];
recording_time[21]=1;
recording_time[22]=1;
recording_time[23]=1;
recording_time[24]=1;
voice_time[21]=1;
voice_time[22]=1;
voice_time[23]=1;
voice_time[24]=1;
let voice_per = [];
let ACMake = true;

// 解析開始
function startRecording() {};

// 解析終了
function endRecording() {
  recordingFlg = false;
};

function AudioContextMake() {
  if (ACMake) {
    audioContext = new AudioContext();
    recordingFlg = true;
    navigator.getUserMedia({
        audio: true
      }, function (stream) {
        // 録音関連
        localMediaStream = stream;
        var scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
        localScriptProcessor = scriptProcessor;
        var mediastreamsource = audioContext.createMediaStreamSource(stream);
        mediastreamsource.connect(scriptProcessor);
        scriptProcessor.onaudioprocess = onAudioProcess;
        scriptProcessor.connect(audioContext.destination);

        // 音声解析関連
        audioAnalyser = audioContext.createAnalyser();
        audioAnalyser.fftSize = 2048;
        frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
        timeDomainData = new Uint8Array(audioAnalyser.frequencyBinCount);
        mediastreamsource.connect(audioAnalyser);
      },
      function (e) {
        console.log(e);
      });
  }
  ACMake = false;
}

//キャリブレーション
function calibration() {

  $('.record').hide();

  volume_Threshold_ing = true;
  $('.timer').html('「おはようございます」と発言してください');
  var calibrationInterval = setTimeout(function () {
    $('.timer').html('<br>終了しました。<p>発声中、画面右のメガホンマークがオンになるか確認ください<br>うまくいっていない場合はもう一度、録音解析をお願いします。</p>');
    $('.record').show();
    volume_Threshold_ing = false;
    volume_Threshold = (volume_Threshold_sum / volume_small_time) / 2;
    console.log(volume_Threshold);
  }, 10000);
}
