/*
 * mode-selector.js
 * Mode selector component
 */

/**
 * A form allowing to switch between modes (size, count or depth)
 * and select direct or recursive statistics.
 */
class ModeSelector extends Component {

  constructor() {
    super();
    this.state = {recursive: true, mode: "s"};
  }

  /**
   * Change mode.
   * @param e Event
   */
  changeMode = (e) => {
    e.preventDefault();
    this.setState({...this.state, mode: e.target.value});
    sharedState.update({mode: e.target.value});
  }

  /**
   * Switch between direct and recursive statistics.
   * @param e Event
   */
  toggleRecursive = (e) => {
    const recursive = !this.state.recursive;
    this.setState({...this.state, recursive});
    sharedState.update({recursive});
  }

  render() {
    return html`
      <div class="is-flex is-align-items-center">
        <div class="field">
          <div class="control">
            <label class="checkbox" data-tooltip="Show child files statistics recursively">
              <input type="checkbox" checked="${this.state.recursive}"
                     onClick="${this.toggleRecursive}"/>
              <span class="ml-2">Recursive</span>
            </label>
          </div>
        </div>
        <div class="field ml-5">
          <div class="control">
            <div class="select">
              <select value="${this.state.mode}" onChange="${this.changeMode}">
                <option value="s">Size</option>
                <option value="fc">Count</option>
                <option value="d">Depth</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  }

}
