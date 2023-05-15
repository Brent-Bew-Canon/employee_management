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
    // {
    //     type: 'input',
    //     message: 'What\'s the employee\'s manager id?',
    //     name: 'managerId'
    // }
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
    // {
    //     type: 'input',
    //     message: 'What\'s the department ID?',
    //     name: 'departmentId'
    // },

]

const updateRole = [
    // {
    //     type: 'input',
    //     message: 'Which employee would you like to update?',
    //     name: 'empId'
    // },
    // {
    //     type: 'input',
    //     message: 'What\'s the employee\'s new role ID?',
    //     name: 'newRole'
    // }
]

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fY-6^uC-2^wK-9)eW-9^hZ-6(',
    database: 'management'
});


async function init() {
    try {
        const response = await inquirer.prompt(prompts)
        switch (response.selection) {
            case "Add Employee":
                connection.query('SELECT * FROM role', async function (err, results) {
                    if (err) {
                        throw err
                    }
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

                        reply = await inquirer.prompt(addEmployee)
                        let employ = new construct.Employee(reply.firstName, reply.lastName, reply.roleId, reply.managerId);

                        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employ.fName}', '${employ.lName}', ${employ.roleId}, ${employ.managerId});`)

                        connection.query('SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.name AS department, role.salary as salary, employee.manager_id as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id;', function (err, results) {
                            console.table(results)
                            init()
                        })
                    })
                })
                break;

            case "Add Department":
                reply = await inquirer.prompt(addDepartment)
                let dept = new construct.Department(reply.name);

                connection.query(`INSERT INTO department (name) VALUES ('${dept.name}');`)

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
                    let listDep = results.map(function (department) {
                        return {
                            name: department.name,
                            value: department.id
                        }
                    })
                    console.log(listDep);
                    addRole.push({
                        type: 'list',
                        message: 'What\'s the department ID?',
                        choices: listDep,
                        name: 'departmentId'
                    })
                    reply = await inquirer.prompt(addRole)
                    console.log(reply);
                    let role = new construct.Role(reply.title, reply.salary, reply.departmentId);
                    connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${role.title}', ${role.salary}, ${role.departmentId});`)
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
                        reply = await inquirer.prompt(updateRole)
                        connection.query(`UPDATE employee SET role_id = ${reply.newRole} WHERE id = ${reply.empId}`)
                        init()
                    })
                })
                break;

            case "View All Employees":
                connection.query('SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.name AS department, role.salary as salary, employee.manager_id as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id;', function (err, results) {
                    console.table(results)
                    init();
                })
                break;

            case "View All Departments":
                connection.query('SELECT * FROM department', function (err, results) {
                    if (err) {
                        throw err;
                    }
                    console.table(results)
                    init();
                })
                break;

            case "View All Roles":
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