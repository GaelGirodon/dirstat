/*
 * store.js
 * Store implementation
 */

import { pick } from "./globals";

/**
 * A basic state management system allowing to share a state
 * between components and to subscribe to updates.
 */
export class Store {

  /**
   * Create a new store.
   * @param state Initial state value
   */
  constructor(state) {
    this.state = state;
    this.callbacks = [];
  }

  /**
   * Subscribe to state updates.
   * @param callback Function to call on state updates
   */
  subscribe(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Update the state.
   * @param patch New values
   */
  update(patch) {
    Object.assign(this.state, patch);
    for (const callback of this.callbacks) {
      callback(this, Object.keys(patch));
    }
  }

  /**
   * Get the current state value.
   * @param keys Pick only some properties
   * @returns {*} Current state value
   */
  value(...keys) {
    return keys?.length ? pick(this.state, ...keys) : this.state;
  }

}
