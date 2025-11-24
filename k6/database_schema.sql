-- Simple E-commerce Database Schema for k6 Performance Testing
-- This schema is designed to help learn database tuning with k6 load testing
-- MySQL Workbench Compatible

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS k6_performance_db;
-- USE k6_performance_db;

-- Users table (OLTP - transactional data)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active TINYINT(1) DEFAULT 1,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table (must be created before products due to foreign key)
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_category_id (category_id),
    INDEX idx_product_name (product_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date),
    INDEX idx_user_status (user_id, status),
    INDEX idx_date_status (order_date, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table (junction table)
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Full-text search index for MySQL
-- CREATE FULLTEXT INDEX idx_products_name_search ON products(product_name, description);

-- Sample data insertion (for testing)
-- Insert sample categories
INSERT INTO categories (category_name) VALUES 
    ('Electronics'),
    ('Clothing'),
    ('Books'),
    ('Home & Garden');

-- Insert sample products
INSERT INTO products (product_name, description, price, stock_quantity, category_id) VALUES
    ('Laptop', 'High-performance laptop', 999.99, 50, 1),
    ('Smartphone', 'Latest smartphone model', 699.99, 100, 1),
    ('T-Shirt', 'Cotton t-shirt', 19.99, 200, 2),
    ('Database Design Book', 'Guide to database design', 49.99, 30, 3),
    ('Garden Tools', 'Complete garden tool set', 79.99, 40, 4);

-- Insert sample users
INSERT INTO users (username, email, first_name, last_name) VALUES
    ('john_doe', 'john@example.com', 'John', 'Doe'),
    ('jane_smith', 'jane@example.com', 'Jane', 'Smith'),
    ('bob_wilson', 'bob@example.com', 'Bob', 'Wilson');

