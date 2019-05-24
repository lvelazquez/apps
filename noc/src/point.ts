class Point {
  private x: number;
  private y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public add = (p: Point): Point => new Point(this.x + p.x, this.y + p.y);
  public sub = (p: Point): Point => new Point(this.x - p.x, this.y - p.y);
  public mult = (p: Point): Point => new Point(this.x * p.x, this.y * p.y);
  public div = (p: Point): Point => new Point(this.x / p.x, this.y / p.y);

  public static get Default(): Point {
    return new Point();
  }
}
