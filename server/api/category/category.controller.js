'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');

var utils = require('../../utils/utils');

var Category = require('./category.db');
var Subcategory = require('../subcategory/subcategory.db');
var Descriptor = require('../descriptor/descriptor.db');

exports.getCombined = function (req, res) {
  // TODO: Implement this!
  Promise.settle([
    Category.getAll(),
    Subcategory.getAll(),
    Descriptor.getAll()
  ])
  .then(function (categories) {
    var arr = _.map(categories, function (val) {
      if (val.isFulfilled()) {
        return val.value();
      } else {
        utils.log(val.reason());
        return [];
      }
    });

    var categories = arr[0];
    var subcategories = _.groupBy(arr[1], 'categoryId');
    var descriptors = _.groupBy(arr[2], 'subcategoryId');

    res.status(200).json({ categories: categories, subcategories: subcategories, descriptors: descriptors });
  })
  .catch(function (err) {
    utils.handleError(res, err);
  })
}