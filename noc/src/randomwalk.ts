export class RandomWalk {
  private requestId: number;
  private isRunning: boolean;
  private cvn: HTMLCanvasElement;

  constructor() {
    this.isRunning = false;
    this.cvn = document.getElementsByTagName("canvas")[0];
  }

  start() {
    this.loop();
  }
  stop() {
    window.cancelAnimationFrame(this.requestId);
  }
  loop = (): void => {
    this.requestId = window.requestAnimationFrame(this.loop);
    console.log("loop");
  };
}
