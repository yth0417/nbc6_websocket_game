import { sendEvent } from './Socket.js';
import items from './assets/item.json' with { type: 'json' };
import stages from './assets/stage.json' with { type: 'json' };

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  stage = 1000;

  constructor(ctx, scaleRatio, stage, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stage = stage;
    this.itemController = itemController;
  }

  update(deltaTime) {
    // 현재 스테이지 정보 가져오기
    const nowStage = stages.data.find((stage) => stage.id === this.stage);
    // deltaTime에 따라 점수 증가
    this.score += deltaTime * 0.005 * nowStage.scorePerSecond;

    // nowStage가 유효할 때만 처리
    if (nowStage) {
      // 스테이지 변경을 위한 조건 확인
      if (Math.floor(this.score) >= nowStage.score && this.stageChange) {
        // 다음 스테이지 찾기
        const nextStage = stages.data.find((stage) => stage.id === nowStage.id + 1);
        // 다음 스테이지가 존재하는 경우에만 스테이지 변경
        if (nextStage) {
          const lastStage = this.stage;
          this.stage = nextStage.id;

          this.itemController.setStage(this.stage);

          // 이벤트 전송
          sendEvent(11, { currentStage: lastStage, targetStage: this.stage });
        } else {
          // 최고 스테이지에 도달한 경우 스테이지 변경을 중지
          this.stageChange = false;
        }
      }
    }
  }

  getItem(itemId) {
    const item = items.data.find((item) => item.id === itemId);
    this.score += item.score;
    sendEvent(21, { itemId, timestamp: Date.now() });
  }

  reset() {
    this.score = 0;
    this.stage = 1000;
    this.itemController.setStage(this.stage); // 리셋 시에도 스테이지 전달
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    this.drawStage();
  }

  drawStage() {
    const stageY = 50 * this.scaleRatio;
    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = 'black';

    const stageText = `Stage ${this.stage - 999}`; // 스테이지 번호 계산
    const stageX = this.canvas.width / 2 - this.ctx.measureText(stageText).width / 2;

    this.ctx.fillText(stageText, stageX, stageY);
  }
}

export default Score;
