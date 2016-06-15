'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');

var Customer = require('../api/customer/customer.db');
var schedule = require('./schedule');

/**
 * Adds the merge function to the merge schedule.
 */
function scheduleMerge() {
  schedule.addToMergeSchedule(Customer.merge);
}

// scheduleMerge();
