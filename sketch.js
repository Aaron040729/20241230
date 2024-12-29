let player1, player2;
let p1Sprites = {
  idle: {
    img: null,
    width: 58,
    height: 109,
    frames: 6
  },
  walk: {
    img: null,
    width: 58,
    height: 109,
    frames: 7
  },
  attack: {
    img: null,
    width: 93,
    height: 123,
    frames: 5
  },
  ranged: {
    img: null,
    width: 73,
    height: 108,
    frames: 7
  },
  jump: {
    img: null,
    width: 58,
    height: 109,
    frames: 4
  },
  crouch: {
    img: null,
    width: 39,
    height: 80,
    frames: 1
  }
};

let p2Sprites = {
  idle: {
    img: null,
    width: 68,
    height: 120,
    frames: 7
  },
  walk: {
    img: null,
    width: 72,
    height: 123,
    frames: 7
  },
  attack: {
    img: null,
    width: 96,
    height: 113,
    frames: 7
  },
  ranged: {
    img: null,
    width: 77,
    height: 118,
    frames: 4
  },
  jump: {
    img: null,
    width: 79,
    height: 112,
    frames: 4
  },
  crouch: {
    img: null,
    width: 68,
    height: 87,
    frames: 1
  }
};

let backgroundImg; // 宣告背景圖片變數
let projectiles = []; // 用於存儲所有彈幕
let projectileSprites = {
  p1: {
    img: null,
    width: 56,  // 根據您的彈幕圖片調整
    height: 55, // 根據您的彈幕圖片調整
    frames: 1  // 根據您的彈幕動畫幀數調整
  },
  p2: {
    img: null,
    width: 107,  // 根據您的彈幕圖片調整
    height: 99, // 根據您的彈幕圖片調整
    frames: 8 // 根據您的彈幕動畫幀數調整
  }
};

// 在全局變量區域添加文字大小設定
let instructionTextSize = 16;
let gameOver = false;
let winner = "";

function preload() {
  // 載入角色1的精靈圖片
  p1Sprites.idle.img = loadImage('assets/player1/idle.png');
  p1Sprites.walk.img = loadImage('assets/player1/walk.png');
  p1Sprites.attack.img = loadImage('assets/player1/attack.png');
  p1Sprites.ranged.img = loadImage('assets/player1/ranged.png');
  p1Sprites.jump.img = loadImage('assets/player1/jump.png');
  p1Sprites.crouch.img = loadImage('assets/player1/crouch.png');
  
  // 載入角色2的精靈圖片
  p2Sprites.idle.img = loadImage('assets/player2/idle.png');
  p2Sprites.walk.img = loadImage('assets/player2/walk.png');
  p2Sprites.attack.img = loadImage('assets/player2/attack.png');
  p2Sprites.ranged.img = loadImage('assets/player2/ranged.png');
  p2Sprites.jump.img = loadImage('assets/player2/jump.png');
  p2Sprites.crouch.img = loadImage('assets/player2/crouch.png');
  
  // 預先載入背景圖片
  backgroundImg = loadImage('background.png');
  
  projectileSprites.p1.img = loadImage('assets/player1/projectile.png');
  projectileSprites.p2.img = loadImage('assets/player2/projectile.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 創建兩個角色實例，調整 y 座標使角色位於適當位置
  player1 = new Fighter(100, windowHeight - 250, p1Sprites, false);
  player2 = new Fighter(600, windowHeight - 250, p2Sprites, true);
}

function draw() {
  // 在繪製其他內容之前，先畫背景圖
  image(backgroundImg, 0, 0, width, height);
  
  // 更新和顯示所有彈幕
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    projectiles[i].display();
    
    // 檢查彈幕碰撞
    if (projectiles[i].checkCollision(player1)) {
      player1.takeDamage(15);
      projectiles[i].active = false;
    }
    if (projectiles[i].checkCollision(player2)) {
      player2.takeDamage(15);
      projectiles[i].active = false;
    }
    
    // 移除非活動的彈幕
    if (!projectiles[i].active) {
      projectiles.splice(i, 1);
    }
  }
  
  // 更新和顯示角色
  player1.update();
  player2.update();
  player1.display();
  player2.display();
  
  // 顯示血量條
  displayHealthBars();
  
  // 添加顯示操作說明
  displayInstructions();
  
  // 在最後添加遊戲結束的顯示
  if (gameOver) {
    displayGameOver();
  }
}

