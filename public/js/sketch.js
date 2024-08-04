let face_results;

function setup() {
  let p5canvas = createCanvas(400, 400);
  p5canvas.parent('#canvas');

  // お顔が見つかると以下の関数が呼び出される．resultsに検出結果が入っている．
  gotFaces = function (results) {
    face_results = results;
    adjustCanvas();
  }
}



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
        circle(mouseX + (landmark.x * width/2) - width/4, mouseY/2 + (landmark.y * height/2) , 6);
        
      }
    }
  }
  
  for (let chat of chats) {
    if (chat.life > 0) {
    fill(0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("\\" + chat.text + "/", mouseX , mouseY/2 + chat.life * 0.05 +50);
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