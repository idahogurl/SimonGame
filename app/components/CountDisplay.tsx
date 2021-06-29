import * as React from "react";
import { useRef } from "react";
import { animated, useSpring, config } from "react-spring";

export function CountDisplay({ on, count, blink, loopRef, callback }) {
  const style = useSpring({
    config: { ...config.stiff, duration: 350 },
    loop: blink
      ? () => {
          return 3 > loopRef.current++;
        }
      : false,
    from: { opacity: 0 },
    to: { opacity: 1 },
    onRest: () => {
      if (loopRef.current > 2) {
        callback();
      }
    }
  });

  return (
    <div className="block-center">
      <div id="count">
        <animated.div
          style={style}
          className={on ? "countDisplay-on" : "countDisplay-off"}
        >
          {count}
        </animated.div>
      </div>
      <div>count</div>
    </div>
  );
}
