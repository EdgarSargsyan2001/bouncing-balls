import { iShape, iMovably } from './Shape';
import { helper } from '../helpers/helper';

export class Circle implements iShape, iMovably {
  public x: number;
  public y: number;
  public radius: number;
  public mass: number;
  public image: HTMLImageElement = new Image();
  public velocity: {
    X: number;
    Y: number;
  };

  constructor(x: number, y: number, radius: number, imgPath: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = radius / 2;
    this.velocity = { X: 0, Y: 0 };
    this.image.src = imgPath;
  }

  public isCollisoin(c: Circle): boolean {
    if (c != this) {
      let d = helper.getDistanse(this.x, this.y, c.x, c.y);
      if (d - (this.radius + c.radius) < 0) {
        return true;
      }
    }
    return false;
  }

  public resolveCollision(c: Circle): void {
    let xDist = c.x - this.x;
    let yDist = c.y - this.y;

    if (this.velocity.Y == 0) {
      const balans = 15;
      if (xDist < 0) {
        c.velocity.X += -balans;
        this.velocity.X += balans * 2;
      } else {
        c.velocity.X += balans;
        this.velocity.X += -balans * 2;
      }
    }
    const xVelocityDiff = this.velocity.X - c.velocity.X;
    const yVelocityDiff = this.velocity.Y - c.velocity.Y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
      const angle = -Math.atan2(yDist, xDist);

      const m1 = this.mass;
      const m2 = c.mass;

      const u1 = this.rotate(this.velocity.X, this.velocity.Y, angle);
      const u2 = this.rotate(c.velocity.X, c.velocity.Y, angle);

      const v1 = {
        x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
        y: u1.y,
      };
      const v2 = {
        x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
        y: u2.y,
      };

      const vFinal1 = this.rotate(v1.x, v1.y, -angle);
      const vFinal2 = this.rotate(v2.x, v2.y, -angle);

      this.velocity.X = vFinal1.x;
      this.velocity.Y = vFinal1.y;

      c.velocity.X = vFinal2.x;
      c.velocity.Y = vFinal2.y;
    }
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    // ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2,
    );
    ctx.restore();
    ctx.closePath();
    // console.log(this.velocity);
  }

  public move(
    gravity: number,
    damping: number,
    deltaTime: number,
    canvasHeight: number,
    airResistance: number,
    contactForce: number,
  ) {
    if (this.velocity.Y == 0) {
      if (this.velocity.X !== 0) {
        if (this.velocity.X < 0) {
          this.velocity.X += contactForce;
          if (this.velocity.X > 0) {
            this.velocity.X = 0;
          }
        }
        if (this.velocity.X > 0) {
          this.velocity.X -= contactForce;
          if (this.velocity.X < 0) {
            this.velocity.X = 0;
          }
        }
      }
    }
    this.velocity.Y += gravity - airResistance / 2;

    // air Resistance in abscissa axis
    if (this.velocity.X !== 0) {
      if (this.velocity.X < 0) {
        this.velocity.X += airResistance;
        if (this.velocity.X > 0) {
          this.velocity.X = 0;
        }
      }
      if (this.velocity.X > 0) {
        this.velocity.X -= airResistance;
        if (this.velocity.X < 0) {
          this.velocity.X = 0;
        }
      }
    }

    this.y += this.velocity.Y * deltaTime;
    this.x += this.velocity.X * deltaTime;

    //bouncing
    if (this.y + this.radius > canvasHeight) {
      this.y = canvasHeight - this.radius;

      if (this.velocity.Y * damping > gravity) {
        this.velocity.Y *= -damping / (this.mass / 10);
      } else {
        this.velocity.Y = 0;
      }
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
