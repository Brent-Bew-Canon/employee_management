const mysql = require('mysql2');
const inquirer = require('inquirer');
const construct = require('./constructor')

let reply

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

const updateRole = []

// Connection to access mysql database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fY-6^uC-2^wK-9)eW-9^hZ-6(',
    database: 'management'
});


async function init() {
    try {

        // prompts the user on specific actions like "View All Departments", etc.
        const response = await inquirer.prompt(prompts)

        // switch statement to address each selection of actions from the main prompt
        switch (response.selection) {
            case "Add Employee":
                connection.query('SELECT * FROM role', async function (err, results) {
                    if (err) {
                        throw err
                    }

                    // maps over the roles to save/display them as an inquirer prompt
                    let listRoles = results.map(function (roles) {
                        return {
                            name: roles.title,
                            value: roles.id
                        }
                    })
                    addEmployee.push({
                        type: 'list',
                        message: 'What\'s the employee\'s role?',
                        choices: listRoles,
                        name: 'roleId'
                    })

                    connection.query('SELECT * FROM employee', async function (err, list) {
                        if (err) {
                            throw err
                        }

                        // maps over the employee names to save/display them as an inquirer prompt
                        let listMan = list.map(function (man) {
                            return {
                                name: `${man.first_name}  ${man.last_name}`,
                                value: man.id
                            }
                        })
                        addEmployee.push({
                            type: 'list',
                            message: 'Whose the employee\'s manager?',
                            choices: listMan,
                            name: 'managerId'
                        })

                        //gives the new prompt to add an employee
                        reply = await inquirer.prompt(addEmployee)
                        let employ = new construct.Employee(reply.firstName, reply.lastName, reply.roleId, reply.managerId);

                        //inserts user input into the myql database
                        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employ.fName}', '${employ.lName}', ${employ.roleId}, ${employ.managerId});`)

                        //displays all the employees in a table
                        connection.query('SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.name AS department, role.salary as salary, employee.manager_id as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id;', function (err, results) {
                            console.table(results)
                            init()
                        })
                    })
                })
                break;

            case "Add Department":

                //gives prompt to add department
                reply = await inquirer.prompt(addDepartment)
                let dept = new construct.Department(reply.name);

                //inserts user input into the mysql database
                connection.query(`INSERT INTO department (name) VALUES ('${dept.name}');`)

                //dipslays all the departments in a table
                connection.query('SELECT * FROM department', function (err, results) {
                    console.table(results)
                    init()
                })
                break;

            case "Add Role":
                connection.query('SELECT * FROM department', async function (err, results) {
                    if (err) {
                        throw err;
                    }

                    // maps over the departments to save/display department names as inquirer prompt
                    let listDep = results.map(function (department) {
                        return {
                            name: department.name,
                            value: department.id
                        }
                    })
                    addRole.push({
                        type: 'list',
                        message: 'What\'s the department ID?',
                        choices: listDep,
                        name: 'departmentId'
                    })

                    //gives the inquierer prompt to add a new role
                    reply = await inquirer.prompt(addRole)
                    let role = new construct.Role(reply.title, reply.salary, reply.departmentId);

                    //inserts user input into the mysql database
                    connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${role.title}', ${role.salary}, ${role.departmentId});`)

                    //displays all the roles fromd database
                    connection.query('SELECT * FROM role', function (err, results) {
                        console.table(results)
                        init()
                    })
                })
                break;

            case "Update Employee Role":
                connection.query('SELECT * FROM employee', async function (err, results) {
                    if (err) {
                        throw err
                    }

                    //maps over the eomployee names to save/display names as inquirer prompt
                    let listEmp = results.map(function (emp) {
                        return {
                            name: `${emp.first_name}  ${emp.last_name}`,
                            value: emp.id
                        }
                    })

                    updateRole.push({
                        type: 'list',
                        message: 'Which employee would you like to update?',
                        choices: listEmp,
                        name: 'empId'
                    })

                    connection.query(`SELECT * FROM role`, async function (err, roles) {
                        if (err) {
                            throw err;
                        }

                        //maps over the roles to save/display role titles as inquirer prompt
                        let listRole = roles.map(function (role) {
                            return {
                                name: role.title,
                                value: role.id
                            }
                        })

                        updateRole.push({
                            type: 'list',
                            message: 'What\'s the employee\'s new role ID?',
                            choices: listRole,
                            name: 'newRole'
                        })

                        //gives inquirer prompt to update a role
                        reply = await inquirer.prompt(updateRole)

                        //inserts user input into the database to update role
                        connection.query(`UPDATE employee SET role_id = ${reply.newRole} WHERE id = ${reply.empId}`)
                        init()
                    })
                })
                break;

            case "View All Employees":

                //queries the database and displays all the employees
                connection.query('SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.name AS department, role.salary as salary, employee.manager_id as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id;', function (err, results) {
                    if (err) {
                        throw err;
                    }
                    console.table(results)
                    init();
                })
                break;

            case "View All Departments":

                //queries the database and displays all the departments
                connection.query('SELECT * FROM department', function (err, results) {
                    if (err) {
                        throw err;
                    }
                    console.table(results)
                    init();
                })
                break;

            case "View All Roles":

                //queries the database and displays all the roles
                connection.query('SELECT role.title AS title, role.id AS role_id, department.name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
                    if (err) {
                        throw err;
                    }
                    console.table(results)
                    init();
                })
                break;

            case "Quit":
                break;

            default:
                console.error("Selection Doesn't Match List");
        }
    }
    catch (error) {
        console.log(error)
    }
}

// Function call to initialize app
init();
