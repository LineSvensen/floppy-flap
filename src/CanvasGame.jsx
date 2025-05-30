import { useEffect, useRef, useState } from "react";

const CanvasGame = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const canvasHeight = 400;
  const pipeWidth = 50;
  const player = useRef({ x: 175, y: 200, speed: 0, height: 50, width: 50 });
  const pipes = useRef([]);
  const frameCount = useRef(0);

  const startGame = () => {
    if (isRunning) return;
    setGameOver(false);

    resetGame();
    setIsRunning(true);
    intervalRef.current = setInterval(gameLoop, 20);
  };

  const resetGame = () => {
    pipes.current = [];
    player.current.y = 175;
    player.current.speed = 0;
    frameCount.current = 0;
    scoreRef.current = 0;
    setScore(0);
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const spawnPipe = () => {
    const difficulty = frameCount.current / 1000;
    const minGap = 80;
    const maxGap = 200;
    const gap = Math.max(maxGap - difficulty * 10, minGap);

    const pipeTypeRoll = Math.random();
    const pipeType =
      pipeTypeRoll < 0.2 ? "top" : pipeTypeRoll < 0.4 ? "bottom" : "both";

    const minTop = 40;
    const maxTop = canvasHeight - gap - 40;
    const topHeight = Math.floor(Math.random() * (maxTop - minTop)) + minTop;

    pipes.current.push({
      x: 400,
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

    // Update
    p.speed += 0.2;
    p.y += p.speed;

    pipes.current.forEach((pipe) => {
      pipe.x -= speed;

      // Score logic
      if (!pipe.scored && pipe.x + pipeWidth < p.x) {
        pipe.scored = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
    });

    pipes.current = pipes.current.filter((pipe) => pipe.x + pipeWidth > 0);

    // Clear
    c.clearRect(0, 0, 400, 400);

    // Player
    c.fillStyle = "black";
    c.fillRect(p.x, p.y, p.width, p.height);

    // Pipes
    c.fillStyle = "green";
    pipes.current.forEach((pipe) => {
      if (pipe.type === "top" || pipe.type === "both") {
        c.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
      }
      if (pipe.type === "bottom" || pipe.type === "both") {
        const bY = pipe.topHeight + pipe.gap;
        c.fillRect(pipe.x, bY, pipeWidth, canvasHeight - bY);
      }
    });

    // Score display
    c.fillStyle = "black";
    c.font = "20px Arial";
    c.fillText("Score: " + scoreRef.current, 10, 25);
  };

  const checkDeath = () => {
    const p = player.current;

    const outOfBounds = p.y < 0 || p.y + p.height > canvasHeight;

    const currentScore = scoreRef.current;
    const storedHigh = localStorage.getItem("highScore");

    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem("highScore", currentScore);
    } else if (storedHigh) {
      // Optional: restore the real high score from localStorage if needed
      setHighScore(Number(storedHigh));
    }

    const hit = pipes.current.some((pipe) => {
      const inX = p.x + p.width > pipe.x && p.x < pipe.x + pipeWidth;

      if (!inX) return false;

      const bY = pipe.topHeight + pipe.gap;
      const hitTop =
        (pipe.type === "top" || pipe.type === "both") && p.y < pipe.topHeight;
      const hitBottom =
        (pipe.type === "bottom" || pipe.type === "both") && p.y + p.height > bY;

      return hitTop || hitBottom;
    });

    if (outOfBounds || hit) {
      resetGame();
      setGameOver(true);
    }
  };

  const gameLoop = () => {
    render();
    checkDeath();
    frameCount.current += 1;

    if (frameCount.current % 100 === 0) {
      spawnPipe();
    }
  };

  const handleJump = () => {
    if (isRunning) player.current.speed = -4;
  };

  useEffect(() => {
    const saved = localStorage.getItem("highScore");
    if (saved) setHighScore(Number(saved));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        if (!isRunning) startGame();
        else handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-black"
      />
      {gameOver && (
        <p className="text-red-600 font-bold text-lg mt-2">
          💀 You died! Press Start to try again.
        </p>
      )}

      <div className="mt-4 flex space-x-2">
        <button onClick={startGame}>Start</button>
        <button onClick={handleJump}>Jump</button>
      </div>
      <p className="mt-2 font-bold">High Score: {highScore}</p>
    </>
  );
};

export default CanvasGame;
