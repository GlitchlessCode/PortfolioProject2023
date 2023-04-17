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
      frame = data.data;
      break;
  }
});

function draw() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  if (frame) {
    ctx.fillStyle = "grey";
    for (let w = 0; w < frame.dim.w; w++) {
      for (let h = 0; h < frame.dim.h; h++) {
        ctx.fillRect(w * 25 + 10, h * 25 + 10, 20, 20);
      }
    }
  }
  requestAnimationFrame(draw);
}
