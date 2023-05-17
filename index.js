const inquirer = require('inquirer');
const construct = require('./js/constructor')
const conn = require('./js/connection')
const pmpt = require('./js/prompts')
let reply

async function init() {
    try {

        // prompts the user on specific actions like "View All Departments", etc.
        const response = await inquirer.prompt(pmpt.prompts)

        // switch statement to address each selection of actions from the main prompt
        switch (response.selection) {
            case "Add Employee":
                addEmpl();
                break;

            case "Add Department":
                addDep();
                break;

            case "Add Role":
                addRole();
                break;

            case "Update Employee Role":
                updateEmployee();
                break;

            case "View All Employees":

                //queries the database and displays all the employees
                let table = new construct.Table();
                table.showEmp();
                break;

            case "View All Departments":

                //queries the database and displays all the departments
                let dep = new construct.Table();
                dep.showDep();
                break;

            case "View All Roles":

                //queries the database and displays all the roles
                let role = new construct.Table();
                role.showRole();
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

//Function call to initialize app
init();

function addEmpl() {
    conn.query('SELECT * FROM role', async function (err, results) {
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
        pmpt.addEmployee.push({
            type: 'list',
            message: 'What\'s the employee\'s role?',
            choices: listRoles,
            name: 'roleId'
        })

        conn.query('SELECT * FROM employee', async function (err, list) {
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
            pmpt.addEmployee.push({
                type: 'list',
                message: 'Whose the employee\'s manager?',
                choices: listMan,
                name: 'managerId'
            })

            //gives the new prompt to add an employee
            reply = await inquirer.prompt(pmpt.addEmployee)
            let employ = new construct.Employee(reply.firstName, reply.lastName, reply.roleId, reply.managerId);

            //inserts user input into the myql database
            conn.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employ.fName}', '${employ.lName}', ${employ.roleId}, ${employ.managerId});`)

            //displays all the employees in a table
            employ.showEmp();
        })
    })
}

async function addDep() {
    //gives prompt to add department
    reply = await inquirer.prompt(pmpt.addDepartment)
    let dept = new construct.Department(reply.name);

    //inserts user input into the mysql database
    conn.query(`INSERT INTO department (name) VALUES ('${dept.name}');`)

    //dipslays all the departments in a table
    dept.showDep();
}

function addRole() {
    conn.query('SELECT * FROM department', async function (err, results) {
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
        pmpt.addRole.push({
            type: 'list',
            message: 'What\'s the department ID?',
            choices: listDep,
            name: 'departmentId'
        })

        //gives the inquierer prompt to add a new role
        reply = await inquirer.prompt(pmpt.addRole)
        let role = new construct.Role(reply.title, reply.salary, reply.departmentId);

        //inserts user input into the mysql database
        conn.query(`INSERT INTO role (title, salary, department_id) VALUES ('${role.title}', ${role.salary}, ${role.departmentId});`)

        //displays all the roles fromd database
        role.showRole();
    })
}

function updateEmployee() {
    conn.query('SELECT * FROM employee', async function (err, results) {
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

        pmpt.updateRole.push({
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: listEmp,
            name: 'empId'
        })

        conn.query(`SELECT * FROM role`, async function (err, roles) {
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
            pmpt.updateRole.push({
                type: 'list',
                message: 'What\'s the employee\'s new role ID?',
                choices: listRole,
                name: 'newRole'
            })

            //gives inquirer prompt to update a role
            reply = await inquirer.prompt(pmpt.updateRole)

            //inserts user input into the database to update role
            conn.query(`UPDATE employee SET role_id = ${reply.newRole} WHERE id = ${reply.empId}`)
            init()
        })
    })
}

module.exports.init = init;