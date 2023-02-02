DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(id),
    KEY (id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    KEY (id)
);

-- INSERT INTO departments (name)
-- VALUES
--     ('Sales'),
--     ('Engineering'),
--     ('Finance'),
--     ('Legal');


-- INSERT INTO roles (title, salary, dept_id)
-- VALUES
-- ('Sales Lead', 100000, 1),
-- ('Salesperson', 80000, 1),
-- ('Lead Engineer', 120000, 2),
-- ('Software Engineer', 100000, 2),
-- ('Accountant', 125000, 3),
-- ('Legal Team Lead', 130000, 4),
-- ('Lawyer', 120000, 4);









