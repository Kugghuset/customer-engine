'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var later = require('later');

var schedule = {
  fns: [],
  interval: undefined
};

/**
 * Schedule for running at 3 PM (15:00) every Thursday
 * (Sunday is day 1, (Saturday is 0), thus Thursday is 5)
 */
schedule.NPSSchedule = later.parse.recur()
  .on(5).dayOfWeek()
  .on(15).hour();

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
  
  // Check if *fn* is alreay in schedule.fns
  if (~this.fns.indexOf(fn)) {
    return; // early if found
  }
  
  this.fns.push(fn);
  
  // Start the schedule if it's not running already
  this.startSchedule();
  
  return this;
}.bind(schedule);

/**
 * Calls all functions in schedule.fns
 */
schedule.callFns = function () {
  
  _.forEach(this.fns, function (fn) {
    // call the function if it's actually a function
    if (_.isFunction(fn)) { fn(); }
  });
  
  return this;
}.bind(schedule);

/**
 * Starts the schedule if there isn't one on going already.
 */
schedule.startSchedule = function () {
  
  if (this.interval) {
    // Return early if there already is an interval set
    return;
  }
  
  this.interval = later.setInterval(this.callFns, this.NPSSchedule);
  
  return this;
}.bind(schedule);

// Export the complete schedule object
module.exports = schedule;