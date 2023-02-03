# sqlEmployeeTracker

## ABOUT 
This app was created to help employers manage their employee data, allowing them to quickly view lists of employees, their salaries, departments, and their roles/managers.
Stay tuned for future updates as we add functionality to edit current roles salaries, view employees by department as well as being able to look up lists of employees that a certain manager manages. 

## INSTALLATION INSTRUCTIONS
To install this app, clone the this repo at https://github.com/alexh3422/sqlEmployeeTracker to your local machine and follow the steps below. 

(Please note that you must have the MYSQL community server installed and have the server running on your local machine, you can download that from here https://dev.mysql.com/downloads/mysql/ ) 

1. Navigate to the repos ROOT folder using your terminal of choice (you will remain in this root folder in your terninal window throughout the installation and use of this app).

2. Type the command ` npm i ` from the root folder in the terminal to install the required app dependancies. 

3. type ` mysql -u root -p` and press enter. You will be prompted for a password, please use the password that you set during the mysql server installation. If you come across any errors during this step please refer to the mysql server documentation. 

4. Your terminal will now be logged in to your mysql server. Type ` SOURCE ./db/schema.sql; ` and press enter. This will create the database on your local server which is called employees_db as well as populate the database with some common employee roles and departments as well as some default employees which you can change once you have the app running. 


<img width="472" alt="Screenshot 2023-02-02 at 10 42 04 PM" src="https://user-images.githubusercontent.com/115325648/216540450-79ba85c7-4a01-41ed-aef8-bd2b82063f5b.png">

5. type ` quit ` and press enter. This will log your terminal window out of the mysql server and you will be able to resume normal terminal commands. (HINT: you will see the text 'GOODBYE!' upon succesfully logging out of the mysql server on your terminal window after this step is complete) 

6. THIS STEP IS IMPORTANT: Open up this repo on your local machine in your preffered code editor of choice (we recommend VSCODE if you have it but any editor will do) - navigate to the index.js file and on line 18 of the code change the password from "password" to whatever your password you used to log in to the mysql server in step 3. Please make sure it is in-between quotes.



7. Switch back to your terminal window and once again from the root folder of this repo type `node index.js` , You should now see the app opened up in your terminal window! :) 

## USAGE INSTRUCTIONS 

to use the app simply use the arrow keys on your keybaord to navigate through your options, and press enter to select the option you would like. 

## LICENSES 
This app currently has no licensing 


## Contact Us 
If you have any questions, feel free to reach out through our github profile at https://github.com/alexh3422


<img width="1032" alt="Screenshot 2023-02-02 at 10 46 07 PM" src="https://user-images.githubusercontent.com/115325648/216540322-c587cd83-8e5c-48c3-a9da-ec0162dfbd81.png">


