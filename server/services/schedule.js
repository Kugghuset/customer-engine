'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var later = require('later');
var moment = require('moment');

var schedule = {
  npsFns: [],
  npsInterval: undefined,
  mergeFns: [],
  mergeInterval: undefined
};

/**
 * Schedule for running at 1 PM (13:00) every Thursday
 * (Sunday is day 1, (Saturday is 0), thus Thursday is 5)
 *
 * And because of time zones 13:00 is really 15:00
 */
schedule.NPSSchedule = later.parse.recur()
  .on(5).dayOfWeek()
  .on(13).hour();

/**
 * Schedule for running the merge script every
 * 1st and 15th day of the month.
 */
schedule.mergeSchedule = later.parse.recur()
  .on(1).dayOfMonth()
  .and()
  .on(15).dayOfMonth();

/**
 * Adds *fn* to schedule which will run
 * according to the NPSSchedule.
 *
 * @param {Function} fn
 * @return {Array}
 */
schedule.addToNPSSchedule = function (fn) {

  // No schedule to add
  if (!fn) {
    return; // Early
  }

  // Check if *fn* is alreay in schedule.npsFns
  if (~this.npsFns.indexOf(fn)) {
    return; // early if found
  }

  this.npsFns.push(fn);

  // Start the schedule if it's not running already
  this.startSchedule();

  return this;
}.bind(schedule);

schedule.addToMergeSchedule = function (fn) {

  // No schedule to add
  if (!fn) {
    return; // Early
  }

  // Check if *fn* is alreay in schedule.mergeFns
  if (~this.mergeFns.indexOf(fn)) {
    return; // early if found
  }

  this.mergeFns.push(fn);

  // Start the schedule if it's not running already
  this.startSchedule();

  return this;
}.bind(schedule);

/**
 * Calls all functions in schedule.npsFns
 */
schedule.callnpsFns = function () {

  console.log('[{timestamp}] Calling NPS schedule functions.'.replace('{timestamp}', moment().format('YYYY-MM-DD HH:mm SSSS ZZ')));

  _.forEach(this.npsFns, function (fn) {
    // call the function if it's actually a function
    if (_.isFunction(fn)) { fn(); }
  });

  return this;
}.bind(schedule);

/**
 * Calls all functions in schedule.mergeFns
 */
schedule.callMergeFns = function () {

  _.forEach(this.mergeFns, function (fn) {
    // call the function if it's actually a function
    if (_.isFunction(fn)) { fn(); }
  });

  return this;
}.bind(schedule);

/**
 * Starts the schedule if there isn't one on going already.
 */
schedule.startSchedule = function () {

  if (!this.npsInterval) {
    this.npsInterval = later.setInterval(this.callnpsFns, this.NPSSchedule);
  }

  if (!this.mergeInterval) {
    this.mergeInterval = later.setInterval(this.callMergeFns, this.mergeSchedule);
  }

  return this;
}.bind(schedule);

// Export the complete schedule object
module.exports = schedule;