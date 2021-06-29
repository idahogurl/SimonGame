import * as React from "react";
import { Component } from "react";

export class PowerSwitch extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="powerSwitch">
        <span className="powerSwitch-off">Off</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={this.props.on}
            onChange={() => {
              this.props.switchHandler();
            }}
          />
          <div className="slider"></div>
        </label>
        <span className="powerSwitch-on">On</span>
      </div>
    );
  }
}
