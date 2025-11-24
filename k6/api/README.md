# k6 Performance Testing API

REST API server for database performance testing with k6.

## Quick Start

### 1. Install Dependencies

```bash
cd k6/api
npm install
```

### 2. Configure Environment

Copy `env.example` to `.env` and update with your MySQL credentials:

```bash
# Windows PowerShell
Copy-Item env.example .env

# Or manually create .env file with:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=k6_performance_db
PORT=3000
```

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Get user
curl http://localhost:3000/api/users/1

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","first_name":"Test","last_name":"User"}'
```

## API Endpoints

### Users

- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `GET /api/users` - Get all users (with pagination)

### Orders

- `GET /api/orders/user/:id` - Get all orders for a user (with JOINs)
- `GET /api/orders/stats` - Get order statistics (aggregations)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order

### Health

- `GET /health` - Server health check

## Running k6 Tests

Once the API is running, execute the k6 load test:

```bash
# From the k6 directory
k6 run load_test.js

# Or with custom API URL
k6 run --env API_URL=http://localhost:3000 load_test.js
```

## Project Structure

```
api/
├── config/
│   └── database.js      # MySQL connection pool
├── routes/
│   ├── users.js         # User endpoints
│   └── orders.js        # Order endpoints
├── server.js            # Express server
├── package.json         # Dependencies
└── .env                 # Environment variables (create from env.example)
```

## Troubleshooting

### Database Connection Issues

1. Verify MySQL is running
2. Check credentials in `.env`
3. Ensure database exists: `CREATE DATABASE k6_performance_db;`
4. Run the schema: Execute `database_schema.sql` in MySQL Workbench

### Port Already in Use

Change the `PORT` in `.env` or kill the process using port 3000:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found

Run `npm install` to install all dependencies.

