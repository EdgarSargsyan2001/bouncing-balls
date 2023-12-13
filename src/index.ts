import { Triangle } from './Shapes/Triangle';
import { Circle } from './Shapes/Circle';
import { iShape, iMovably } from './Shapes/Shape';
import { helper } from './helpers/helper';
import lendI from '../public/assets/lend.jpg';
import trampoline from '../public/assets/trampoline.png';
import boll1 from '../public/assets/boll1.jpg';
import back from '../public/assets/back.jpg';

class BouncingCircles {
  constructor() {
    this.canvas = document.getElementById('canv') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.height = innerHeight;
    this.canvas.width = innerWidth;
    this.previousTime = performance.now();

    this.gameImgae.background.src = back;
    this.gameImgae.lend.src = lendI;

    this.lendHeight = this.canvas.height - 200;

    const siez: number = 200;
    this.shapes.push(
      new Triangle(5, this.lendHeight - siez + 10, siez, siez, trampoline),
    );
    this.shapes.push(new Triangle(250, 250, 100, 100, trampoline));
    //events
    this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      this.myCircleHover.x = this.mouse.x;
      this.myCircleHover.y = this.mouse.y;
      this.addCircle();
    });

    this.canvas.addEventListener('click', (event: MouseEvent) => {
      this.addCircle();
    });

    this.canvas.addEventListener('wheel', (event: WheelEvent) => {
      event.deltaY > 0 ? this.changeRadius(-10) : this.changeRadius(10);
      this.myCircleHover.radius = this.radius;
      this.myCircleHover.image.src = `assets/boll${this.radius / 10 - 3}.jpg`;
    });

    this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button === 1) {
        for (let i: number = 0; i < this.shapes.length; ++i) {
          const c: Circle = this.shapes[i] as Circle;
          if (
            c 
            // helper.pointInCircle(this.mouse.x, this.mouse.y, c.x, c.y, c.radius)
          ) {
            console.log(c);
            if (c.velocity) c.velocity.Y = -2000;
          }
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
    for (let i: number = 0; i < this.shapes.length; ++i) {
      for (let j: number = i + 1; j < this.shapes.length; ++j) {
        if (this.shapes[i].isCollisoin(this.shapes[j])) {
          this.shapes[i].resolveCollision(this.shapes[j]);
        }
      }
    }

    for (const shapeMove of this.movableShapes) {
      shapeMove.move(
        this.gravity,
        this.damping,
        deltaTime,
        this.lendHeight + 15,
        this.airResistance,
        this.contactForce,
      );
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
    this.ctx.drawImage(
      this.gameImgae.lend,
      0,
      this.lendHeight,
      this.canvas.width / 2,
      this.canvas.height - this.lendHeight,
    );
    this.ctx.drawImage(
      this.gameImgae.lend,
      this.canvas.width / 2,
      this.lendHeight,
      this.canvas.width / 2,
      this.canvas.height - this.lendHeight,
    );

    for (const shape of this.shapes) {
      shape.draw(this.ctx);
    }
    this.myCircleHover.draw(this.ctx);
  }

  private changeRadius(num: number) {
    if (this.radius + num >= 40 && this.radius + num <= 80) {
      this.radius += num;
    }
  }
  private addCircle() {
    if (
      this.mouse.x > this.radius &&
      this.mouse.x < this.canvas.width - this.radius &&
      this.mouse.y < this.lendHeight - this.radius
    ) {
      let c: Circle = new Circle(
        this.mouse.x,
        this.mouse.y,
        this.radius,
        this.myCircleHover.image.src,
      );

      if (this.canAddShape(c)) {
        this.shapes.push(c);
        this.movableShapes.push(c);
      }
    }
  }
  private canAddShape(sh: iShape): boolean {
    for (const shape of this.shapes) {
      if (shape.isCollisoin(sh)) {
        return false;
      }
    }
    return true;
  }

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gravity: number = 9.8 * 2;
  private damping: number = 0.5;
  private airResistance: number = 2.5;
  private contactForce: number = 1;
  private previousTime: number;
  private shapes: Array<iShape> = new Array<iShape>();
  private radius: number = 40;
  private movableShapes: Array<iMovably> = new Array<iMovably>();
  private lendHeight: number;

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
    boll1,
  );
}

// Initialize the bouncing circle application
const bouncingCircle = new BouncingCircles();
