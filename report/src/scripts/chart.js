/*
 * chart.js
 * Percentage bar chart component
 */

/**
 * A set of colors for charts
 * @type {string[]}
 */
const COLORS = [
  "rgb(244, 67, 54)",
  "rgb(233, 30, 99)",
  "rgb(156, 39, 176)",
  "rgb(103, 58, 183)",
  "rgb(63, 81, 181)",
  "rgb(33, 150, 243)",
  "rgb(3, 169, 244)",
  "rgb(0, 188, 212)",
  "rgb(0, 150, 136)",
  "rgb(76, 175, 80)",
  "rgb(139, 195, 74)",
  "rgb(205, 220, 57)",
  // "rgb(255, 235, 59)",
  "rgb(255, 193, 7)",
  "rgb(255, 152, 0)",
  "rgb(255, 87, 34)",
  "rgb(121, 85, 72)",
  "rgb(96, 125, 139)"
];

/**
 * Color for the "other" category
 * @type {string}
 */
const DEFAULT_COLOR = "rgb(200, 200, 200)";

/**
 * A percentage bar chart in a box.
 */
class Chart extends Component {

  constructor(props) {
    super();
    this.name = props.name; // Chart name
    this.description = props.description; // Chart description
    this.data = props.data; // Data transformation function
    this.max = props.max || 10; // Max number of items to display
    this.state = sharedState.value("dirIndex", "recursive", "mode");
    sharedState.subscribe((s) => {
      this.setState(s.value("dirIndex", "recursive", "mode"));
    });
  }

  /**
   * Generate the dataset to display in the chart.
   * @returns {{name: string, value: string}[]} The dataset
   */
  dataset() {
    const dir = files[this.state.dirIndex]; // Current directory
    const type = this.state.recursive ? "r" : "d";
    const allItems = this.data(dir, type, this.state.mode); // Full dataset
    if (!allItems.length || allItems.every(i => i.value === 0)) {
      return []; // Nothing to display in the chart
    }
    allItems.sort((a, b) => b.value - a.value); // Sort descending
    const items = allItems.slice(0, this.max - 1); // Keep only first items
    if (allItems.length > this.max - 1) {
      // Sum up other items in a last "other" category
      items.push(allItems.slice(this.max - 1).reduce((sum, e) => {
        return {name: sum.name, value: sum.value + e.value}
      }, {name: "other", value: 0}));
    }
    return items;
  }

  /**
   * Generate the text label from the item value.
   * @param v Item value
   * @returns {string|*} Value to display
   */
  label(v) {
    return this.state.mode === "s" ? humanize(v) : v
  }

  render() {
    const data = this.dataset();
    if (data.length === 0) {
      return html`
        <div class="box">
          <div class="box-title tooltip-left" data-tooltip="${this.description}">${this.name}</div>
          <div class="no-data">No data available</div>
        </div>`;
    }
    const total = data.reduce((total, item) => total + item.value, 0);
    const colors = shuffle(COLORS.slice()).slice(0, this.max - 1).concat([DEFAULT_COLOR]);
    return html`
      <div class="box">
        <div class="box-title tooltip-left" data-tooltip="${this.description}">${this.name}</div>
        <div class="chart">
          <div class="chart-content">
            ${data.map((item, i) => html`
              <div class="chart-item has-tooltip" key="${item.name}"
                   style="width: ${item.value * 100 / total}%; background: ${colors[i % colors.length]}">
                <div class="tooltip">
                  <strong>${item.name}</strong><br/>
                  ${this.label(item.value)} (${Math.round(item.value * 100 / total)}%)
                </div>
              </div>`)}
          </div>
          <div class="chart-legend">
            ${data.map((item, i) => html`
              <div class="chart-legend-item has-tooltip">
                <span class="chart-legend-item-color"
                      style="background: ${colors[i % colors.length]}"></span>
                <span class="chart-legend-item-name">${item.name}</span>
                <div class="tooltip">
                  ${this.label(item.value)}
                    (${Math.round(item.value * 100 / total)}%)
                </div>
              </div>`)}
          </div>
        </div>
      </div>
    `;
  }

}
