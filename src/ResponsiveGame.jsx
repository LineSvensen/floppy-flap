import { useEffect, useState } from "react";
import CanvasGame from "./CanvasGame";
import CanvasGameDesktop from "./CanvasGameDesktop";

const ResponsiveGame = ({ highScore, setHighScore }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 599);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 599);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <CanvasGame highScore={highScore} setHighScore={setHighScore} />
  ) : (
    <CanvasGameDesktop highScore={highScore} setHighScore={setHighScore} />
  );
};

export default ResponsiveGame;
