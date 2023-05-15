const mysql = require('mysql2');
const inquirer = require('inquirer');
const construct = require('./constructor')

let reply
let quit = false

// Arrays of prompts
const prompts = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
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
    },
    {
        type: 'input',
        message: 'What\'s the department ID?',
        name: 'departmentId'
    }
]

const updateRole = [
    {
        type: 'input',
        message: 'Which employee would you like to update?',
        name: 'empId'
    },
    {
        type: 'input',
        message: 'What\'s the employee\'s new role ID?',
        name: 'newRole'
    }
]

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fY-6^uC-2^wK-9)eW-9^hZ-6(',
    database: 'management'
});


async function init() {
    try {
        while (!quit) {
            const response = await inquirer.prompt(prompts)
            switch (response.selection) {
                case "Add Employee":
                    reply = await inquirer.prompt(addEmployee)
                    let employ = new construct.Employee(reply.firstName, reply.lastName, reply.roleId, reply.managerId);

                    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employ.fName}', '${employ.lName}', ${employ.roleId}, ${employ.managerId});`)

                    connection.query('SELECT * FROM employee', function (err, results) {
                        console.table(results)
                    })
                    break;
                case "Add Department":
                    reply = await inquirer.prompt(addDepartment)
                    let dept = new construct.Department(reply.name);

                    connection.query(`INSERT INTO department (name) VALUES ('${dept.name}');`)

                    connection.query('SELECT * FROM department', function (err, results) {
                        console.table(results)
                    })
                    break;
                case "Add Role":
                    reply = await inquirer.prompt(addRole)
                    let role = new construct.Role(reply.title, reply.salary, reply.departmentId);

                    connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${role.title}', ${role.salary}, ${role.departmentId});`)

                    connection.query('SELECT * FROM role', function (err, results) {
                        console.table(results)
                    })
                    break;
                case "Update Employee Role":
                    reply = await inquirer.prompt(updateRole)
                    connection.query(`UPDATE employee SET role_id = ${reply.newRole} WHERE id = ${reply.empId}`)
                    break;
                case "View All Employees":
                    connection.query('SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.name AS department, role.salary as salary, employee.manager_id as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id;', function (err, results) {
                        console.table(results)
                    })
                    break;
                case "View All Departments":
                    connection.query('SELECT * FROM department', function (err, results) {
                        console.table(results)
                    })
                    break;
                case "View All Roles":
                    connection.query('SELECT role.title AS title, role.id AS role_id, department.name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
                        console.table(results)
                    })
                    break;
                case "Quit":
                    quit = true;
                    break;
                default:
                    console.error("Selection Doesn't Match List");
            }
        }
        console.log("Process Terminated....\n Press Ctrl + C or CMD + C to exit app");
    }
    catch (error) {
        console.log(error)
    }
}

// Function call to initialize app
init();




























//
// function init() {
//     inquirer
//         .prompt(prompts)
//         .then((response) => {
//             switch (response.selection) {
//                 case "Add Employee":
//                     inquirer.prompt(addEmployee)
//                     break;
//                 case "Add Department":
//                     inquirer.prompt(addDepartment)
//                     break;
//                 case "Add Role":
//                     inquirer.prompt(addRole)
//                     break;
//                 case "Update Employee Role":
//                     inquirer.prompt(updateRole)
//                     break;
//                 case "View All Employees":
//                     connection.query('SELECT * FROM employee', function (err, results, fields) {
//                         console.table(results)
//                     })
//                     break;
//                 case "Vew All Departments":

//                     break;
//                 case "Vew All Roles":

//                     break;
//                 default:
//                     console.error("Selection Doesn't Match List");
//             }
//         })
//         .catch(err => console.log(err));
// }