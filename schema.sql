CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100),
price DECIMAL(10,2),
stock_quantity INT
);