/** @type {OffscreenCanvas} */
let cnv;
/** @type {OffscreenCanvasRenderingContext2D} */
let ctx;

let frame;

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
    case "frame":
      break;
  }
});

function draw() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  requestAnimationFrame(draw);
}
