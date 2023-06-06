import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Microphone, PlayerPause } from "tabler-icons-react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const BASE_COLOR = `#F3F3F3`;

const outerCircleVariants = {
  circle: {
    transform: "scale(1)",
    opacity: 0.5,
    boxShadow: `0px 0px 0px 10px ${BASE_COLOR}`,
  },
  largeCircle: {
    transform: "scale(1)",
    opacity: 1,
    boxShadow: `0px 0px 0px 10px ${BASE_COLOR}`,
  },
  pulseIn: {
    transform: "scale(1)",
    opacity: 1,
    boxShadow: `0px 0px 0px 20px ${BASE_COLOR}`,
  },
  pulseOut: {
    transform: "scale(1)",
    opacity: 1,
    boxShadow: `0px 0px 0px 10px ${BASE_COLOR}`,
  },
};
const innerCircleVariants = {
  circle: {
    transform: "scale(1)",
    borderRadius: "100%",
  },
  square: {
    transform: "scale(0.8)",
    borderRadius: "100%",
  },
  invisible: {
    transform: "scale(0)",
    borderRadius: "100%",
  },
};

export default function RecordButton({
  speechState,
  startListening,
  stopListening,
  isFirst,
}) {
  const innerCircleAnimation = useAnimation();
  const outerCircleAnimation = useAnimation();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    (async () => {
      if (speechState == "pause") {
        await outerCircleAnimation.start("largeCircle");
        await outerCircleAnimation.start(["pulseOut", "pulseIn"], {
          repeat: Infinity,
          repeatType: "mirror",
        });
      } else {
        await outerCircleAnimation.start("circle");
      }
    })();
  }, [speechState]);

  useEffect(() => {
    (async () => {
      if (speechState == "pause") {
        await innerCircleAnimation.start("square");
        await innerCircleAnimation.start("invisible");
      } else {
        await innerCircleAnimation.start("circle");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechState]);

  return (
    <>
      <motion.div style={styles.container}>
        {speechState == "record" && (
          <button
            onClick={() => {
              startListening();
              isFirst && setIsPlaying(true);
            }}
            className="rounded-full py-4 px-4 z-50"
          >
            <Microphone size={50} strokeWidth={2} color={"#A3A3A3"} />
          </button>
        )}
        {speechState == "pause" && (
          <>
            <button
              onClick={stopListening}
              className="rounded-full py-4 px-4 z-50"
              disabled={isPlaying}
            >
              {isPlaying && (
                <CountdownCircleTimer
                  isPlaying={isPlaying}
                  duration={60}
                  size={100}
                  strokeWidth={8}
                  colors={["#5056E2", "#A3A3A3"]}
                  colorsTime={[60, 0]}
                  onComplete={() => setIsPlaying(false)}
                >
                  {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
              )}
              {!isPlaying && (
                <PlayerPause size={50} strokeWidth={2} color={"#A3A3A3"} />
              )}
            </button>
          </>
        )}
        <motion.div
          initial="circle"
          animate={outerCircleAnimation}
          variants={outerCircleVariants}
          style={{ ...styles.circle, ...styles.outerCircle }}
        />
        <motion.div
          initial="circle"
          animate={innerCircleAnimation}
          variants={innerCircleVariants}
          style={{ ...styles.circle, ...styles.innerCircle }}
        />
      </motion.div>
    </>
  );
}

const styles = {
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
  },
  circle: {
    position: "absolute",
  },
  outerCircle: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 9999,
  },
  innerCircle: {
    width: "90%",
    height: "90%",
    overflow: "hidden",
    backgroundColor: BASE_COLOR,
  },
};
