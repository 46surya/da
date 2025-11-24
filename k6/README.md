# k6 Database Performance Tuning

This folder contains a simple database schema and k6 load testing scripts to help you learn database performance tuning.

## Files

- `database_schema.sql` - Simple e-commerce database schema with indexes for tuning practice
- `load_test.js` - k6 load test script with custom metrics for database operations
- `api/` - Complete REST API server (Node.js/Express) ready to use
- `README.md` - This file

## Database Schema

The schema includes:
- **OLTP tables**: users, products, orders, order_items, categories
- **Indexes**: Single-column and composite indexes for common query patterns
- **Sample data**: Pre-populated data for testing
- **MySQL compatible**: Optimized for MySQL Workbench

## Prerequisites

1. **k6 installed**: 
   ```bash
   # Windows (using Chocolatey)
   choco install k6
   
   # Or download from https://k6.io/docs/getting-started/installation/
   ```

2. **MySQL Workbench**:
   - Download from https://dev.mysql.com/downloads/workbench/
   - Install MySQL Server if not already installed

3. **Setting up the Database in MySQL Workbench**:
   - Open MySQL Workbench
   - Connect to your MySQL server
   - Create a new schema (database) or use an existing one
   - Open `database_schema.sql` in MySQL Workbench
   - Uncomment the `CREATE DATABASE` and `USE` statements at the top if creating a new database
   - Execute the script (Ctrl+Shift+Enter or click the execute button)
   - Verify tables are created in the left sidebar

4. **Node.js** (for the API server):
   - Download from https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

## Complete Setup Guide

### Step 1: Set Up the Database
1. Open MySQL Workbench
2. Execute `database_schema.sql` to create tables and sample data
3. Verify the database `k6_performance_db` exists with all tables

### Step 2: Set Up the API Server
```bash
# Navigate to API directory
cd k6/api

# Install dependencies
npm install

# Create environment file
# Windows PowerShell:
Copy-Item env.example .env

# Edit .env and update MySQL credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=k6_performance_db

# Start the server
npm start
```

The API will be available at `http://localhost:3000`

### Step 3: Run k6 Load Tests

Open a new terminal and run:

```bash
# From the k6 directory
cd k6
k6 run load_test.js
```

### With Custom API URL
```bash
k6 run --env API_URL=http://localhost:3000 load_test.js
```

### With Different Load Profile
Edit the `stages` in `load_test.js` to adjust the load pattern.

## Learning Database Tuning

### 1. Baseline Performance
- Run the test and note the baseline metrics
- Check P95/P99 latencies for read, write, and join operations

### 2. Index Tuning
- Remove indexes and observe performance degradation
- Add composite indexes for specific query patterns
- Test covering indexes for read-heavy workloads

### 3. Query Optimization
- Monitor slow queries during load tests
- Use `EXPLAIN` or `EXPLAIN ANALYZE` (MySQL 8.0.18+) to understand query plans
- Enable slow query log: `SET GLOBAL slow_query_log = 'ON';`
- Optimize JOINs and WHERE clauses
- Use MySQL Query Analyzer in Workbench to identify bottlenecks

### 4. Connection Pooling
- Test with different connection pool sizes
- Observe the impact on concurrent request handling

### 5. Partitioning
- Partition large tables (e.g., orders by date)
- Measure query performance improvements

### 6. Caching Strategies
- Implement query result caching
- Measure cache hit rates and latency improvements

## Metrics to Monitor

- **db_read_latency**: Time for SELECT queries
- **db_write_latency**: Time for INSERT/UPDATE queries
- **db_join_latency**: Time for complex JOIN queries
- **http_req_duration**: Overall API response time
- **errors**: Error rate during load

## Tuning Checklist

- [ ] Baseline performance established
- [ ] Indexes reviewed and optimized
- [ ] Query plans analyzed
- [ ] Connection pooling configured
- [ ] Partitioning strategy implemented
- [ ] Caching layer added (if needed)
- [ ] Monitoring and alerting set up

## Quick Test

After starting the API server, test it manually:

```bash
# Health check
curl http://localhost:3000/health

# Get user
curl http://localhost:3000/api/users/1

# Get order stats
curl http://localhost:3000/api/orders/stats
```

## Next Steps

1. ✅ Database schema created
2. ✅ API server ready
3. Run baseline k6 tests
4. Identify bottlenecks using MySQL slow query log
5. Apply tuning techniques (indexes, query optimization)
6. Re-test and measure improvements
7. Document learnings

## Example API Endpoints (Node.js/Express with MySQL)

```javascript
// Using mysql2 package
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'k6_performance_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET /api/users/:id
app.get('/api/users/:id', async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
  res.json(rows[0]);
});

// GET /api/orders/user/:id
app.get('/api/orders/user/:id', async (req, res) => {
  const [rows] = await pool.execute(`
    SELECT o.*, oi.*, p.product_name 
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.user_id = ?
  `, [req.params.id]);
  res.json(rows);
});

// POST /api/users
app.post('/api/users', async (req, res) => {
  const { username, email, first_name, last_name } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, first_name, last_name) VALUES (?, ?, ?, ?)',
    [username, email, first_name, last_name]
  );
  res.status(201).json({ user_id: result.insertId });
});

// GET /api/orders/stats
app.get('/api/orders/stats', async (req, res) => {
  const [rows] = await pool.execute(`
    SELECT 
      COUNT(*) as total_orders,
      SUM(total_amount) as total_revenue,
      AVG(total_amount) as avg_order_value,
      status,
      DATE(order_date) as order_day
    FROM orders
    GROUP BY status, DATE(order_date)
    ORDER BY order_day DESC
  `);
  res.json(rows);
});
```

## MySQL-Specific Tuning Tips

1. **InnoDB Buffer Pool**: Adjust `innodb_buffer_pool_size` (typically 70-80% of RAM)
2. **Query Cache**: Monitor query cache hit rate (deprecated in MySQL 8.0)
3. **Connection Pooling**: Use connection pooling libraries (mysql2, mysql2/promise)
4. **Index Analysis**: Use `SHOW INDEX FROM table_name` to analyze index usage
5. **Performance Schema**: Enable Performance Schema for detailed metrics
6. **EXPLAIN FORMAT=JSON**: Use JSON format for detailed query analysis

