import * as React from "react";
import { Component, CSSProperties } from "react";

export class ControlButton extends Component<any, any> {
  constructor(props) {
    super(props);
  }
  render() {
    const style: CSSProperties = {
      background: this.props.color,
      cursor: this.props.on ? "pointer" : "not-allowed"
    };

    return (
      <div className="block-center">
        <div
          onClick={this.props.on ? this.props.handleClick : () => {}}
          className="controlButton"
          style={style}
        ></div>
        {this.props.label}
      </div>
    );
  }
}
