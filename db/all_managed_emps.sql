USE employees_db;

SELECT 
employees.id AS 'Employee ID',
employees.first_name AS 'First Name', 
employees.last_name AS 'Last Name', 
title AS 'Job Title', 
name AS 'Department', 
manager.first_name AS 'Manager First Name', 
manager.last_name AS 'Manager Last Name'
FROM employees
INNER JOIN roles
ON employees.role_id = roles.id
INNER JOIN departments
ON roles.dept_id = departments.id
INNER JOIN employees AS manager
ON employees.manager_id = manager.id 

