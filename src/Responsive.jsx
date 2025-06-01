import { useEffect, useState } from "react";
import CanvasGame from "./Mobile";
import CanvasGameDesktop from "./Desktop";

const ResponsiveGame = ({ highScore, setHighScore }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 599);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 599);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    return () => window.removeEventListener("resize", setViewportHeight);
  }, []);

  return isMobile ? (
    <CanvasGame highScore={highScore} setHighScore={setHighScore} />
  ) : (
    <CanvasGameDesktop highScore={highScore} setHighScore={setHighScore} />
  );
};

export default ResponsiveGame;
