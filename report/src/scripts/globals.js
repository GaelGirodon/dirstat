/*
 * globals.js
 * Global constants and functions
 */

/**
 * Preact and HTM globals.
 */
const {Component, html, render} = htmPreact;

/**
 * Shared state instance.
 * @type {Store}
 */
const sharedState = new Store({recursive: true, mode: "s", dirIndex: 0});

/*
 * Utilities
 */

/**
 * Randomize array items position.
 * @param array Array to shuffle
 * @returns {*} The shuffled array
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Convert the file size to the appropriate unit.
 * @param bytes File size in bytes
 * @returns {string} File size with a more human-readable unit
 */
function humanize(bytes) {
  const units = ["B", "kB", "MB", "GB", "TB"];
  let unit = 0;
  let value = bytes;
  while (value >= 1000 && unit + 1 < units.length) {
    value /= 1000;
    unit++;
  }
  return `${Math.round(value * 100) / 100} ${units[unit]}`;
}

/**
 * Return a copy of the object with only the specified keys.
 * @param object Source object
 * @param keys Keys to pick
 * @returns {*} Filtered object
 */
function pick(object, ...keys) {
  const result = {};
  for (const key of keys) {
    if (key in object) {
      result[key] = object[key];
    }
  }
  return result;
}

