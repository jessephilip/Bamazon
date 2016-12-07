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
var tableHeader = ["ID", "Department Name", "Over-Head Costs", "Product Sales", "Profit"];
var colWidthArray = [10, 40, 20, 20, 20];

// prompt for View Product Sales or Create New Department
function questions() {
    inquirer.prompt([{
        type: "list",
        name: "list",
        choices: ["View Products Sales by Department", "Create New Department"],
        message: "Choose an option."
    }]).then(function (data) {
        switch (data.list) {
            case "View Products Sales by Department":
                getAll();
                break;

            case "Create New Department":
                createDepartment();
                break;

            default:
                console.log("Something went wrong.");
        }
    });
}

function getAll() {
    connection.query("SELECT * FROM departments", function (error, result) {
        if (error) throw error;
        createTable(result);
    });
}

function createTable(inputArray) {

    var table = new Table({
        head: tableHeader,
        colWidths: colWidthArray
    });

    for (var i = 0; i < inputArray.length; i++) {
        var profit = inputArray[i].total_sales - inputArray[i].over_head_costs;
        table.push([
            inputArray[i].department_id,
            inputArray[i].department_name,
            inputArray[i].over_head_costs,
            inputArray[i].total_sales,
            profit
        ]);
    }

    console.log(table.toString());
    endConnection();
}

function createDepartment() {
    connection.query("SELECT department_name FROM departments", function (err, res) {

        inquirer.prompt([{
            type: "input",
            name: "new",
            message: "Name the new department.",
            validate: function (string) {
                for (var i = 0; i < res.length; i++) {
                    if (string === res[i].department_name) return false;
                    else if (i === res.length - 1 && string !== res[i].department_name) return true;
                }
            }
        }, {
            type: "input",
            name: "overhead",
            message: "How much will it cost to start this department?",
            validate: function (string) {
                var test = parseFloat(string);
                if (isNaN(test) == true) return false;
                else return true;
            }
        }]).then(function (department) {
            var insert = {
                department_name: department.new,
                over_head_costs: parseFloat(department.overhead)
            };
            connection.query("INSERT INTO departments SET ?", insert, function (err, res) {
                if (err) throw err;
                endConnection();

            });
        });
    });
}

function endConnection() {
    connection.end();
}

// startup code
questions();