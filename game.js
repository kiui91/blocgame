const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ゲームの設定
const paddleWidth = 100;
const paddleHeight = 10;
const ballRadius = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 4;
let ballSpeedY = -4;
const blockRowCount = 5;
const blockColumnCount = 8;
const blockWidth = 75;
const blockHeight = 20;
const blockPadding = 10;
const blockOffsetTop = 30;
const blockOffsetLeft = 35;

// ブロック配列の初期化
const blocks = [];
for (let c = 0; c < blockColumnCount; c++) {
  blocks[c] = [];
  for (let r = 0; r < blockRowCount; r++) {
    blocks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// パドルの操作
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// 角丸の四角形を描画する関数
function drawRoundedRect(
  ctx,
  x,
  y,
  width,
  height,
  radius,
  fillStyle,
  strokeStyle
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
}

// ボールの衝突判定
function collisionDetection() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      const block = blocks[c][r];
      if (block.status === 1) {
        if (
          ballX > block.x &&
          ballX < block.x + blockWidth &&
          ballY > block.y &&
          ballY < block.y + blockHeight
        ) {
          ballSpeedY = -ballSpeedY;
          block.status = 0;
        }
      }
    }
  }
}

// 描画
function drawBlocks() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      if (blocks[c][r].status === 1) {
        const blockX = c * (blockWidth + blockPadding) + blockOffsetLeft;
        const blockY = r * (blockHeight + blockPadding) + blockOffsetTop;
        blocks[c][r].x = blockX;
        blocks[c][r].y = blockY;

        const gradient = ctx.createLinearGradient(
          blockX,
          blockY,
          blockX + blockWidth,
          blockY + blockHeight
        );
        gradient.addColorStop(0, "#1E90FF");
        gradient.addColorStop(1, "#00BFFF");

        // 角丸の四角形を描画
        drawRoundedRect(
          ctx,
          blockX,
          blockY,
          blockWidth,
          blockHeight,
          10,
          gradient,
          "#FFFFFF"
        );
      }
    }
  }
}

function drawBall() {
  const gradient = ctx.createRadialGradient(
    ballX,
    ballY,
    ballRadius / 4,
    ballX,
    ballY,
    ballRadius
  );
  gradient.addColorStop(0, "#FF4500");
  gradient.addColorStop(1, "#FF6347");
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  drawRoundedRect(
    ctx,
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight,
    5,
    "#32CD32",
    "#006400"
  );
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBlocks();
  drawBall();
  drawPaddle();
  collisionDetection();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballY - ballRadius < 0) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY + ballRadius > canvas.height) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballSpeedY = -ballSpeedY;
    } else {
      alert("GAME OVER");
      document.location.reload();
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  requestAnimationFrame(draw);
}

// ゲーム開始
draw();
