'use strict'

var sql = require('seriate');
var conf = require('./server/config/config');

sql.setDefaultConfig(conf.db);

sql.execute({
  query: 'SELECT object_id FROM sys.columns'
})
.then(data => {
  console.log(data);
})
.catch(err => console.log(err));