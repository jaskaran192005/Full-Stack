const readline = require('readline');

// Employee array
let employees = [];

// Setup readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Show menu
function showMenu() {
    console.log('\n--- Employee Management System ---');
    console.log('1. Add Employee');
    console.log('2. List Employees');
    console.log('3. Remove Employee');
    console.log('4. Exit');
    rl.question('Choose an option: ', handleMenu);
}

// Handle menu input
function handleMenu(option) {
    switch(option.trim()) {
        case '1':
            addEmployee();
            break;
        case '2':
            listEmployees();
            break;
        case '3':
            removeEmployee();
            break;
        case '4':
            console.log('Exiting...');
            rl.close();
            break;
        default:
            console.log('Invalid option. Try again.');
            showMenu();
    }
}

// Add new employee
function addEmployee() {
    rl.question('Enter Employee Name: ', (name) => {
        rl.question('Enter Employee ID: ', (id) => {
            employees.push({ name, id });
            console.log(`Employee ${name} added successfully!`);
            showMenu();
        });
    });
}

// List all employees
function listEmployees() {
    console.log('\n--- Employee List ---');
    if (employees.length === 0) {
        console.log('No employees found.');
    } else {
        employees.forEach((emp, index) => {
            console.log(`${index + 1}. Name: ${emp.name}, ID: ${emp.id}`);
        });
    }
    showMenu();
}

// Remove employee by ID
function removeEmployee() {
    rl.question('Enter Employee ID to remove: ', (id) => {
        const index = employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
            const removed = employees.splice(index, 1);
            console.log(`Employee ${removed[0].name} removed successfully!`);
        } else {
            console.log('Employee not found.');
        }
        showMenu();
    });
}

// Start the app
showMenu();
