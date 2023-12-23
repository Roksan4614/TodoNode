const req_maria = require('mariadb')
const log = require('./log')
const config = require('../Scripts/config');

const pool = req_maria.createPool(config.MARIA);

async function query(_query, _callback = null) {
   let conn;
   //log.add("query :: ", _query)

   isSendCallback = false;
   try {
      conn = await pool.getConnection();
      const rows = await conn.query(_query);
      if (_callback != null)
      {
         isSendCallback = true;
         _callback(rows.length == 0 ? undefined : rows.length == 1 ? rows[0] : rows);
      }
   }
   catch (_err) {
      log.add(`Query Error :: ${_query} : ${_err}`)
      if (isSendCallback == false && _callback != null){
         _callback(null);
      }
      throw _err;
   }
   finally {
      conn?.release();
   }
}

module.exports = query