const conn = require('./connection')
const main = require('../index')

class Table {
    constructor() { }
    showEmp() {
        conn.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;`, function (err, results) {
            if (err) {
                throw err;
            }
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

