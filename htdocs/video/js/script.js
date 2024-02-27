const speech = new webkitSpeechRecognition();
speech.lang = 'ja-JP';

const btn = document.getElementById('btn');
const content = document.getElementById('content');

btn.addEventListener('click', function () {
  // 音声認識をスタート
  speech.start();
});

//speech.addEventListener('result', function (e) {
//  console.log(e);
//  const text = e.results[0][0].transcript;
//  content.innerText = text;
//});

//音声自動文字起こし機能
speech.onresult = function (e) {
  speech.stop();
  if (e.results[0].isFinal) {
    var autotext = e.results[0][0].transcript
    console.log(e);
    console.log(autotext);
    content.innerHTML += '<div>' + autotext + '</div>';
  }
}

//終了してもサイクルする
speech.onend = () => {
  speech.start()
};
