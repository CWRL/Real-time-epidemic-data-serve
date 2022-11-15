let mysql=require('mysql')
let db= mysql.createPool({
    host            : '127.0.0.1',
    user            : 'root',
    password        : 'awds2220279455',
    database        : 'cwrl'
  });
  module.exports=db