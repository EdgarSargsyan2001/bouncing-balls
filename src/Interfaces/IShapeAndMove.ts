import { IShape } from './IShape';
import { IMovably } from './IMovably';

export interface IShapeAndMove extends IShape, IMovably {
  isOutOfTheWindow(leftSize: number, rightSize: number): boolean;
}
