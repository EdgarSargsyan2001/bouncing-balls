export class helper {
  public static pointOnTriangle(
    px: number,
    py: number,
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
  ): { X: number; Y: number } {
    const abx = bx - ax;
    const aby = by - ay;
    const acx = cx - ax;
    const acy = cy - ay;
    const apx = px - ax;
    const apy = py - ay;

    // vertex region outside a
    const d1 = helper.dot(abx, aby, apx, apy);
    const d2 = helper.dot(acx, acy, apx, apy);

    if (d1 <= 0 && d2 <= 0) {
      return { X: ax, Y: ay };
    }

    // vertex region outside b
    const bpx = px - bx;
    const bpy = py - by;
    const d3 = helper.dot(abx, aby, bpx, bpy);
    const d4 = helper.dot(acx, acy, bpx, bpy);

    if (d3 >= 0 && d4 <= d3) {
      return { X: bx, Y: by };
    }

    // edge region ab
    if (d1 >= 0 && d3 <= 0 && d1 * d4 - d3 * d2 <= 0) {
      const v = d1 / (d1 - d3);
      return { X: ax + abx * v, Y: ay + aby * v };
    }

    // vertex region outside c
    const cpx = px - cx;
    const cpy = py - cy;
    const d5 = helper.dot(abx, aby, cpx, cpy);
    const d6 = helper.dot(acx, acy, cpx, cpy);

    if (d6 >= 0 && d5 <= d6) {
      return { X: cx, Y: cy };
    }

    // edge region ac
    if (d2 >= 0 && d6 <= 0 && d5 * d2 - d1 * d6 <= 0) {
      const w = d2 / (d2 - d6);

      return { X: ax + acx * w, Y: ay + acy * w };
    }

    // edge region bc
    if (d3 * d6 - d5 * d4 <= 0) {
      const d43 = d4 - d3;
      const d56 = d5 - d6;

      if (d43 >= 0 && d56 >= 0) {
        const w = d43 / (d43 + d56);

        return { X: bx + (cx - bx) * w, Y: by + (cy - by) * w };
      }
    }

    // inside face regio
    return { X: px, Y: py };
  }

  public static pointInCircle(
    px: number,
    py: number,
    cx: number,
    cy: number,
    r: number,
  ): boolean {
    let dx: number = px - cx;
    let dy: number = py - cy;
    return dx * dx + dy * dy <= r * r;
  }

  public static getDistanse(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }
  private static dot(ax: number, ay: number, bx: number, by: number): number {
    return ax * bx + ay * by;
  }
  public static generateRandomNumber(min: number, max: number): number {
    if (min > max) {
      [min, max] = [max, min];
    }
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }
}
