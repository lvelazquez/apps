import { RandomWalk } from "./src/randomwalk";

window.onload = function() {
  let isRunning = false;
  const rw = new RandomWalk();
  const btn: HTMLButtonElement = document.getElementById(
    "btn"
  ) as HTMLButtonElement;
  btn.addEventListener("click", function(e) {
    isRunning = !isRunning;
    const btn = e.currentTarget as HTMLButtonElement;
    btn.innerText = isRunning ? "Stop" : "Start";
    if (isRunning) {
      rw.start();
    } else {
      rw.stop();
    }
  });
};
