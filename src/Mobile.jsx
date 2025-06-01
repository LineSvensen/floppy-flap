import CanvasGameBase from "./Base";
import backgroundImage from "./assets/bg-skyy.png";
import introImage from "./assets/bg-intro.png";
import deadImage from "./assets/rip.png";
import blobAnimation from "./assets/theflob.json";

const CanvasGameMobile = (props) => (
  <CanvasGameBase
    canvasWidth={344}
    canvasHeight={400}
    playerX={344 / 2 - 25}
    backgroundImage={backgroundImage}
    introImage={introImage}
    deadImage={deadImage}
    blobAnimation={blobAnimation}
    wrapperClass="w-full flex justify-center mt-4"
    {...props}
  />
);
export default CanvasGameMobile;
