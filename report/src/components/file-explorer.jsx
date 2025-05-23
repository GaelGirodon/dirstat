/*
 * file-explorer.jsx
 * File explorer component
 */

import { Component } from "preact";
import { humanize, sharedState } from "../globals";

/**
 * A file explorer allowing to browse scan results.
 */
export class FileExplorer extends Component {

  constructor() {
    super();
    this.state = {
      stack: [0],
      sort: { type: "name", order: 1 },
      ...sharedState.value("recursive", "mode")
    };
    sharedState.subscribe((s, keys) => {
      if (keys.some(k => k === "recursive" || k === "mode")) {
        this.setState({ ...this.state, ...s.value("recursive", "mode") });
      }
    });
  }

  /**
   * Navigate down to the given child directory.
   * @param i Child directory index
   */
  navigate(i) {
    if (i > 0 && i < files.length && files[i].t === "dir") {
      const stack = [...this.state.stack, i];
      this.setState({ ...this.state, stack });
      sharedState.update({ dirIndex: i });
    }
  }

  /**
   * Navigate up to the parent directory.
   */
  up() {
    if (this.state.stack.length > 1) {
      const stack = this.state.stack.slice(0, this.state.stack.length - 1);
      this.setState({ ...this.state, stack });
      sharedState.update({ dirIndex: stack[stack.length - 1] });
    }
  }

  /**
   * Get the current displayed directory index.
   * @returns {number} Current displayed directory index
   */
  getCurrentDirIndex() {
    return this.state.stack[this.state.stack.length - 1];
  }

  /**
   * Get the current displayed directory.
   * @returns {*} Current displayed directory
   */
  getCurrentDir() {
    return files[this.getCurrentDirIndex()];
  }

  /**
   * Get sorted indexes of direct children of the current directory.
   * @returns {*} Children indexes
   */
  getDirectChildren() {
    return this.getCurrentDir().d.c.slice()
      .sort((f1, f2) => {
        const sort = files[f1].t[0].localeCompare(files[f2].t[0]);
        if (sort !== 0) return sort; // Directories before regular files
        return this.state.sort.order * (this.state.sort.type === "name"
          ? files[f1].n.localeCompare(files[f2].n)
          : this.getStat(files[f1]) - this.getStat(files[f2]));
      });
  }

  /**
   * Get the statistic to display for a given file.
   * @param file File for which to get the statistic
   * @returns {number} Statistic value
   */
  getStat(file) {
    if (file.t === "dir") {
      const key = this.state.recursive ? "r" : "d";
      return this.state.mode in file[key] ? file[key][this.state.mode] : 0;
    }
    return this.state.mode in file ? file[this.state.mode] : 0;
  }

  /**
   * Get the formatted statistic to display for a given file.
   * @param file File for which to get the formatted statistic
   * @returns {string|number} Formatted statistic value
   */
  getStatText(file) {
    const measure = this.getStat(file);
    return this.state.mode === "s" ? humanize(measure) : measure;
  }

  /**
   * Get the tooltip content for a given file.
   * @param file File for which to generate the tooltip content
   * @returns Tooltip content
   */
  getTooltip(file) {
    if (file.t === "dir") {
      const type = this.state.recursive ? "r" : "d";
      return (<>
        <strong>Size:</strong> {humanize(file[type].s)}<br />
        <strong>Files:</strong> {file[type].fc}<br />
        <strong>Directories:</strong> {file[type].dc}<br />
        <strong>Depth:</strong> {file.r.d}<br />
        <strong>Last modif.:</strong> {file.m.replace(/[TZ]/g, " ").trim()}
      </>);
    }
    return (<>
      <strong>Size:</strong> {humanize(file.s)}<br />
      <strong>Last modif.:</strong> {file.m.replace(/[TZ]/g, " ").trim()}
    </>);
  }

  /**
   * Toggle between sort types (file name or current statistic).
   */
  toggleSortType() {
    const sort = this.state.sort.type === "name"
      ? { type: "stat", order: -1 } : { type: "name", order: 1 };
    this.setState({ ...this.state, sort });
  }

  /**
   * Toggle between sort orders (ascending or descending).
   */
  toggleSortOrder() {
    const order = -this.state.sort.order;
    this.setState({ ...this.state, sort: { ...this.state.sort, order } });
  }

  /**
   * Copy the current directory absolute path to the clipboard.
   */
  copyCurrentDirPathToClipboard() {
    const input = document.querySelector("#currentDirPath");
    input.select();
    document.execCommand("copy");
  }

  render() {
    const currentDir = this.getCurrentDir();
    const title = files[0].n + (this.getCurrentDirIndex() === 0 ? "" : pathSeparator + currentDir.p);
    const absPath = (this.getCurrentDirIndex() === 0 ? "" : files[0].p + pathSeparator) + currentDir.p;
    const children = this.getDirectChildren();
    const max = children
      .reduce((m, i) => (this.getStat(files[i]) > m ? this.getStat(files[i]) : m), 0);
    return (
      <aside className="box file-explorer">
        <div className="box-title">
          Explorer
        </div>
        <div className="fe-header">
          <span className="fe-title has-ellipsis tooltip-start" data-tooltip={absPath}>
            {title}
          </span>
          <span data-tooltip={"Sort by " + (this.state.sort.type === "name" ? "statistic" : "name")}
                className="fe-btn" onClick={() => this.toggleSortType()}>
            {this.state.sort.type === "name" ? "🔠" : "🔢"}
          </span>
          <span data-tooltip={"Sort " + (this.state.sort.order > 0 ? "descending" : "ascending")}
                className="fe-btn" onClick={() => this.toggleSortOrder()}>
            {this.state.sort.order > 0 ? "🔼" : "🔽"}
          </span>
          <span data-tooltip="Copy absolute path to the clipboard"
                className="fe-btn copy" onClick={this.copyCurrentDirPathToClipboard}>📋
            <input type="text" id="currentDirPath" value={absPath} />
          </span>
        </div>
        <ul>
          {this.state.stack.length > 1 ? (
            <li className="directory up" onClick={() => this.up()}>
              ..
            </li>) : ""}
          {children.map(i => {
            const file = files[i];
            return (
              <li className={`fe-${file.t} has-tooltip`} key={i} onClick={() => this.navigate(i)}>
                <span className="name has-ellipsis">{file.n}</span>
                <span className="bar" style={{ width: (this.getStat(file) * 50) / max + "%" }} />
                <span className="legend">{this.getStatText(file)}</span>
                <span className="tooltip">{this.getTooltip(file)}</span>
              </li>
            );
          })}
        </ul>
      </aside>
    );
  }
}
