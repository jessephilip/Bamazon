// import mysql
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// import password for connection
var password = require("./keys.js");

// set up connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password.password,
    database: 'bamazon'
});

// show ids, names, and prices
var tableHeader = ["ID", "Product", "Price"];
var colWidthArray = [10, 50, 20];

function getAll() {
    connection.query("SELECT * FROM products", function (error, result) {
        var list = [];
        if (error) throw error;
        createTable(tableHeader, result);
        for (var i = 0; i < result.length; i++) {
            list.push([
                result[i].item_id,
                result[i].product_name,
                result[i].department_name,
                result[i].price,
                result[i].stock_quantity
            ]);
        }
        whichItem(list);
    });
}

function endConnection() {
    connection.end();
}

function createTable(headArray, inputArray) {

    var table = new Table({
        head: headArray,
        colWidths: colWidthArray
    });

    for (var i = 0; i < inputArray.length; i++) {
        table.push([
            inputArray[i].item_id,
            inputArray[i].product_name,
            inputArray[i].price
        ]);
    }

    console.log(table.toString());
}

function whichItem(list) {
    inquirer.prompt([{
        type: "input",
        name: "item",
        message: "Which item would you like to purchase? Type its ID number to select it.",
        validate: function (string) {
            var test = parseInt(string);
            if (isNaN(test)) return false;
            else return true;
        }
    }]).then(function (itemId) {
        var chosenItem = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i][0] == itemId.item) chosenItem = list[i];
        }
        howManyToBuy(chosenItem);
    });
}

function howManyToBuy(chosenItem) {
    var name = chosenItem[1];
    var price = chosenItem[3];
    var totalQuantity = chosenItem[4];

    inquirer.prompt([{
        type: "input",
        name: "amount",
        message: "How many " + name + "s would you like to buy?",
        validate: function (string) {
            var test = parseInt(string);
            if (isNaN(test)) return false;
            else return true;
        }
    }]).then(function (amountData) {
        var amount = price * amountData.amount;
        if (parseInt(amountData.amount) > totalQuantity) {
            console.log("We do not have that many " + name + "s in stock.");
            endConnection();
        } else {
            var remaining = totalQuantity - parseInt(amountData.amount);
            updateQuantity(chosenItem, remaining);
            updateSales(chosenItem, parseInt(amountData.amount));
            console.log("OK. The total is " + amount + ". Thank you for your wheelage.");
        }
    });
}

function getQuantity(id) {
    connection.query("SELECT stock_quantity FROM products WHERE item_id = " + id, function (error, result) {
        return result;
    });
}

function getItemName(id) {
    connection.query("SELECT product_name FROM products WHERE item_id = " + id, function (error, result) {
        return result;
    });
}

function updateQuantity(item, number) {
    var id = parseInt(item[0]);
    number = parseInt(number);
    connection.query("UPDATE products SET stock_quantity = " + number + " WHERE item_id = " + id + ";", function (error, result) {
        if (error) throw error;
    });
}

function updateSales(itemObject, sold) {
    var id = itemObject[0];
    connection.query("SELECT department_name FROM products WHERE item_id = " + id + ";", function (error, idResults) {
        var department = '"' + idResults[0].department_name + '"';

        connection.query("SELECT total_sales FROM departments WHERE department_name = " + department, function (error, salesResults) {
            var currentSales = salesResults[0].total_sales;
            var amount = (sold * itemObject[3]) + currentSales;

            connection.query("UPDATE departments SET total_sales = " + amount + " WHERE department_name = " + department + ";", function (error, departmentResults) {
                if (error) throw error;
                endConnection();
            });
        });



    });
}

// startup code
getAll();