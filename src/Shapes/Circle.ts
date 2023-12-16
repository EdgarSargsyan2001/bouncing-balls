import { IShapeAndMove } from '../Interfaces/IShapeAndMove';
import { helper } from '../helpers/helper';
import { influencingForces } from '../../src/index';

export class Circle implements IShapeAndMove {
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

  public isCollision(c: Circle): boolean {
    if (c != this) {
      let d = helper.getDistanse(this.x, this.y, c.x, c.y);
      if (d - (this.radius + c.radius) < 0) {
        return true;
      }
    }
    return false;
  }
  public isOutOfTheWindow(leftSize: number, rightSize: number): boolean {
    if (this.x + this.radius < leftSize || this.x - this.radius > rightSize) {
      return true;
    }
    return false;
  }

  public resolveCollision(c: Circle): void {
    let xDist = c.x - this.x;
    let yDist = c.y - this.y;
    const yVelocityDiff = this.velocity.Y - c.velocity.Y;
    const xVelocityDiff = this.velocity.X - c.velocity.X;

    if (-10 < this.velocity.X && this.velocity.X < 10 && this.velocity.Y != 0) {
      let balans = Math.abs(yVelocityDiff / 10);
      if (this.mass < c.mass) {
        balans += 30;
      } else {
        balans += 50;
      }
      if (xDist < 0) {
        c.velocity.X += -balans;
        this.velocity.X += balans;
      } else {
        c.velocity.X += balans;
        this.velocity.X += -balans;
      }
    }

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
  }

  public move(
    deltaTime: number,
    canvasHeight: number,
    forces: influencingForces,
  ) {
    if (this.velocity.Y == 0) {
      if (this.velocity.X !== 0) {
        if (this.velocity.X < 0) {
          this.velocity.X += forces.contactForce;
          if (this.velocity.X > 0) {
            this.velocity.X = 0;
          }
        }
        if (this.velocity.X > 0) {
          this.velocity.X -= forces.contactForce;
          if (this.velocity.X < 0) {
            this.velocity.X = 0;
          }
        }
      }
    }
    this.velocity.Y += forces.gravity - forces.airResistance / 2;

    // air Resistance in abscissa axis
    if (this.velocity.X !== 0) {
      if (this.velocity.X < 0) {
        this.velocity.X += forces.airResistance;
        if (this.velocity.X > 0) {
          this.velocity.X = 0;
        }
      }
      if (this.velocity.X > 0) {
        this.velocity.X -= forces.airResistance;
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

      if (this.velocity.Y * forces.damping > forces.gravity) {
        this.velocity.Y *= -forces.damping / (this.mass / 10);
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
