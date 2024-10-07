import Item from './Item.js';
import itemUnlocks from './assets/itemUnlock.json' with { type: 'json' };

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];
  stage = null;

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextItemTime();
  }

  setStage(stage) {
    this.stage = stage;
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getAvailableItemsForStage() {
    const stageData = itemUnlocks.data.find((data) => data.stageId === this.stage);
    console.log(`ItemData ->`, stageData)
    return stageData ? stageData.itemId : [];
  }

  createItem() {
    const availableItemIds = this.getAvailableItemsForStage();

    if (availableItemIds.length === 0) {
      return; // 해당 스테이지에 사용 가능한 아이템이 없으면 아이템을 생성하지 않음
    }

    // 사용 가능한 itemId에 해당하는 itemImages를 필터링
    const filteredItems = this.itemImages.filter((item) => availableItemIds.includes(item.id));

    if (filteredItems.length === 0) {
      return; // 필터된 아이템이 없으면 생성하지 않음
    }

    const index = this.getRandomNumber(0, filteredItems.length - 1);
    const itemInfo = this.itemImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}


export default ItemController;
