class Projectile {
  constructor(x, y, direction, sprite, owner) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.direction = direction; // 1 為右, -1 為左
    this.sprite = sprite;
    this.owner = owner; // 記錄發射者（player1 或 player2）
    this.width = sprite.width;
    this.height = sprite.height;
    this.currentFrame = 0;
    this.frameCount = 0;
    this.active = true; // 用於標記彈幕是否仍然有效
  }

  update() {
    this.x += this.speed * this.direction;
    
    // 更新動畫幀
    this.frameCount++;
    if (this.frameCount > 5) {
      this.currentFrame = (this.currentFrame + 1) % this.sprite.frames;
      this.frameCount = 0;
    }
    
    // 如果彈幕超出畫面則標記為非活動
    if (this.x < 0 || this.x > width) {
      this.active = false;
    }
  }

  display() {
    push();
    if (this.direction < 0) {
      scale(-1, 1);
      image(
        this.sprite.img,
        -this.x - this.width, this.y,
        this.width, this.height,
        this.currentFrame * this.width, 0,
        this.width, this.height
      );
    } else {
      image(
        this.sprite.img,
        this.x, this.y,
        this.width, this.height,
        this.currentFrame * this.width, 0,
        this.width, this.height
      );
    }
    pop();
  }

  checkCollision(fighter) {
    // 確保不會傷害發射者自己
    if (fighter === this.owner) return false;
    
    // 獲取角色當前的精靈圖大小
    let currentAnim = fighter.sprites[fighter.state];
    let fighterWidth = currentAnim.width;
    let fighterHeight = currentAnim.height;
    
    // 簡單的矩形碰撞檢測
    return (
      this.x < fighter.x + fighterWidth &&
      this.x + this.width > fighter.x &&
      this.y < fighter.y + fighterHeight &&
      this.y + this.height > fighter.y
    );
  }
} 