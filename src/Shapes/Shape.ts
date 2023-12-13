export interface iShape {
  x: number;
  y: number;
  mass: number;
  image: HTMLImageElement;
  draw(ctx: CanvasRenderingContext2D): void;
  isCollisoin(c: iShape): boolean;
  resolveCollision(c: iShape): void;
}

export interface iMovably {
  velocity: {
    X: number;
    Y: number;
  };
  move(
    gravity: number,
    damping: number,
    deltaTime: number,
    canvasHeight: number,
    airResistance: number,
    contactForce: number,
  ): void;
}
