const req_maria = require('mariadb')
const log = require('./log')
const config = require('../Scripts/config');

const pool = req_maria.createPool(config.MARIA);

async function query(_query, _callback){
   let conn;
   try{
      conn = await pool.getConnection();
      const rows = await conn.query(_query);
      _callback(rows[0]);
   }
   catch(_err){
      throw _err;
   }
   finally{
      conn?.release();
   }
}

module.exports = query