function displayHealthBars() {
  // 玩家1血量條（左上角）
  fill(255, 0, 0);
  rect(20, 20, 200, 20);
  fill(0, 255, 0);
  rect(20, 20, player1.health * 2, 20);
  
  // 玩家2血量條（右上角）
  fill(255, 0, 0);
  rect(width - 220, 20, 200, 20);
  fill(0, 255, 0);
  rect(width - 220, 20, player2.health * 2, 20);
}

function keyPressed() {
  // 玩家1控制
  if (key === 'a') player1.walk(-1);
  if (key === 'd') player1.walk(1);
  if (key === 'w') player1.attack();
  if (key === 's') player1.crouch(true);
  if (key === 'f') player1.rangedAttack();
  if (key === ' ') player1.jump(); // 空白鍵跳躍 - 玩家1
  
  // 玩家2控制
  if (keyCode === LEFT_ARROW) player2.walk(-1);
  if (keyCode === RIGHT_ARROW) player2.walk(1);
  if (keyCode === UP_ARROW) player2.attack();
  if (keyCode === DOWN_ARROW) player2.crouch(true);
  if (keyCode === CONTROL) player2.rangedAttack();
  if (keyCode === SHIFT) player2.jump(); // Shift鍵跳躍 - 玩家2
}

function keyReleased() {
  // 停止移動
  if (key === 'a') player1.stop(-1);
  if (key === 'd') player1.stop(1);
  if (keyCode === LEFT_ARROW) player2.stop(-1);
  if (keyCode === RIGHT_ARROW) player2.stop(1);
  
  // 添加蹲下鍵釋放處理
  if (key === 's') player1.crouch(false);
  if (keyCode === DOWN_ARROW) player2.crouch(false);
}

// 添加新的函數來顯示操作說明
function displayInstructions() {
  push();
  fill(255);
  textAlign(CENTER);
  textSize(instructionTextSize);
  
  // 在上方中間位置顯示說明文字
  let instructions = [
    "玩家1: [A/D]移動 [W]攻擊 [S]蹲下 [F]遠程攻擊 [空白鍵]跳躍",
    "玩家2: [←/→]移動 [↑]攻擊 [↓]蹲下 [Ctrl]遠程攻擊 [Shift]跳躍"
  ];
  
  // 添加半透明的背景
  noStroke();
  fill(0, 0, 0, 150);
  rect(width/2 - 400, 10, 800, 50, 5);
  
  // 顯示文字
  fill(255);
  text(instructions[0], width/2, 30);
  text(instructions[1], width/2, 50);
  pop();
}

// 添加遊戲結束顯示函數
function displayGameOver() {
  push();
  // 半透明黑色背景
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);
  
  // 設置文字樣式
  textAlign(CENTER, CENTER);
  fill(255);
  
  // 顯示獲勝者
  textSize(48);
  text(winner + " 獲勝！", width/2, height/2 - 100);
  
  // 顯示淡江資訊
  textSize(32);
  text("淡江大學教育科技系", width/2, height/2);
  textSize(24);
  text("培育數位學習與教育科技專業人才", width/2, height/2 + 50);
  text("歡迎加入我們的行列！", width/2, height/2 + 90);
  
  // 系所資訊
  textSize(20);
  text("系所網站：https://www.et.tku.edu.tw/", width/2, height/2 + 150);
  text("電話：(02)2621-5656 分機 2113", width/2, height/2 + 180);
  
  pop();
}


