class Cactus {
  constructor(ctx, x, y, width, height, image) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.rotation = 0; // 회전 각도
    this.isFlying = false; // 날아가는 상태인지 여부
    this.flyingSpeed = 0; // 날아가는 속도
  }

  update(speed, gameSpeed, deltaTime, scaleRatio) {
    // 날아가고 있을 때는 회전 및 위치 이동
    if (this.isFlying) {
      this.rotation += 0.1 * deltaTime; // 회전 속도
      this.x += this.flyingSpeed * deltaTime * scaleRatio; // 날아가는 속도

      // 선인장이 화면을 벗어났으면 제거될 수 있도록 설정
      if (this.x + this.width < 0 || this.y + this.height < 0) {
        // 화면에서 벗어났을 때의 로직을 추가할 수 있습니다.
      }
    } else {
      // 일반 상태에서는 계속해서 왼쪽으로 이동
      this.x -= speed * gameSpeed * deltaTime * scaleRatio;
    }
  }

  draw() {
    if (this.isFlying) {
      // 회전하는 이미지 그리기
      this.ctx.save();
      this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // 선인장 중심으로 회전
      this.ctx.rotate(this.rotation);
      this.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
      this.ctx.restore();
    } else {
      // 기본 이미지 그리기
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  collideWith(sprite) {
    const adjustBy = 1.4;

    // 충돌
    return (
      this.x < sprite.x + sprite.width / adjustBy &&
      this.x + this.width / adjustBy > sprite.x &&
      this.y < sprite.y + sprite.height / adjustBy &&
      this.y + this.height / adjustBy > sprite.y
    );
  }

  flyAway() {
    this.isFlying = true;
    this.flyingSpeed = 3; // 날아가는 속도 (조절 가능)
  }
}

export default Cactus;
