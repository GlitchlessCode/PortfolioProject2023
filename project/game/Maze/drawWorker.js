/** @type {OffscreenCanvas} */
let cnv;
/** @type {OffscreenCanvasRenderingContext2D} */
let ctx;

let mazeSize;

let frameQueue = new Array();

let mazeAspectRatio = 1;
let canvasAspectRatio = 1;

let multiplier = 0;

let leftMargin = 0;
let topMargin = 0;

addEventListener("message", receiveMessage);

function receiveMessage(msg) {
  let data = msg.data;

  switch (data.type) {
    case "init":
      init(data);
      break;
    case "dim":
      dimensions(data);
      break;
    case "create":
      create(data);
      break;
    case "frame":
      frameQueue.push(data.deltas);
      break;
  }
}

function init(data) {
  cnv = data.canvas;
  ctx = cnv.getContext("2d");
  requestAnimationFrame(draw);
}

function dimensions(data) {
  cnv.width = Math.floor(data.dim.width);
  cnv.height = Math.floor(data.dim.height);
}

function create(data) {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  frameQueue.length = 0;
  mazeSize = { w: data.dim.w, h: data.dim.h };

  canvasAspectRatio = cnv.width / cnv.height;
  mazeAspectRatio = (mazeSize.w * 5 + 4) / (mazeSize.h * 5 + 4);

  if (canvasAspectRatio < mazeAspectRatio) {
    multiplier = Math.floor(cnv.width / (mazeSize.w * 5 + 4));
  } else {
    multiplier = Math.floor(cnv.height / (mazeSize.h * 5 + 4));
  }

  leftMargin = Math.floor(
    cnv.width / 2 - ((mazeSize.w * 5 + 5) * multiplier) / 2
  );
  topMargin = Math.floor(
    cnv.height / 2 - ((mazeSize.h * 5 + 5) * multiplier) / 2
  );

  ctx.fillRect(
    (mazeSize.w * 5 + 2) * multiplier + leftMargin,
    2 * multiplier + topMargin,
    1 * multiplier,
    (mazeSize.h * 5 + 1) * multiplier
  );
  ctx.fillRect(
    2 * multiplier + leftMargin,
    (mazeSize.h * 5 + 2) * multiplier + topMargin,
    (mazeSize.w * 5 + 1) * multiplier,
    1 * multiplier
  );

  frameQueue.push(data.arr);
}

function drawCell(cell) {
  switch (cell.walls.top) {
    default:
    case 1:
      ctx.fillStyle = "black";
      ctx.fillRect(
        (cell.position.x * 5 + 2) * multiplier + leftMargin,
        (cell.position.y * 5 + 2) * multiplier + topMargin,
        6 * multiplier,
        1 * multiplier
      );
      break;
    case 0:
      ctx.clearRect(
        (cell.position.x * 5 + 3) * multiplier + leftMargin,
        (cell.position.y * 5 + 2) * multiplier + topMargin,
        4 * multiplier,
        1 * multiplier
      );
      break;
  }

  switch (cell.walls.left) {
    default:
    case 1:
      ctx.fillStyle = "black";
      ctx.fillRect(
        (cell.position.x * 5 + 2) * multiplier + leftMargin,
        (cell.position.y * 5 + 2) * multiplier + topMargin,
        1 * multiplier,
        6 * multiplier
      );
      break;
    case 0:
      ctx.clearRect(
        (cell.position.x * 5 + 2) * multiplier + leftMargin,
        (cell.position.y * 5 + 3) * multiplier + topMargin,
        1 * multiplier,
        4 * multiplier
      );
      break;
  }
}

function draw() {
  if (frameQueue.length) {
    if (multiplier > 0) {
      let curr = frameQueue.shift();
      curr.forEach(drawCell);
    } else {
      frameQueue.length = 0;
      ctx.fillStyle = "red";
      ctx.font = "normal 24px serif";
      ctx.fillText("Error: Maze too large", 20, 44);
    }
  }
  requestAnimationFrame(draw);
}
