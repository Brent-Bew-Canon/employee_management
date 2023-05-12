

class Table {
    constructor(name) {
        this.name = name;
    }

    nap() {
        console.log('Zzzzzzzzz');
    }
}

class Employee {
    constructor(fName, lName, roleId, managerId) {
        this.fName = fName;
        this.lName = lName;
        this.roleId = roleId;
        this.managerId = managerId;
    }
}

class Role {
    constructor(title, salary, departmentId) {
        this.title = title;
        this.salary = salary;
        this.departmentId = departmentId;
    }
}

class Department {
    constructor(name) {
        this.name = name;
    }
}


module.exports = { Table, Employee, Role, Department };

