CREATE DATABASE IF NOT EXISTS inventory_db;

USE inventory_db;


-- Products table

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    low_stock_threshold INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Stock transactions table

CREATE TABLE IF NOT EXISTS stock_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    type ENUM('IN', 'OUT') NOT NULL,
    quantity INT NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);


-- Sample products

INSERT INTO products
(name, sku, category, price, quantity, low_stock_threshold)
VALUES
('Laptop', 'LAP001', 'Electronics', 55000.00, 10, 3),
('Keyboard', 'KEY001', 'Electronics', 1500.00, 25, 5),
('Mouse', 'MOU001', 'Electronics', 800.00, 30, 5),
('Monitor', 'MON001', 'Electronics', 12000.00, 8, 2),
('Office Chair', 'CHA001', 'Furniture', 7500.00, 6, 2),
('Desk', 'DSK001', 'Furniture', 10000.00, 4, 2),
('Notebook', 'NOT001', 'Stationery', 100.00, 50, 10),
('Pen', 'PEN001', 'Stationery', 30.00, 100, 20),
('Backpack', 'BAG001', 'Accessories', 2000.00, 15, 3),
('Headphones', 'HDP001', 'Electronics', 2500.00, 12, 3);