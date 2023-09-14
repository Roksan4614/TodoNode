const req_maria = require('mariadb')
const log = require('./log')
const config = require('../Scripts/config');

const pool = req_maria.createPool(config.MARIA);

log.add('maria pool config :: ', config.MARIA)
log.add('maria pool :: ', pool)

async function query(_query, _callback){
   let conn;
   log.add("query :: ", _query)
   try{
      
      log.add("query :: 1")
      conn = await pool.getConnection();
      
      log.add("query :: 2")
      const rows = await conn.query(_query);
      
      log.add("query :: 3")
      _callback(rows[0]);
   }
   catch(_err){
      log.add("query :: 4")
      _callback(undefined)
      throw _err;
   }
   finally{
      log.add("query :: 5")
      conn?.release();
   }
}

module.exports = query