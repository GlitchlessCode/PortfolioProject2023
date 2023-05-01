/** @type {OffscreenCanvas} */
let cnv;
/** @type {OffscreenCanvasRenderingContext2D} */
let ctx;

let mazeSize;

let drawQueue = new Array();
let charQueue = new Array();

let charPos = { x: 0, y: 0, old: { x: 0, y: 0 } };

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
      drawQueue.push(data.deltas);
      break;
    case "char":
      char(data);
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
  drawQueue.length = 0;
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

  ctx.fillStyle = "black";
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

  drawQueue.push(data.arr);
}

function char(data) {
  if (data.pos.old) {
    charPos.old = data.pos.old;
  } else {
    charPos.old.x = charPos.x;
    charPos.old.y = charPos.y;
  }
  charPos.x = data.pos.x;
  charPos.y = data.pos.y;
  charQueue.push(interpolate(structuredClone(charPos)));
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

function drawError() {
  drawQueue.length = 0;
  ctx.fillStyle = "red";
  ctx.font = "normal 24px serif";
  ctx.fillText("Error: Maze too large", 20, 44);
}

function drawCharacter() {}

function* interpolate(posData) {
  for (let i = 0; i < 1; i += 0.1) {
    let x = Math.round((posData.x * i + posData.old.x * (1 - i)) * 10) / 10;
    let y = Math.round((posData.y * i + posData.old.y * (1 - i)) * 10) / 10;
    yield { x, y, fill: [{ x: posData.x, y: posData.y }, posData.old] };
  }
}

function draw() {
  if (drawQueue.length) {
    if (multiplier > 0) {
      let curr = drawQueue.shift();
      curr.forEach(drawCell);
    } else {
      drawError();
    }
  }
  if (charQueue.length) {
    let curr = charQueue[0].next();
    console.log(curr.value);
    if (curr.done) {
      charQueue.shift();
    } else {
    }
  }
  requestAnimationFrame(draw);
}
