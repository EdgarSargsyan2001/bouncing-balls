import { Circle } from './Circle';
import { IShape } from '../Interfaces/IShape';
import { helper } from '../helpers/helper';

export class Triangle implements IShape {
  public x: number;
  public y: number;
  public mass: number;
  public aSide: number;
  public bSide: number;
  public image: HTMLImageElement = new Image();

  public hitPoint: {
    X: number;
    Y: number;
  };

  constructor(
    x: number,
    y: number,
    aSide: number,
    bSide: number,
    imgPath: string,
    mass: number = 5,
  ) {
    this.x = x;
    this.y = y;
    this.aSide = aSide;
    this.bSide = bSide;
    this.mass = mass;
    this.hitPoint = { X: this.x, Y: this.y };
    this.image.src = imgPath;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.aSide);
    ctx.lineTo(this.x + this.bSide, this.y + this.aSide);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.save();
    // ctx.clip();
    ctx.drawImage(
      this.image,
      this.x - 40,
      this.y,
      this.aSide + 40,
      this.bSide + 40,
    );

    ctx.restore();
    ctx.closePath();
  }
  public isCollision(c: Circle): boolean {
    this.hitPoint = helper.pointOnTriangle(
      c.x,
      c.y,
      this.x,
      this.y + this.aSide,
      this.x + this.bSide,
      this.y + this.aSide,
      this.x,
      this.y,
    );

    return helper.pointInCircle(
      this.hitPoint.X,
      this.hitPoint.Y,
      c.x,
      c.y,
      c.radius,
    );
  }

  public resolveCollision(c: Circle): void {
    const xVelocityDiff = this.aSide - c.velocity.X;
    const yVelocityDiff = -this.bSide - c.velocity.Y;

    let xDist = c.x - this.hitPoint.X;
    let yDist = c.y - this.hitPoint.Y;
    if (Math.abs(xDist) < 5) {
      xDist = xDist < 0 ? -5 : 5;
    }

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
      const angle = -Math.atan2(yDist, xDist);

      const m1 = this.mass;
      const m2 = c.mass;

      const u1 = this.rotate(this.aSide, -this.bSide, angle);
      const u2 = this.rotate(c.velocity.X, c.velocity.Y, angle);

      const v = {
        x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
        y: u2.y,
      };

      const vFinal2 = this.rotate(v.x, v.y, -angle);
      c.velocity.X = vFinal2.x;
      c.velocity.Y = vFinal2.y;
    }
  }

  private rotate(velocityX: number, velocityY: number, angle: number) {
    const rotatedVelocities = {
      x: velocityX * Math.cos(angle) - velocityY * Math.sin(angle),
      y: velocityX * Math.sin(angle) + velocityY * Math.cos(angle),
    };

    return rotatedVelocities;
  }
}
