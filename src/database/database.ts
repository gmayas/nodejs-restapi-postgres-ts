const { Pool } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connectionString = `postgresql://${process.env.User}:${process.env.Password}@${process.env.Host}:${process.env.Port}/${process.env.Database}`

const pool = new Pool({
  connectionString: isProduction ? process.env.URI : connectionString,
  //connectionString: process.env.URI,
  ssl: true,
})

export default pool;

