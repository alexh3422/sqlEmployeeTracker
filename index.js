const express = require("express");
// Import and require mysql2
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoletable = require("console.table");

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
        "Manage Employees",
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

        case "Manage Employees":
          manageEmployees();
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

function manageEmployees() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Select an option below to manage employees",
      choices: [
        "Update an employee's role",
        "Update an employee's manager",
        "Add an employee",
        "Delete an employee",
        "Return to main menu",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Update an employee's role":
          updateRole();
          break;

        case "Update an employee's manager":
          updateManager();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Delete an employee":
          deleteEmployee();
          break;

        case "Return to main menu":
          start();
          break;
      }
    });
}

function updateRole() {
  let employee = [];
  let role = [];

  db.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;

    if (res.length === 0) {
      console.log("-----------------");
      console.log("No employees found!");
      console.log("------------------");
      start();
      return;
    }

    employee = res.map((employees) => employees.first_name);

    db.query("SELECT * FROM roles", function (err, res) {
      if (err) throw err;

      if (res.length === 0) {
        console.log("-----------------");
        console.log("No roles found!");
        console.log("------------------");
        start();
        return;
      }

      role = res.map((roles) => roles.title);

      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee would you like to update?",
            choices: employee,
          },
          {
            name: "role",
            type: "list",
            message: "What is the employee's new role?",
            choices: role,
          },
        ])
        .then(function (answer) {
          db.query(
            "UPDATE employees SET role_id = (SELECT id FROM roles WHERE title = ?) WHERE first_name = ?",
            [answer.role, answer.employee],
            function (err, res) {
              if (err) throw err;
              console.log("Employee updated!");
              start();
            }
          );
        });
    });
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
  db.query(
    "SELECT roles.id AS 'ROLE ID', roles.title AS 'ROLE NAME', roles.salary AS 'SALARY', departments.name AS 'DEPARTMENT NAME' FROM roles JOIN departments ON roles.dept_id = departments.id",
    function (err, res) {
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
    }
  );
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

    role = res.map((roles) => roles.title);
    role.push("Add a new role");

    let roleID;

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
      .then(async function (answer) {
        if (answer.role === "Add a new role") {
          const newRoleAnswers = await inquirer.prompt([
            {
              name: "roles",
              type: "input",
              message: "What is the name of the new role?",
            },
            {
              name: "salary",
              type: "input",
              message:
                "What is the salary of the role? (Please enter a number)",
            },
          ]);

          db.query(
            "INSERT INTO roles SET ?",
            {
              title: newRoleAnswers.roles,
              salary: newRoleAnswers.salary,
            },
            function (err, insertedRole) {
              if (err) throw err;
              console.log("-----------------");
              console.log("Role added!");
              console.log("-----------------");

              db.query(
                "SELECT * FROM roles WHERE id = ?",
                insertedRole.insertId,
                function (err, newRole) {
                  if (err) throw err;

                  db.query(
                    "INSERT INTO employees SET ?",
                    {
                      first_name: answer.firstName,
                      last_name: answer.lastName,
                      role_id: newRole[0].id,
                    },
                    function (err) {
                      if (err) throw err;

                      console.log("-----------------");
                      console.log("Employee added!");
                      console.log("-----------------");
                      start();
                    }
                  );
                }
              );
            }
          );
        } else {
          const selectedRole = res.find((roles) => roles.title === answer.role);
          if (selectedRole) {
            roleID = selectedRole.id;
          }

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
        }
      });
  });
}

// Delete an employee
function deleteEmployee() {
  let employees = [];

  db.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;

    employees = res.map(
      (employee) => employee.first_name + " " + employee.last_name
    );

    inquirer

      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee would you like to delete?",
          choices: employees,
        },
      ])
      .then(function (answer) {
        const selectedEmployee = res.find(
          (employee) =>
            employee.first_name + " " + employee.last_name === answer.employee
        );

        db.query(
          "UPDATE employees SET manager_id = NULL WHERE manager_id = ?",
          selectedEmployee.id,
          function (err) {
            if (err) throw err;
          }
        );

        db.query(
          "DELETE FROM employees WHERE id = ?",
          selectedEmployee.id,
          function (err) {
            if (err) throw err;

            console.log("-----------------");
            console.log("Employee deleted!");
            console.log("-----------------");
            start();
          }
        );
      });
  });
}

// Manage roles
function manageRoles() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a role",
        "Delete a role",
        "Update a role's department",
        "Return to main menu",
      ],
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

        case "Update a role's department":
          updateRoleDepartment();
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
      console.log(
        "No departments found, please add a department before adding a role!"
      );
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
        let departmentId = res.find(
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

function updateManager() {
  db.query(
    "SELECT id, first_name, last_name FROM employees",
    (err, employees) => {
      if (err) throw err;
      if (employees.length === 0) {
        console.log("There are no employees to update.");
        start();
        return;
      }
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee would you like to update?",
            choices: employees.map(
              (employee) => employee.first_name + " " + employee.last_name
            ),
          },
          {
            name: "manager",
            type: "list",
            message: "Who is the employee's new manager?",
            choices: employees.map(
              (employee) => employee.first_name + " " + employee.last_name
            ),
          },
        ])
        .then(function (answer) {
          const employeeToUpdate = employees.find(
            (employee) =>
              employee.first_name + " " + employee.last_name === answer.employee
          );
          const managerToUpdate = employees.find(
            (employee) =>
              employee.first_name + " " + employee.last_name === answer.manager
          );
          db.query(
            "UPDATE employees SET manager_id = ? WHERE id = ?",
            [managerToUpdate.id, employeeToUpdate.id],
            (err) => {
              if (err) throw err;
              console.log("-----------------");
              console.log("Employee updated!");
              console.log("-----------------");
              start();
            }
          );
        });
    }
  );
}

function updateRoleDepartment() {
  let roles = [];
  let departments = [];

  db.query("SELECT * FROM roles", function (err, rolesResult) {
    if (err) throw err;

    roles = rolesResult.map((roles) => roles.title);

    db.query("SELECT * FROM departments", function (err, departmentsResult) {
      if (err) throw err;

      departments = departmentsResult.map((departments) => departments.name);

      inquirer
        .prompt([
          {
            name: "role",
            type: "list",
            message: "Which role's department would you like to change?",
            choices: roles,
          },
          {
            name: "department",
            type: "list",
            message: "Which department would you like to add to the role?",
            choices: departments,
          },
        ])
        .then(function (answer) {
          const selectedRole = rolesResult.find(
            (roles) => roles.title === answer.role
          );

          const selectedDepartment = departmentsResult.find(
            (departments) => departments.name === answer.department
          );

          db.query(
            "UPDATE roles SET dept_id = ? WHERE id = ?",
            [selectedDepartment.id, selectedRole.id],
            function (err) {
              if (err) throw err;

              console.log("-----------------");
              console.log("Role updated!");
              console.log("-----------------");
              start();
            }
          );
        });
    });
  });
}
