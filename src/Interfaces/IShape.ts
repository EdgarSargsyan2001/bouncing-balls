export interface IShape {
  x: number;
  y: number;
  mass: number;
  image: HTMLImageElement;
  draw(ctx: CanvasRenderingContext2D): void;
  isCollision(c: IShape): boolean;
  resolveCollision(c: IShape): void;
}
