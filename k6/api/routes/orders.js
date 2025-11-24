const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /api/orders/user/:id - JOIN query (complex read with joins)
router.get('/user/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        o.order_id,
        o.user_id,
        o.order_date,
        o.total_amount,
        o.status,
        oi.order_item_id,
        oi.quantity,
        oi.unit_price,
        oi.subtotal,
        p.product_id,
        p.product_name,
        p.description
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.user_id = ?
      ORDER BY o.order_date DESC`,
      [req.params.id]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/stats - Aggregation query (OLAP-style)
router.get('/stats', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value,
        MIN(total_amount) as min_order_value,
        MAX(total_amount) as max_order_value,
        status,
        DATE(order_date) as order_day
      FROM orders
      GROUP BY status, DATE(order_date)
      ORDER BY order_day DESC, status`
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE order_id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/orders - Create new order (write operation)
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { user_id, items, shipping_address } = req.body;
    
    if (!user_id || !items || items.length === 0) {
      return res.status(400).json({ error: 'user_id and items are required' });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const [productRows] = await connection.execute(
        'SELECT price FROM products WHERE product_id = ?',
        [item.product_id]
      );
      
      if (productRows.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }
      
      const subtotal = productRows[0].price * item.quantity;
      totalAmount += subtotal;
    }
    
    // Insert order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, ?)',
      [user_id, totalAmount, shipping_address || null, 'pending']
    );
    
    const orderId = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      const [productRows] = await connection.execute(
        'SELECT price FROM products WHERE product_id = ?',
        [item.product_id]
      );
      
      const unitPrice = productRows[0].price;
      const subtotal = unitPrice * item.quantity;
      
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, unitPrice, subtotal]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({
      order_id: orderId,
      user_id,
      total_amount: totalAmount,
      message: 'Order created successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;

