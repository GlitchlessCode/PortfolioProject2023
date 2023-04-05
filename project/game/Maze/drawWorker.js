/** @type {OffscreenCanvas} */
let cnv;
/** @type {OffscreenCanvasRenderingContext2D} */
let ctx;

addEventListener("message", function (msg) {
  let data = msg.data;

  switch (data.type) {
    case "init":
      cnv = data.canvas;
      ctx = cnv.getContext("2d");
      requestAnimationFrame(draw);
      break;
    case "dim":
      cnv.width = data.size * (1 + 1 * !data.test);
      cnv.height = data.size * (1 + 1 * data.test);
      break;
  }
});

function draw() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  ctx.fillStyle = "#dddddd";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  ctx.fillStyle = "black";
  ctx.fillRect(
    Math.random() * (cnv.width - 10),
    Math.random() * (cnv.height - 10),
    10,
    10
  );
  requestAnimationFrame(draw);
}
