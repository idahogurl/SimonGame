import * as React from "react";
import { ReactElement } from "react";

interface IGameCanvasProps {
  children: ReactElement[];
}
export function GameCanvas(props: IGameCanvasProps): ReactElement {
  const viewBox = "0, 0, 600, 600"; //decrease numbers to increase size
  return (
    <svg
      width="800"
      viewBox={viewBox}
      preserveAspectRatio="none"
      style={{
        overflow: "hidden",
        position: "relative",
        left: "-0.5px",
        top: "0.5px"
      }}
    >
      <circle cx={300} cy={300} r={275}></circle>
      {props.children}
    </svg>
  );
}
