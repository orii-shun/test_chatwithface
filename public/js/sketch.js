let face_results;

function setup() {
  let p5canvas = createCanvas(400, 400);
  p5canvas.parent('#canvas');
  adjustCanvas();

  // お顔が見つかると以下の関数が呼び出される．resultsに検出結果が入っている．
  gotFaces = function (results) {
    face_results = results;
    adjustCanvas();
  }
}


var socket = io();
var form = document.getElementById('form');
var input = document.getElementById('input');//input.valueに入力されたテキストが入ってる
var username = document.getElementById('username');

function send() {
  if (input.value) {
    socket.emit(
      'chat message',
       {
         text: input.value,
         color: '#FF0000',
         name: username.value
       }
      );//socket.emitが送信
    input.value = '';
  }
}



// Enterキーでsend()関数を呼び出す
input.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        send();
      }
    });



let chats = [];


socket.on('chat message', function(msg) {//socket.onは送信がされたら＝受信
  var item = document.createElement('li');
  item.textContent = `${msg.text}(from${msg.name})`;
  var messages = document.getElementById('messages');
  
  // メッセージを追加
  messages.appendChild(item);

  // メッセージが4つ以上の場合、一番古いメッセージを削除
  if (messages.children.length > 5) {
    messages.removeChild(messages.children[0]);
  }


  chats.push({
    text: msg.text,
    name: msg.name,
    life: 1023
  })
});



function draw() {
  // 描画処理
 //clear();  // これを入れないと下レイヤーにあるビデオが見えなくなる
  background(255);

  // 各頂点座標を表示する
  // 各頂点座標の位置と番号の対応は以下のURLを確認
  // https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
  if (face_results) {
    console.log(face_results);
    for (let landmarks of face_results.faceLandmarks) {
      for (let landmark of landmarks) {
        fill(0);
        noStroke();
        let plotx = mouseX + (landmark.x * width/2) - width/4;
        let ploty = mouseY/2 + (landmark.y * height/2);
        circle(plotx , ploty , 6);
        //socket.emit('get_plot', {x: plotx, y: ploty});
      }
    }
  }
  

  


  for (let chat of chats) {
    if (chat.life > 0) {
    fill(0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("\\" + chat.text + "/", mouseX , mouseY/2 + chat.life * 0.1 - 50);
    chat.life -= 1;
  }
  else {
    chats.splice(chats.indexOf(chat),1);

  }


}

}


function windowResized() {
  adjustCanvas();
}

function adjustCanvas() {
  // Get an element by its ID
  var element_webcam = document.getElementById('webcam');
  resizeCanvas(element_webcam.clientWidth, element_webcam.clientHeight);
  //console.log(element_webcam.clientWidth, element_webcam.clientHeight);
}