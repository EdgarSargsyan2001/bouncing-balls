import { influencingForces } from '../index';

export interface IMovably {
  velocity: {
    X: number;
    Y: number;
  };
  move(
    deltaTime: number,
    canvasHeight: number,
    forces: influencingForces,
  ): void;
}
