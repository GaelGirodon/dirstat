/*
 * mode-selector.jsx
 * Mode selector component
 */

import { Component } from "preact";
import { sharedState } from "../globals";

/**
 * A form allowing to switch between modes (size, count or depth)
 * and select direct or recursive statistics.
 */
export class ModeSelector extends Component {

  constructor() {
    super();
    this.state = { recursive: true, mode: "s" };
  }

  /**
   * Change mode.
   * @param e Event
   */
  changeMode(e) {
    e.preventDefault();
    this.setState({ ...this.state, mode: e.target.value });
    sharedState.update({ mode: e.target.value });
  }

  /**
   * Switch between direct and recursive statistics.
   */
  toggleRecursive() {
    const recursive = !this.state.recursive;
    this.setState({ ...this.state, recursive });
    sharedState.update({ recursive });
  }

  render() {
    return (
      <div className="is-flex is-align-items-center">
        <div className="control">
          <label className="checkbox" data-tooltip="Show child files statistics recursively">
            <input type="checkbox" checked={this.state.recursive}
                   onClick={() => this.toggleRecursive()} />
            <span className="ml-2">Recursive</span>
          </label>
        </div>
        <div className="control ml-5">
          <div className="select">
            <select value={this.state.mode} onChange={(e) => this.changeMode(e)}>
              <option value="s">Size</option>
              <option value="fc">Count</option>
              <option value="d">Depth</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}
