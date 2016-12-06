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
var tableHeader = ["ID", "Product", "Department", "Price", "# In Stock"];
var colWidthArray = [10, 30, 20, 20, 20];

function options() {
    inquirer.prompt([{
        type: "list",
        name: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        message: "Choose an option."
    }]).then(function (choice) {

        switch (choice.list) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowQuantity();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            default:
                console.log("Something went wrong.");
        }
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (error, results) {
        createTable(results);
        endConnection();
    });
}

function viewLowQuantity() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (error, results) {
        createTable(results);
        endConnection();
    });
}

function addToInventory() {
    connection.query("SELECT * FROM products", function (error, results) {
        createTable(results);
        inquirer.prompt([{
            type: "input",
            name: "add",
            message: "Type the item ID you wish to add to the inventory.",
            validate: function (string) {
                var test = parseInt(string);
                if (isNaN(test)) return false;
                else return true;
            }
        }]).then(function (increase) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id == increase.add) chosenItem = results[i];
            }
            var name = chosenItem.product_name;
            var id = parseInt(chosenItem.item_id);

            inquirer.prompt([{
                type: "input",
                name: "number",
                message: "Understood. How many " + name + "s do you wish to add to the inventory.",
                validate: function (string) {
                    var test = parseInt(string);
                    if (isNaN(test)) return false;
                    else return true;
                }
            }]).then(function (amount) {
                var number = parseInt(amount.number) + parseInt(chosenItem.stock_quantity);
                connection.query("UPDATE products SET stock_quantity = " + number + " WHERE item_id = " + id + ";", function (error, result) {
                    console.log("Inventory adjusted for " + name + ". Quantity is now " + number + ".");
                    endConnection();
                });
            });
        });
    });
}

function createTable(inputArray) {

    var table = new Table({
        head: tableHeader,
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

function addProduct() {
    inquirer.prompt([{
        type: "input",
        name: "itemName",
        message: "What item do you wish to add?"
    }, {
        type: "input",
        name: "department",
        message: "Which department does this belong in?"
    }, {
        type: "input",
        name: "price",
        message: "How much does this item cost?",
        validate: function (string) {
            var test = parseInt(string);
            if (isNaN(test)) return false;
            else return true;
        }
    }, {
        type: "input",
        name: "quantity",
        message: "How many in stock?",
        validate: function (string) {
            var test = parseInt(string);
            if (isNaN(test)) return false;
            else return true;
        }
    }]).then(function (addedItem) {
        var item = {
            product_name: addedItem.itemName,
            department_name: addedItem.department,
            price: parseFloat(addedItem.price),
            stock_quantity: addedItem.quantity
        }
        connection.query("INSERT INTO products SET ?", item, function (error, result) {
            endConnection();
        });
    });

}

function endConnection() {
    connection.end();
}

// startup Code
options();