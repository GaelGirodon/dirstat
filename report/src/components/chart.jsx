/*
 * chart.jsx
 * Percentage bar chart component
 */

import { Component } from "preact";
import { humanize, pushGet, sharedState, shuffle } from "../globals";

/**
 * A set of colors for charts
 * @type {string[]}
 */
const COLORS = shuffle([
  "#F44336", // Red
  "#E91E63", // Pink
  "#9C27B0", // Purple
  "#673AB7", // Deep Purple
  "#303F9F", // Indigo
  "#1976D2", // Blue
  "#03A9F4", // Light Blue
  "#26C6DA", // Cyan
  "#009688", // Teal
  "#4CAF50", // Green
  "#8BC34A", // Light Green
  "#CDDC39", // Lime
  "#FB8C00", // Orange
  "#F4511E", // Deep Orange
  "#795548", // Brown
  "#607D8B", // Blue Grey
]);

/**
 * Color for the "other" category
 * @type {string}
 */
const DEFAULT_COLOR = "#C8C8C8";

/**
 * A percentage bar chart in a box.
 */
export class Chart extends Component {

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
    if (!allItems.length || allItems.every(i => i.value <= 0)) {
      return []; // Nothing to display in the chart
    }
    allItems.sort((a, b) => b.value - a.value); // Sort descending
    const items = allItems.slice(0, this.max - 1); // Keep only first items
    if (allItems.length > this.max - 1) {
      // Sum up other items in a last "other" category
      items.push(allItems.slice(this.max - 1).reduce((sum, e) => {
        return { name: sum.name, value: sum.value + e.value };
      }, { name: "other", value: 0 }));
    }
    return items;
  }

  /**
   * Generate the text label from the item value.
   * @param v Item value
   * @returns {string|*} Value to display
   */
  label(v) {
    return this.state.mode === "s" ? humanize(v) : v;
  }

  render() {
    const data = this.dataset();
    if (data.length === 0) {
      return (
        <div className="box">
          <div className="box-title tooltip-top tooltip-start" data-tooltip={this.description}>
            {this.name}
          </div>
          <div className="no-data">No data available</div>
        </div>
      );
    }
    const total = data.reduce((t, item) => t + item.value, 0);
    const used = [];
    const colors = data.map(item => COLORS[pushGet(used, strToColor(item.name, used))[0]])
      .slice(0, this.max - 1).concat([DEFAULT_COLOR]);
    return (
      <div className="box">
        <div className="box-title tooltip-top tooltip-start" data-tooltip={this.description}>
          {this.name}
        </div>
        <div className="chart">
          <div className="chart-content">
            {data.map((item, i) => (
              <div className="chart-item has-tooltip" key={item.name}
                   style={{
                     width: (item.value * 100) / total + "%",
                     background: colors[i % colors.length]
                   }}>
                {(item.value * 100) / total >= 10
                  ? (<span className="chart-item-name">{item.name}</span>) : ""}
                <div className="tooltip">
                  <strong>{item.name}</strong><br />
                  {this.label(item.value)} ({Math.round((item.value * 100) / total)}%)
                </div>
              </div>))}
          </div>
          <div className="chart-legend">
            {data.map((item, i) => (
              <div className="chart-legend-item has-tooltip">
                <span className="chart-legend-item-color"
                      style={{ background: colors[i % colors.length] }} />
                <span className="chart-legend-item-name">{item.name}</span>
                <div className="tooltip">
                  {this.label(item.value)} ({Math.round((item.value * 100) / total)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Map the string to a color index in COLORS.
 * @param {string} str The string to map to a color index
 * @param {number[]} exclusions Color indexes to exclude
 * @return {number} The index of the color associated to the string
 */
function strToColor(str, exclusions) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  for (let i = 0; exclusions.includes(sum % COLORS.length) && i <= exclusions.length; i++, sum++) ;
  return sum % COLORS.length;
}
