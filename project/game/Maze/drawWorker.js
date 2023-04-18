/** @type {OffscreenCanvas} */
let cnv;
/** @type {OffscreenCanvasRenderingContext2D} */
let ctx;

let mazeSize;

let frameQueue = new Array();

let mazeAspectRatio = 1;
let canvasAspectRatio = 1;

addEventListener("message", function (msg) {
  let data = msg.data;

  switch (data.type) {
    case "init":
      cnv = data.canvas;
      ctx = cnv.getContext("2d");
      requestAnimationFrame(draw);
      break;
    case "dim":
      cnv.width = Math.floor(data.dim.w);
      cnv.height = Math.floor(data.dim.h);
      break;
    case "create":
      ctx.clearRect(0, 0, cnv.width, cnv.height);
      mazeSize = { w: data.dim.w, h: data.dim.h };

      canvasAspectRatio = cnv.width / cnv.height;
      mazeAspectRatio = (mazeSize.w * 25 + 10) / (mazeSize.h * 25 + 10);

      console.log(mazeAspectRatio, canvasAspectRatio);

      // If canvasAspectRatio > mazeAspectRatio limit width, else, limit height

      ctx.fillRect(mazeSize.w * 25 + 15, 15, 5, mazeSize.h * 25 + 5);
      ctx.fillRect(15, mazeSize.h * 25 + 15, mazeSize.w * 25 + 5, 5);

      frameQueue.push(data.arr);
      break;
    case "frame":
      frameQueue.push(data.deltas);
      break;
  }
});

function draw() {
  if (frameQueue.length) {
    let curr = frameQueue.shift();
    curr.forEach((cell) => {
      switch (cell.walls.top) {
        default:
        case 1:
          ctx.fillStyle = "black";
          ctx.fillRect(
            cell.position.x * 25 + 15,
            cell.position.y * 25 + 15,
            30,
            5
          );
          break;
        case 0:
          ctx.clearRect(
            cell.position.x * 25 + 20,
            cell.position.y * 25 + 15,
            20,
            5
          );
          break;
      }
      switch (cell.walls.left) {
        default:
        case 1:
          ctx.fillStyle = "black";
          ctx.fillRect(
            cell.position.x * 25 + 15,
            cell.position.y * 25 + 15,
            5,
            30
          );
          break;
        case 0:
          ctx.clearRect(
            cell.position.x * 25 + 15,
            cell.position.y * 25 + 20,
            5,
            20
          );
          break;
      }
    });
  }
  requestAnimationFrame(draw);
}
