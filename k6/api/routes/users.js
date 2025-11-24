const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /api/users/:id - Simple read operation
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users - Write operation
router.post('/', async (req, res) => {
  try {
    const { username, email, first_name, last_name } = req.body;
    
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, first_name, last_name) VALUES (?, ?, ?, ?)',
      [username, email, first_name || null, last_name || null]
    );
    
    res.status(201).json({
      user_id: result.insertId,
      username,
      email,
      message: 'User created successfully'
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users - Get all users (optional endpoint)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const [rows] = await pool.execute(
      'SELECT * FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

