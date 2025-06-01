import { useEffect, useState } from "react";
import ResponsiveGame from "./Responsive";
import githubLogo from "./assets/github-logo.png";

const App = () => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("highScore");
    if (saved) setHighScore(Number(saved));
  }, []);

  return (
    <div
      className="overflow-hidden bg-gradient-to-b from-pink-100 to-pink-300  md:from-blue-300 md:via-white md:to-pink-300"
      style={{
        minHeight: "100dvh",
        overflow: "hidden",
      }}
    >
      <div className="flex-grow flex flex-col items-center justify-start px-4">
        <h1 className="text-center text-2xl md:text-4xl cherry mt-4 mb-2 md:mb-4">
          Floppy Flap
        </h1>

        <ResponsiveGame highScore={highScore} setHighScore={setHighScore} />

        <p className="text-center text-md md:text-lg text-gray-800 mt-4 mb-2 px-4 cherry">
          Tap or press SPACE to flap
        </p>
        <p className="mt-1 mb-2 font-bold text-pink-700 text-lg md:text-2xl cherry">
          Your Highscore: {highScore}
        </p>
      </div>

      <footer className="text-xs text-gray-500 text-center px-4 py-4">
        <a
          href="https://github.com/LineSvensen"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2"
        >
          <img src={githubLogo} alt="GitHub" className="w-4 h-4" />
          Line Svensen on GitHub
        </a>
        <br />© 2025 Floppy Flap. Built by Line Svensen with ❤️ using React +
        Tailwind.
      </footer>
    </div>
  );
};

export default App;
