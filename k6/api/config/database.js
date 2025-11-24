const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'k6_performance_db',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection (non-blocking - server will start even if DB check fails)
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('⚠️  Database connection failed:', err.message);
    console.error('   Make sure MySQL is running and database exists');
    console.error('   Server will start but API endpoints may fail');
    // Don't exit - let server start so user can see the error
  });

module.exports = pool;

