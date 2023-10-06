const req_maria = require('mariadb')
const log = require('./log')
const config = require('../Scripts/config');

const pool = req_maria.createPool(config.MARIA);

async function query(_query, _callback = null) {
   let conn;
   //log.add("query :: ", _query)
   try {
      conn = await pool.getConnection();
      const rows = await conn.query(_query);
      if (_callback != null)
         _callback(rows.count == 0 ? rows[0] : rows);
   }
   catch (_err) {
      if (_callback != null)
         _callback(undefined)
      throw _err;
   }
   finally {
      conn?.release();
   }
}

module.exports = query