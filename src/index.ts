import { Triangle } from './Shapes/Triangle';
import { Circle } from './Shapes/Circle';
import { IShapeAndMove } from './Interfaces/IShapeAndMove';
import { IShape } from './Interfaces/IShape';
import lendImage from '../public/assets/lend.jpg';
import trampolineImage from '../public/assets/trampoline.png';
import bollImage from '../public/assets/boll1.jpg';
import backgroundImage from '../public/assets/back.jpg';

export class BouncingCircles {
  constructor() {
    this.canvas = document.getElementById('canv') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.height = innerHeight;
    this.canvas.width = innerWidth;
    this.previousTime = performance.now();

    // game images
    this.gameImgae.background.src = backgroundImage;
    this.gameImgae.lend.src = lendImage;

    this.lendX = this.canvas.height - 120;

    const siez: number = 200;
    this.fixedShapes.push(
      new Triangle(5, this.lendX - siez + 10, siez, siez, trampolineImage),
    );

    //events
    this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      this.myCircleHover.x = this.mouse.x;
      this.myCircleHover.y = this.mouse.y;
    });

    this.canvas.addEventListener('click', () => {
      this.addCircle();
    });

    this.canvas.addEventListener('wheel', (event: WheelEvent) => {
      event.deltaY > 0 ? this.changeRadius(-10) : this.changeRadius(10);
      this.myCircleHover.radius = this.radius;
    });

    this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button === 1) {
        for (let i: number = 0; i < this.moveShapes.length; ++i) {
          this.moveShapes[i].velocity.Y = -1000;
        }
      }
    });

    this.gameLoop();
  }

  private gameLoop = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.previousTime) / 1000; // Convert to seconds
    this.previousTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number) {
    //remove the balls that went out of the window
    this.moveShapes = this.moveShapes.filter((shape) => {
      return !shape.isOutOfTheWindow(0, this.canvas.width);
    });

    for (let i: number = 0; i < this.moveShapes.length; ++i) {
      for (let j: number = i + 1; j < this.moveShapes.length; ++j) {
        if (this.moveShapes[i].isCollision(this.moveShapes[j])) {
          this.moveShapes[i].resolveCollision(this.moveShapes[j]);
        }
      }
    }

    for (let i: number = 0; i < this.fixedShapes.length; ++i) {
      for (let j: number = 0; j < this.moveShapes.length; ++j) {
        if (this.fixedShapes[i].isCollision(this.moveShapes[j])) {
          this.fixedShapes[i].resolveCollision(this.moveShapes[j]);
        }
      }
    }

    for (const shapeMove of this.moveShapes) {
      shapeMove.move(deltaTime, this.lendX + 15, this.Forces);
    }
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.gameImgae.background,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );

    for (let index = 0, k = innerWidth / 500; index < this.canvas.width; ) {
      this.ctx.drawImage(
        this.gameImgae.lend,
        index,
        this.lendX,
        this.canvas.width / k,
        this.canvas.height - this.lendX,
      );
      index += this.canvas.width / k;
    }

    for (const shape of this.fixedShapes) {
      shape.draw(this.ctx);
    }
    for (const shape of this.moveShapes) {
      shape.draw(this.ctx);
    }

    this.myCircleHover.draw(this.ctx);
  }

  private changeRadius(num: number) {
    if (this.radius + num >= 30 && this.radius + num <= 70) {
      this.radius += num;
    }
  }
  private addCircle() {
    if (this.canSpawnCircle()) {
      this.moveShapes.push(
        new Circle(
          this.mouse.x,
          this.mouse.y,
          this.radius,
          this.myCircleHover.image.src,
        ),
      );
    }
    if (this.moveShapes.length > this.circleCount) {
      this.moveShapes = this.moveShapes.slice(1);
    }
  }

  private canSpawnCircle(): boolean {
    return (
      this.mouse.x > this.radius &&
      this.mouse.x < this.canvas.width - this.radius &&
      this.mouse.y < this.lendX - this.radius
    );
  }

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private previousTime: number;

  private fixedShapes: Array<IShape> = new Array<IShape>();
  private moveShapes: Array<IShapeAndMove> = new Array<IShapeAndMove>();
  private radius: number = 30;
  private circleCount: number = 15;
  private lendX: number;

  private Forces: influencingForces = {
    gravity: 9.8 * 2,
    damping: 0.4,
    airResistance: 2.5,
    contactForce: 1.5,
  };

  private gameImgae: {
    lend: HTMLImageElement;
    background: HTMLImageElement;
  } = { lend: new Image(), background: new Image() };

  private mouse: {
    x: number;
    y: number;
  } = { x: 0, y: 0 };

  private myCircleHover: Circle = new Circle(
    this.mouse.x,
    this.mouse.y,
    this.radius,
    bollImage,
  );
}

export type influencingForces = {
  gravity: number;
  damping: number;
  airResistance: number;
  contactForce: number;
};

const bouncingCircle = new BouncingCircles();
