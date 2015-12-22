'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var later = require('later');

var schedule = {
  fns: []
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
  return this;
}.bind(schedule);

// Export the complete schedule object
module.exports = schedule;