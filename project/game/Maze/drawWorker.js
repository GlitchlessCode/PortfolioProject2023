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

let won = false;
let winAnim = 0;

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
    case "victory":
      won = true;
      winAnim = 0;
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
  won = false;
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

function drawCharacter(posData) {
  ctx.clearRect(
    (posData.prev.x * 5 + 3) * multiplier + leftMargin,
    (posData.prev.y * 5 + 3) * multiplier + topMargin,
    4 * multiplier,
    4 * multiplier
  );
  ctx.fillStyle = "#aaffaa";
  ctx.fillRect(
    ((mazeSize.w - 1) * 5 + 3) * multiplier + leftMargin,
    3 * multiplier + topMargin,
    4 * multiplier,
    4 * multiplier
  );
  ctx.fillStyle = "orange";
  ctx.fillRect(
    (posData.x * 5 + 3.5) * multiplier + leftMargin,
    (posData.y * 5 + 3.5) * multiplier + topMargin,
    3 * multiplier,
    3 * multiplier
  );
}

function* interpolate(posData) {
  let prevX = posData.old.x;
  let prevY = posData.old.y;
  for (let i = 0.1; i < 0.9; i += 0.1) {
    let x = Math.round((posData.x * i + posData.old.x * (1 - i)) * 10) / 10;
    let y = Math.round((posData.y * i + posData.old.y * (1 - i)) * 10) / 10;
    yield { x, y, prev: { x: prevX, y: prevY } };
    prevX = x;
    prevY = y;
  }
  return {
    x: posData.x,
    y: posData.y,
    prev: { x: prevX, y: prevY },
  };
}

function drawWin() {
  if (winAnim < 0.5) winAnim += 0.01;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, cnv.height * Math.sin(Math.PI * winAnim) * 2);
  ctx.lineTo(cnv.width * Math.sin(Math.PI * winAnim) * 2, 0);
  ctx.clip();

  ctx.fillStyle = "#224488";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  let textSize = Math.floor(cnv.height / 10);
  ctx.font = `bold ${textSize}px sans-serif`;
  ctx.fillStyle = "#eeeeee";
  ctx.textBaseline = "hanging";
  let textDim = {
    w: measureWidth("Well Done!", textSize),
    h: measureHeight("Well Done!", textSize),
  };
  ctx.fillText(
    "Well Done!",
    cnv.width / 2 - textDim.w / 2,
    cnv.height / 2 - textDim.h / 2
  );

  ctx.restore();
}

function measureWidth(text, size) {
  // Set canvas font size
  ctx.font = `bold ${size}px sans-serif`;
  // Return the measured width of the provided text
  return ctx.measureText(text).width;
}

function measureHeight(text, size) {
  // Set canvas font size
  ctx.font = `bold ${size}px sans-serif`;
  // Get the text metrics for the provided text
  let textMetric = ctx.measureText(text);
  // Return the ascent plus the descent
  return (
    textMetric.actualBoundingBoxAscent + textMetric.actualBoundingBoxDescent
  );
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
    if (multiplier > 0) {
      let curr = charQueue[0].next();
      drawCharacter(curr.value);
      if (curr.done) charQueue.shift();
    }
  }
  if (won) {
    drawWin();
  }
  requestAnimationFrame(draw);
}
