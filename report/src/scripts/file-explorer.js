/*
 * file-explorer.js
 * File explorer component
 */

/**
 * A file explorer allowing to browse scan results.
 */
class FileExplorer extends Component {

  constructor() {
    super();
    this.state = Object.assign({stack: [0]}, sharedState.value("recursive", "mode"));
    sharedState.subscribe((s, keys) => {
      if (keys.some(k => k === "recursive" || k === "mode")) {
        this.setState(Object.assign({}, this.state, s.value("recursive", "mode")));
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
      this.setState({...this.state, stack});
      sharedState.update({dirIndex: i});
    }
  }

  /**
   * Navigate up to the parent directory.
   */
  up() {
    if (this.state.stack.length > 1) {
      const stack = this.state.stack.slice(0, this.state.stack.length - 1);
      this.setState({...this.state, stack});
      sharedState.update({dirIndex: stack[stack.length - 1]});
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
      .sort((f1, f2) => (files[f1].t[0] + files[f1].n)
        .localeCompare(files[f2].t[0] + files[f2].n));
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
    } else {
      return this.state.mode in file ? file[this.state.mode] : 0;
    }
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
   * @returns {string} Tooltip HTML content
   */
  getTooltip(file) {
    let tooltip = "";
    if (file.t === "dir") {
      const type = this.state.recursive ? "r" : "d";
      tooltip += `<strong>Size:</strong> ${humanize(file[type].s)}<br>
        <strong>Files:</strong> ${file[type].fc}<br>
        <strong>Directories:</strong> ${file[type].dc}<br>
        <strong>Depth:</strong> ${file.r.d}`;
    } else {
      tooltip += `<strong>Size:</strong> ${humanize(file.s)}`;
    }
    return tooltip + `<br><strong>Last modif.:</strong> ${file.m.replace(/[TZ]/g, " ").trim()}`;
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
      .reduce((max, i) => this.getStat(files[i]) > max ? this.getStat(files[i]) : max, 0);
    return html`
      <aside class="box file-explorer">
        <div class="box-title">
          Explorer
        </div>
        <div class="fe-title">
          <span class="has-ellipsis tooltip-left" data-tooltip="${absPath}">
            ${title}
          </span>
          <span class="copy" data-tooltip="Copy absolute path to the clipboard"
                onClick="${this.copyCurrentDirPathToClipboard}">📋
            <input type="text" id="currentDirPath" value="${absPath}"/>
          </span>
        </div>
        <ul>
          ${this.state.stack.length > 1 ? html`
            <li class="directory up" onClick="${() => this.up()}">
              ..
            </li>` : ""}
          ${children.map(i => {
            const file = files[i];
            return html`
              <li class="${file.t} has-tooltip" key="${i}" onClick="${() => this.navigate(i)}">
                <span class="name has-ellipsis">${file.n}</span>
                <span class="bar" style="width: ${this.getStat(file) * 50 / max}%"></span>
                <span class="legend">${this.getStatText(file)}</span>
                <span class="tooltip" innerHTML="${this.getTooltip(file)}"></span>
              </li>`
          })}
        </ul>
      </aside>`;
  }
}