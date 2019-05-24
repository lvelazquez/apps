import Point from "./point";

export class RandomWalk {
  private requestId: number;
  private ctx: CanvasRenderingContext2D;
  private pen: Point;

  constructor() {
    this.requestId = 0;
    const cvn: HTMLCanvasElement = document.querySelector(
      "canvas"
    ) as HTMLCanvasElement;
    this.ctx = cvn.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.strokeStyle = "#FF0000";
    this.pen = new Point(0, 0);
    this.ctx.moveTo(0, 0);
  }

  start() {
    this.loop();
  }
  stop() {
    this.ctx.moveTo(0, 0);
    window.cancelAnimationFrame(this.requestId);
  }
  loop = (): void => {
    this.requestId = window.requestAnimationFrame(this.loop);
    const speed = 1;

    if (Math.round(Math.random()) * 10 > 5) {
      this.pen.x += speed;
    } else {
      this.pen.y += speed;
    }
    console.log(this.pen);

    this.ctx.lineTo(this.pen.x, this.pen.y);
  };
}
