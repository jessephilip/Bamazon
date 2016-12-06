CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100),
price DECIMAL(10,2),
stock_quantity INT
);

USE bamazon;
CREATE TABLE departments (
department_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
department_name VARCHAR(50) NOT NULL,
over_head_costs DECIMAL(10,2),
total_sales INT
);