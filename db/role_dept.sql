
-- creates a table with the role and department information and sorts it from highest to lowest salary

USE employees_db

SELECT title AS 'Job Title', salary AS 'Salary', dept_name AS 'Department'
FROM roles
INNER JOIN departments
ON roles.dept_id = departments.dept_id
ORDER BY salary DESC;

