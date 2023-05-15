const conn = require('./connection')
const main = require('../index')

class Table {
    constructor() { }
    showEmp() {
        conn.query('SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.name AS department, role.salary as salary, employee.manager_id as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id;', function (err, results) {
            console.table(results)
            main.init()
        })
    };
    showDep() {
        conn.query('SELECT * FROM department', function (err, results) {
            if (err) {
                throw err;
            }
            console.table(results)
            main.init();
        })
    };
    showRole() {
        conn.query('SELECT role.title AS title, role.id AS role_id, department.name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
            if (err) {
                throw err;
            }
            console.table(results)
            main.init();
        })
    }
}

class Employee extends Table {
    constructor(fName, lName, roleId, managerId) {
        super();
        this.fName = fName;
        this.lName = lName;
        this.roleId = roleId;
        this.managerId = managerId;
    }
}

class Role extends Table {
    constructor(title, salary, departmentId) {
        super();
        this.title = title;
        this.salary = salary;
        this.departmentId = departmentId;
    }
}

class Department extends Table {
    constructor(name) {
        super();
        this.name = name;
    }
}


module.exports = { Table, Employee, Role, Department };

