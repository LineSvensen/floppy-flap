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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 via-white to-pink-300">
      <h1 className="text-4xl font-heading mt-2 mb-4 pt-2 pb-2">Floppy Flap</h1>
      <ResponsiveGame highScore={highScore} setHighScore={setHighScore} />

      <p className="text-center text-gray-600 mt-4 mb-2 pl-2 pr-2">
        Tap or press SPACE to flap
      </p>
      <p className="mt-1 font-bold text-lg">Your Highcore: {highScore}</p>
      <footer className="text-xs text-gray-500 mt-8 mb-4 text-center">
        <a
          href="https://github.com/YOUR_USERNAME_HERE"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2"
        >
          <img src={githubLogo} alt="GitHub" className="w-4 h-4" />
          Line Svensen on GitHub
        </a>
        <br />© 2025 Floppy Flap. Built with ❤️ using React + Tailwind.
      </footer>
    </div>
  );
};

export default App;
