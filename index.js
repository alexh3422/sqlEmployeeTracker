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
    "SELECT employees.id AS 'EMPLOYEE ID', employees.first_name AS 'FIRST NAME', employees.last_name AS 'LAST NAME', roles.title AS 'ROLE', departments.name AS 'DEPARTMENT',CONCAT(managers.first_name, ' ', managers.last_name) AS 'MANAGER NAME',roles.salary AS 'SALARY' FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id LEFT JOIN employees AS managers ON employees.manager_id = managers.id;",
    function (err, res) {
      if (err) throw err;
      if (res.length === 0) {
        console.log("-----------------");
        console.log("No employees found!");
        console.log("------------------");
        start();
      } else {
        console.table(res);
        start();
      }
    }
  );
}

// View all roles
function viewAllRoles() {
  db.query("SELECT * FROM ROLES", function (err, res) {
    if (err) throw err;
    if (res.length === 0) {
      console.log("-----------------");
      console.log("No roles found!");
      console.log("------------------");
      start();
    } else {
      console.table(res);
      start();
    }
  });
}

// View all departments
function viewAllDepartments() {
  db.query("SELECT * FROM DEPARTMENTS", function (err, res) {
    if (err) throw err;
    if (res.length === 0) {
      console.log("----------------------");
      console.log("No departments found!");
      console.log("----------------------");
      start();
    } else {
      console.table(res);
      start();
    }
  });
}

// Add an employee
function addEmployee() {
  let role = [];

  db.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;

    if (res.length === 0) {
      console.log("-----------------");
      console.log("No roles found! Please add a role before adding an employee");
      console.log("------------------");
      start();
      return;
    }

    role = res.map((roles) => roles.title)
    role.push("Add a new role");

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
          choices: role,
        },
      ])
      .then(function (answer) {
        if (answer.role === "Add a new role") {
          inquirer
            .prompt([
              {
                name: "roles",
                type: "input",
                message: "What is the name of the new role?",
              },
              {
                name: "salary",
                type: "input",
                message: "What is the salary of the role? (Please enter a number)",
              },
            ])
            .then(function (answer) {
              db.query(
                "INSERT INTO roles SET ?",
                {
                  title: answer.roles,
                  salary: answer.salary,
                },
                function (err) {
                  if (err) throw err;
                  console.log("-----------------");
                  console.log("Role added!");
                  console.log("-----------------");
                }
              );
            });
          }
          roleID = res.find((roles) => roles.title === answer.roles).id;

          db.query(
            "INSERT INTO employees SET ?",
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: roleID,
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

  db.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;

    if (res.length === 0) {
      console.log("-----------------");
      console.log("No departments found, please add a department before adding a role!");
      console.log("-----------------");
      start();
      return;
    }

    departments = res.map((department) => department.name);
    departments.push("Add a new department");

    inquirer
      .prompt([
        {
          name: "role",
          type: "input",
          message: "What is the name of the role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the role? (Please enter a number)",
        },
        {
          name: "department",
          type: "list",
          message: "What is the role's department?",
          choices: departments,
        },
      ])
      .then(function (answer) {
        if (answer.department === "Add a new department") {
          inquirer
            .prompt([
              {
                name: "newDepartment",
                type: "input",
                message: "What is the name of the new department?",
              },
            ])
            .then(function (answer) {
              db.query(
                "INSERT INTO departments SET ?",
                {
                  name: answer.newDepartment,
                },
                function (err) {
                  if (err) throw err;
                  console.log("-----------------");
                  console.log("Department added!");
                  console.log("-----------------");
                }
              );
            });
        }
        departmentId = res.find(
          (department) => department.name === answer.department
        ).id;

        db.query(
          "INSERT INTO roles SET ?",
          {
            title: answer.role,
            salary: answer.salary,
            dept_id: departmentId,
          },
          function (err) {
            if (err) throw err;
            console.log("-----------------");
            console.log("Role added!");
            console.log("-----------------");
            start();
          }
        );
      });
  });
}


// Delete a role
function deleteRole() {
  db.query("SELECT id, title FROM roles", (err, roles) => {
    if (err) throw err;

    if (roles.length === 0) {
      console.log("There are no roles to delete.");
      start();
      return;
    }

    inquirer
      .prompt([
        {
          name: "roleDelete",
          type: "list",
          message: "Which role would you like to delete?",
          choices: roles.map((role) => role.title),
        },
      ])
      .then(function (answer) {
        const roleToDelete = roles.find(
          (role) => role.title === answer.roleDelete
        );

        db.query(
          "UPDATE employees SET role_id = NULL WHERE role_id = ?",
          [roleToDelete.id],
          (err) => {
            if (err) throw err;

            db.query(
              "DELETE FROM roles WHERE ?",
              {
                id: roleToDelete.id,
              },
              function (err) {
                if (err) throw err;
                console.log("-----------------");
                console.log("Role deleted!");
                console.log("-----------------");
                start();
              }
            );
          }
        );
      });
  });
}

// Manage departments
function manageDepartments() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a department",
        "Delete a department",
        "Return to main menu",
      ],
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

// Delete a department
function deleteDepartment() {
  db.query("SELECT id, name FROM departments", (err, departments) => {
    if (err) throw err;

    if (departments.length === 0) {
      console.log("------------------------------------");
      console.log("There are no departments to delete.");
      console.log("------------------------------------");
      start();
      return;
    }

    inquirer
      .prompt([
        {
          name: "deptDelete",
          type: "list",
          message: "Which department do you want to delete?",
          choices: departments.map((department) => department.name),
        },
      ])
      .then(function (answer) {
        const departmentToDelete = departments.find(
          (department) => department.name === answer.deptDelete
        );

        db.query(
          "UPDATE roles SET dept_id = NULL WHERE dept_id = ?",
          [departmentToDelete.id],
          (err) => {
            if (err) throw err;

            db.query(
              "DELETE FROM departments WHERE ?",
              {
                id: departmentToDelete.id,
              },
              (err) => {
                if (err) throw err;
                console.log("-----------------");
                console.log("Department deleted!");
                console.log("-----------------");
                start();
              }
            );
          }
        );
      });
  });
}
