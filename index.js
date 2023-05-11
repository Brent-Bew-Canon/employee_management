const mysql = require('mysql2');
const inquirer = require('inquirer');

// Arrays of prompts
const prompts = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"],
        name: 'selection'

    }];

const addEmployee = [
    {
        type: 'input',
        message: 'What\'s the employee\'s first name?',
        name: 'firstName'
    },
    {
        type: 'input',
        message: 'What\'s the employee\'s last name?',
        name: 'lastName'
    },
    {
        type: 'input',
        message: 'What\'s the employee\'s role id?',
        name: 'roleId'
    },
    {
        type: 'input',
        message: 'What\'s the employee\'s manager id?',
        name: 'managerId'
    }
]

const addDepartment = [
    {
        type: 'input',
        message: 'What\'s the Department name?',
        name: 'name'
    }
]

const addRole = [
    {
        type: 'input',
        message: 'What\'s the Role title?',
        name: 'title'
    },
    {
        type: 'input',
        message: 'What\'s the Role salary?',
        name: 'salary'
    }
]

const updateRole = [
    {
        type: 'input',
        message: 'Which employee would you like to update?',
        name: 'title'
    },
    {
        type: 'input',
        message: 'What\'s the employee\'s role?',
        name: 'newRole'
    }
]

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fY-6^uC-2^wK-9)eW-9^hZ-6(',
    database: 'management'
});

//
function init() {
    inquirer
        .prompt(prompts)
        .then((response) => {
            switch (response.selection) {
                case "Add Employee":
                    inquirer.prompt(addEmployee)
                    break;
                case "Add Department":
                    inquirer.prompt(addDepartment)
                    break;
                case "Add Role":
                    inquirer.prompt(addRole)
                    break;
                case "Update Employee Role":
                    inquirer.prompt(updateRole)
                    break;
                case "View All Employees":
                    console.log("heck yeah")
                    connection.query('SELECT * FROM employee', function (err, results, fields) {
                        console.table(results)
                    })
                    console.log('finished')
                    break;
                case "Vew All Departments":

                    break;
                case "Vew All Roles":

                    break;
                default:
                    console.error("Selection Doesn't Match List");
            }
        })
        .catch(err => console.log(err));
}

// Function call to initialize app
init();