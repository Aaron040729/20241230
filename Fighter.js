class Fighter {
  constructor(x, y, sprites, facingLeft) {
    this.x = x;
    this.y = y;
    this.sprites = sprites;
    this.facingLeft = facingLeft;
    this.health = 100;
    this.state = 'idle';
    this.frameCount = 0;
    this.currentFrame = 0;
    this.speed = 5;
    this.attackCooldown = 0;
    this.movingLeft = false;
    this.movingRight = false;
    this.velocityY = 0;
    this.gravity = 0.8;
    this.jumpForce = -15;
    this.isOnGround = true;
    this.groundY = y;
    this.jumpStartTime = 0;
    this.jumpAnimDuration = 500;
    this.isCrouching = false;
    this.originalY = y;
    this.crouchOffset = 30;
  }
  
  update() {
    this.frameCount++;
    let currentAnim = this.sprites[this.state];
    if (this.frameCount > 5) {
      this.currentFrame = (this.currentFrame + 1) % currentAnim.frames;
      this.frameCount = 0;
    }
    
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
    
    if (!this.isCrouching) {
      if (this.state !== 'attack' && this.state !== 'ranged') {
        if (this.movingLeft) {
          this.x -= this.speed;
          if (this.isOnGround) this.state = 'walk';
          this.facingLeft = true;
        }
        if (this.movingRight) {
          this.x += this.speed;
          if (this.isOnGround) this.state = 'walk';
          this.facingLeft = false;
        }
        if (!this.movingLeft && !this.movingRight && this.state === 'walk' && this.isOnGround) {
          this.state = 'idle';
        }

        if (!this.isOnGround) {
          const jumpTime = millis() - this.jumpStartTime;
          this.state = 'jump';
          
          if (this.velocityY < 0) {
            if (jumpTime < this.jumpAnimDuration / 2) {
              this.currentFrame = 0;
            } else {
              this.currentFrame = 1;
            }
          } else {
            if (this.velocityY > 10) {
              this.currentFrame = 2;
            } else {
              this.currentFrame = 1;
            }
          }
        }
      }
    }
    
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    
    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.velocityY = 0;
      this.isOnGround = true;
      if (!this.isCrouching && !this.movingLeft && !this.movingRight && 
          this.state !== 'attack' && this.state !== 'ranged') {
        this.state = 'idle';
      }
    }
    
    this.checkAttackCollision();
  }
  
  display() {
    push();
    let currentAnim = this.sprites[this.state];
    let frameWidth = currentAnim.width;
    let frameHeight = currentAnim.height;
    let sx = this.currentFrame * frameWidth;
    
    if (this.facingLeft) {
      scale(-1, 1);
      image(
        currentAnim.img,
        -this.x - frameWidth, this.y,
        frameWidth, frameHeight,
        sx, 0,
        frameWidth, frameHeight
      );
    } else {
      image(
        currentAnim.img,
        this.x, this.y,
        frameWidth, frameHeight,
        sx, 0,
        frameWidth, frameHeight
      );
    }
    pop();
  }
  
  walk(direction) {
    if (direction < 0) {
      this.movingLeft = true;
      this.movingRight = false;
    } else if (direction > 0) {
      this.movingRight = true;
      this.movingLeft = false;
    }
  }
  
  stop(direction) {
    if (direction < 0) {
      this.movingLeft = false;
    } else if (direction > 0) {
      this.movingRight = false;
    }
  }
  
  attack() {
    if (this.attackCooldown <= 0 && !this.isCrouching) {
      this.state = 'attack';
      this.attackCooldown = 30;
      setTimeout(() => {
        if (!this.isCrouching) {
          this.state = 'idle';
        }
      }, 500);
    }
  }
  
  rangedAttack() {
    if (this.attackCooldown <= 0 && !this.isCrouching) {
      this.state = 'ranged';
      this.attackCooldown = 45;
      
      let projectileSprite = this === player1 ? projectileSprites.p1 : projectileSprites.p2;
      let direction = this.facingLeft ? -1 : 1;
      let projectileX = this.facingLeft ? this.x : this.x + this.sprites.idle.width;
      let projectileY = this.y + this.sprites.idle.height / 2;
      
      projectiles.push(new Projectile(
        projectileX,
        projectileY,
        direction,
        projectileSprite,
        this
      ));
      
      setTimeout(() => {
        if (!this.isCrouching) {
          this.state = 'idle';
        }
      }, 500);
    }
  }
  
  checkAttackCollision() {
    let opponent = this === player1 ? player2 : player1;
    if (this.state === 'attack' && dist(this.x, this.y, opponent.x, opponent.y) < 100) {
      opponent.takeDamage(10);
    }
  }
  
  takeDamage(amount) {
    this.health = max(0, this.health - amount);
    if (this.health <= 0) {
      gameOver = true;
      winner = this === player1 ? "Player 2" : "Player 1";
    }
  }
  
  jump() {
    if (this.isOnGround && !this.isCrouching) {
      this.velocityY = this.jumpForce;
      this.isOnGround = false;
      this.state = 'jump';
      this.currentFrame = 0;
      this.jumpStartTime = millis();
    }
  }
  
  crouch(isDown) {
    if (isDown && this.isOnGround) {
      this.isCrouching = true;
      this.state = 'crouch';
      this.y = this.originalY + this.crouchOffset;
      this.groundY = this.originalY + this.crouchOffset;
    } else {
      this.isCrouching = false;
      if (this.state === 'crouch') {
        this.state = 'idle';
        this.y = this.originalY;
        this.groundY = this.originalY;
      }
    }
  }
} 