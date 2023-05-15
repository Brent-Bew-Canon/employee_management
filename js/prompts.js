
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

module.exports = { prompts, addEmployee, addDepartment, addRole, updateRole }