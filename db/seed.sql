

INSERT INTO department (name)
VALUES ("Finance"),
       ("Accounting"),
       ("Marketing"),
       ("Operations"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("VP Finance", 100000, 1),
        ("Lead Accountant", 150000, 2),
        ("Foreman", 80000, 4);


INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Smith", 1),
       ("Bob", "Builder", 2),
       ("George", "Washington", NULL);

       