CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) DEFAULT "General",
price DECIMAL(10,2) DEFAULT 0,
stock_quantity INT DEFAULT 0
);

USE bamazon;
CREATE TABLE departments (
department_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
department_name VARCHAR(50) NOT NULL,
over_head_costs DECIMAL(10,2) DEFAULT 0,
total_sales DECIMAL(10,2) DEFAULT 0
);