-- SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.name AS department, role.salary as salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
-- FROM employee 
-- JOIN role 
-- ON employee.role_id = role.id 
-- JOIN department 
-- ON department.id = role.department_id
-- JOIN employee 
-- ON employee.manager_id = employee.id;


SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;
