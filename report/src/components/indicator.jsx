/*
 * indicator.jsx
 * Indicator component
 */

import { Component } from "preact";
import { humanize, sharedState } from "../globals";

/**
 * A key indicator displayed in a card.
 */
export class Indicator extends Component {

  constructor(props) {
    super();
    this.name = props.name;
    this.stat = props.stat;
    this.description = props.description;
    this.state = sharedState.value("recursive", "mode", "dirIndex");
    sharedState.subscribe((s) => {
      this.setState(s.value("recursive", "mode", "dirIndex"));
    });
  }

  /**
   * Get the indicator value to display.
   * @returns {string|number} Indicator value
   */
  indicator() {
    const dir = files[this.state.dirIndex];
    const key = this.state.recursive ? "r" : "d";
    const value = this.stat in dir[key] ? dir[key][this.stat] : 0;
    return this.stat === "s" ? humanize(value) : value;
  }

  render() {
    return (
      <div className="box">
        <div className="box-title tooltip-start tooltip-top" data-tooltip={this.description}>
          {this.name}
        </div>
        <div className="indicator">{this.indicator()}</div>
      </div>
    );
  }
}
