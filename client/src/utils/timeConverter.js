/**
 * @title timeConverter.js
 *
 * Contains helper functions to set times used on the ethereum blockchain
 *
 */

/**
 * duration.interval(n)
 *
 * Returns the number of seconds in common time periods.
 * Ex. duration.weeks(2) will return 604800
 *
 */
export const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};
