import CanvasGameBase from "./Base";
import backgroundImage from "./assets/bg-desktop.png";
import introImage from "./assets/intro-desktop.png";
import deadImage from "./assets/rip-desktop.png";
import blobAnimation from "./assets/theflob.json";

const CanvasGameDesktop = (props) => (
  <CanvasGameBase
    canvasWidth={600}
    canvasHeight={600}
    playerX={600 / 2 - 25}
    backgroundImage={backgroundImage}
    introImage={introImage}
    deadImage={deadImage}
    blobAnimation={blobAnimation}
    wrapperClass="mx-auto text-center w-[600px] shadow-gray-800/50 shadow-md"
    {...props}
  />
);

export default CanvasGameDesktop;
