// import mysql
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// Global Variable
var tableHeader = ["ID", "Product", "Department", "Price", "Quantity"];

// import password for connection
var password = require("./keys.js");

// set up connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password.password,
    database: 'bamazon'
});

function getAll() {
    connection.query("SELECT * FROM products", function (error, result) {
        if (error) throw error;
        console.log("result", result);
        createTable(tableHeader, result);
        endConnection();
    });
}

function endConnection() {
    connection.end();
}

function createTable(headArray, inputArray) {
    var colWidthArray = [];
    for (var i = 0; i < tableHeader.length; i++) {
        colWidthArray.push(20);
    }

    var table = new Table({
        head: headArray,
        colWidths: colWidthArray
    });

    for (var i = 0; i < inputArray.length; i++) {
        table.push([
            inputArray[i].item_id,
            inputArray[i].product_name,
            inputArray[i].department_name,
            inputArray[i].price,
            inputArray[i].stock_quantity
        ]);
    }

    console.log(table.toString());
}

getAll();