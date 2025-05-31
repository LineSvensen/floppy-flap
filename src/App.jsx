import { useEffect, useState } from "react";
import ResponsiveGame from "./ResponsiveGame";
import githubLogo from "./assets/github-logo.png";

const App = () => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("highScore");
    if (saved) setHighScore(Number(saved));
  }, []);

  return (
    <div className="bg-purple-200 md:from-blue-300 md:via-white md:to-pink-300">
      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-start px-4">
        <h1 className="text-center text-4xl cherry mt-4 mb-2 md:mb-4">
          Floppy Flap <br /> The Game
        </h1>

        <ResponsiveGame highScore={highScore} setHighScore={setHighScore} />

        <p className="text-center text-lg text-gray-800 mt-4 mb-2 px-4 cherry">
          Tap or press SPACE to flap
        </p>
        <p className="mt-1 mb-2 font-bold text-pink-700 text-2xl cherry">
          Your Highscore: {highScore}
        </p>
      </div>

      {/* Footer */}
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
