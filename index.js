const express = require("express");
// Import and require mysql2
const mysql = require("mysql");
const inquirer = require("inquirer");

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees_db",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("\u263A");
  console.log("---------------------------------");
  console.log("WELCOME TO THE EMPLOYEE DATABASE!");
  console.log("---------------------------------");

  start();
});

// Start function
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Database",
        "Add an employee",
        "Delete an employee",
        "Manage Roles",
        "Manage Departments",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View Database":
          viewDatabase();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Delete an employee":
          deleteEmployee();
          break;

        case "Manage Roles":
          manageRoles();
          break;

        case "Manage Departments":
          manageDepartments();
          break;

        case "Exit":
          console.log("GOODBYE!");
      }
    });
}

function viewDatabase() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to view?",
      choices: [
        "View all employees",
        "View all roles",
        "View all departments",
        "Return to main menu",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View all employees":
          viewAllEmployees();
          break;

        case "View all roles":
          viewAllRoles();
          break;

        case "View all departments":
          viewAllDepartments();
          break;

        case "Return to main menu":
          start();
          break;
      }
    });
}

// View all employees
function viewAllEmployees() {
  db.query(
    "SELECT employees.id AS 'EMPLOYEE ID', employees.first_name AS 'FIRST NAME', employees.last_name AS 'LAST NAME', roles.title AS 'ROLE', departments.name AS 'DEPARTMENT',CONCAT(managers.first_name, ' ', managers.last_name) AS 'MANAGER NAME',roles.salary AS 'SALARY' FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.dept_id = departments.id LEFT JOIN employees AS managers ON employees.manager_id = managers.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

// View all roles
function viewAllRoles() {
  db.query("SELECT * FROM ROLES", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// View all departments
function viewAllDepartments() {
  db.query("SELECT * FROM DEPARTMENTS", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// Add an employee
function addEmployee() {
  // viewAllEmployees();
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: [
          "Sales Lead",
          "Salesperson",
          "Lead Engineer",
          "Software Engineer",
          "Account Manager",
          "Accountant",
          "Legal Team Lead",
          "Lawyer",
        ],
      },
    ])
    .then(function (answer) {
      let roleId;
      switch (answer.role) {
        case "Sales Lead":
          roleId = 1;
          break;
        case "Salesperson":
          roleId = 2;
          break;
        case "Lead Engineer":
          roleId = 3;
          break;
        case "Software Engineer":
          roleId = 4;
          break;
        case "Account Manager":
          roleId = 5;
          break;
        case "Accountant":
          roleId = 6;
          break;
        case "Legal Team Lead":
          roleId = 7;
          break;
        case "Lawyer":
          roleId = 8;
          break;
        default:
          roleId = null;
      }

      db.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: roleId,
        },
        function (err) {
          if (err) throw err;
          console.log("-----------------");
          console.log("Employee added!");
          console.log("-----------------");
          start();
        }
      );
    });
}

// Delete an employee
function deleteEmployee() {
  inquirer
    .prompt([
      {
        name: "employeeDelete",
        type: "input",
        message:
          "What is the ID number of the employee you would like to delete?",
      },
    ])
    .then(function (answer) {
      db.query(
        "DELETE FROM employees WHERE ?",
        {
          id: answer.employeeDelete,
        },
        function (err) {
          if (err) throw err;
          console.log("-----------------");
          console.log("Employee deleted!");
          console.log("-----------------");
          start();
        }
      );
    });
}

// Manage roles
function manageRoles() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add a role", "Delete a role", "Return to main menu"],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add a role":
          addRole();
          break;

        case "Delete a role":
          deleteRole();
          break;

        case "Return to main menu":
          start();
          break;
      }
    });
}

// Add a role
function addRole() {
  let departments = [];

  // Query existing departments
  db.query("SELECT name FROM departments", (err, res) => {
    if (err) throw err;

    departments = res.map(department => department.name);
    departments.push("Add a new department");

    // Prompt for role information
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the role's title?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the role's salary?",
        },
        {
          name: "department",
          type: "list",
          message: "What department does the role belong to?",
          choices: departments,
        },
      ])
      .then((answer) => {
        if (answer.department === "Add a new department") {
          // Prompt for new department name
          inquirer
            .prompt({
              name: "newDepartment",
              type: "input",
              message: "What is the name of the new department?",
            })
            .then((departmentAnswer) => {
              // Insert new department into database
              db.query(
                "INSERT INTO departments (name) VALUES (?)",
                [departmentAnswer.newDepartment],
                (err) => {
                  if (err) throw err;

                  console.log("New role added successfully.");
                }
              );
            });
        } else {
          // Insert new role into database
          db.query(
            "INSERT INTO roles (title, salary, dept_id) SELECT ?, ?, id FROM departments WHERE name = ?",
            [answer.title, answer.salary, answer.department],
            (err) => {
              if (err) throw err;

              console.log("New role added successfully.");
              start();
            }
          );
        }
      });
  });
}



// Delete a role
function deleteRole() {

  inquirer
    .prompt([
      {
        name: "roleDelete",
        type: "input",
        message: "What is the ID number of the role you would like to delete?",
      },
    ])
    .then(function (answer) {
      db.query(
        "DELETE FROM roles WHERE ?",
        {
          id: answer.roleDelete,
        },
        function (err) {
          if (err) throw err;
          console.log("-----------------");
          console.log("Role deleted!");
          console.log("-----------------");
          start();
        }
      );
    });
}

// Manage departments
function manageDepartments() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add a department", "Delete a department", "Return to main menu"],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add a department":
          addDepartment();
          break;

        case "Delete a department":
          deleteDepartment();
          break;

        case "Return to main menu":
          start();
          break;
      }
    });
}

// Add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "deptName",
        type: "input",
        message: "What is the name of the department?",
      },
    ])
    .then(function (answer) {
      db.query(
        "INSERT INTO departments SET ?",
        {
          name: answer.deptName,
        },
        function (err) {
          if (err) throw err;
          console.log("-----------------");
          console.log("Department added!");
          console.log("-----------------");
          start();
        }
      );
    });
}
