import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import blobAnimation from "./assets/theflob.json";
import deadImage from "./assets/rip-desktop.png";
import backgroundImage from "./assets/bg-desktop.png";
import introImage from "./assets/intro-desktop.png";

const CanvasGameDesktop = ({ highScore, setHighScore }) => {
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerY, setPlayerY] = useState(200);
  const bgRef = useRef(null);
  const bgX = useRef(0);
  const [showIntro, setShowIntro] = useState(true);
  const [finalScore, setFinalScore] = useState(null);

  const canvasWidth = 600;
  const canvasHeight = 600;
  const pipeWidth = 50;
  const player = useRef({ x: 175, y: 200, speed: 0, height: 50, width: 50 });
  const pipes = useRef([]);
  const frameCount = useRef(0);

  const startGame = () => {
    if (isRunning) return;
    setGameOver(false);
    setShowIntro(false);
    player.current.x = canvasWidth / 2 - player.current.width / 2;
    resetGame();
    setIsRunning(true);
    intervalRef.current = setInterval(gameLoop, 20);
  };

  const resetGame = () => {
    pipes.current = [];
    player.current.y = 175;
    player.current.x = canvasWidth / 2 - player.current.width / 2;
    player.current.speed = 0;
    setPlayerY(175);
    frameCount.current = 0;
    scoreRef.current = 0;
    setScore(0);
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const spawnPipe = () => {
    const difficulty = frameCount.current / 300;
    const minGap = 40;
    const maxGap = 150;
    const gap = Math.max(maxGap - difficulty * 10, minGap);
    const pipeTypeRoll = Math.random();
    const pipeType =
      pipeTypeRoll < 0.1 ? "top" : pipeTypeRoll < 0.2 ? "bottom" : "both";

    const minTop = 40;
    const maxTop = canvasHeight - gap - 40;
    const topHeight = Math.floor(Math.random() * (maxTop - minTop)) + minTop;

    pipes.current.push({
      x: canvasWidth,
      topHeight,
      gap,
      type: pipeType,
      scored: false,
    });
  };

  const render = () => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    const p = player.current;
    const speed = 2 + frameCount.current / 1000;

    c.clearRect(0, 0, canvasWidth, canvasHeight);

    const bg = bgRef.current;
    if (bg && bg.complete) {
      const bgWidth = bg.width;
      bgX.current -= 0.5;
      if (bgX.current <= -bgWidth) bgX.current = 0;

      c.save();
      c.globalAlpha = 0.8;
      c.drawImage(bg, bgX.current, 0, bgWidth, canvasHeight);
      c.drawImage(bg, bgX.current + bgWidth, 0, bgWidth, canvasHeight);
      c.restore();
    }

    p.speed += 0.2;
    p.y += p.speed;
    setPlayerY(p.y);

    pipes.current.forEach((pipe) => {
      pipe.x -= speed;
      if (!pipe.scored && pipe.x + pipeWidth < p.x) {
        pipe.scored = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
    });

    pipes.current = pipes.current.filter((pipe) => pipe.x + pipeWidth > 0);

    pipes.current.forEach((pipe) => {
      const shimmerOffset = Math.sin(frameCount.current / 50) * 100;
      const gradient = c.createLinearGradient(
        0,
        shimmerOffset,
        0,
        shimmerOffset + canvasHeight
      );
      gradient.addColorStop(0, "#ee7752");
      gradient.addColorStop(0.25, "#e73c7e");
      gradient.addColorStop(0.5, "#23a6d5");
      gradient.addColorStop(0.75, "#23d5ab");
      gradient.addColorStop(1, "#ee7752");

      c.fillStyle = gradient;
      c.strokeStyle = "#ff00ff";
      c.lineWidth = 1.5;

      if (pipe.type === "top" || pipe.type === "both") {
        roundRect(c, pipe.x, 0, pipeWidth, pipe.topHeight, 10);
      }
      if (pipe.type === "bottom" || pipe.type === "both") {
        const bY = pipe.topHeight + pipe.gap;
        roundRect(c, pipe.x, bY, pipeWidth, canvasHeight - bY, 10);
      }
    });

    c.fillStyle = "black";
    c.font = "20px Arial";
    c.fillText("Score: " + scoreRef.current, 10, 25);
  };

  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const checkDeath = () => {
    const p = player.current;
    const outOfBounds = p.y < 0 || p.y + p.height > canvasHeight;

    const hit = pipes.current.some((pipe) => {
      const inX = p.x + p.width > pipe.x && p.x < pipe.x + pipeWidth;
      const bY = pipe.topHeight + pipe.gap;
      const hitTop =
        (pipe.type === "top" || pipe.type === "both") && p.y < pipe.topHeight;
      const hitBottom =
        (pipe.type === "bottom" || pipe.type === "both") && p.y + p.height > bY;
      return inX && (hitTop || hitBottom);
    });

    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      localStorage.setItem("highScore", scoreRef.current);
    }

    if (outOfBounds || hit) {
      setFinalScore(scoreRef.current);

      resetGame();
      setGameOver(true);
    }
  };

  const gameLoop = () => {
    render();
    checkDeath();
    frameCount.current += 1;
    if (frameCount.current % 100 === 0) spawnPipe();
  };

  const handleJump = () => {
    if (isRunning) player.current.speed = -4;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        if (!isRunning) startGame();
        else handleJump();
      }
    };
    const handleTouchStart = () => {
      if (!isRunning) startGame();
      else handleJump();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [isRunning]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const bg = new Image();
    bg.src = backgroundImage;
    bgRef.current = bg;
  }, []);

  return (
    <>
      <div className="mx-auto text-center w-[600px] shadow-gray-800/50 shadow-md">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="z-10 border-sm"
          />
          {showIntro && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
              <img
                src={introImage}
                alt="Welcome"
                className="absolute inset-0 w-full h-full object-cover z-50"
              />
            </div>
          )}

          <div
            className="absolute w-[50px] h-[50px] pointer-events-none z-20"
            style={{
              left: `${player.current.x}px`,
              top: `${playerY}px`,
            }}
          >
            <Lottie animationData={blobAnimation} loop autoplay />
          </div>

          {gameOver && (
            <>
              <img
                src={deadImage}
                alt="You died"
                className="absolute inset-0 w-full h-full object-cover z-50"
              />
              <div className="absolute z-50 flex top-44 left-0 w-full justify-center">
                <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-xl shadow-lg text-md font-bold">
                  Final Score: {finalScore}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CanvasGameDesktop;
