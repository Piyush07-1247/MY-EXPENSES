// Function to navigate from homepage to dashboard
function enterWebsite() {
    document.getElementById('homepage').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

// Function to show the month page
function showMonthPage() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('monthPage').classList.remove('hidden');
}

// Function to save the ideal budgets entered by the user
function saveBudgets() {
    const rentBudget = document.getElementById('rent-ideal').value;
    const foodBudget = document.getElementById('food-ideal').value;
    const healthBudget = document.getElementById('health-ideal').value;

    localStorage.setItem('rent-ideal', rentBudget);
    localStorage.setItem('food-ideal', foodBudget);
    localStorage.setItem('health-ideal', healthBudget);

    alert('Budgets saved!');

    displayBudgets();  // Display the saved budgets on cards
    document.getElementById('budget-form').classList.add('hidden');
    document.getElementById('category-cards').classList.remove('hidden');
}

// Function to load and display the budgets
function displayBudgets() {
    const rentBudget = localStorage.getItem('rent-ideal') || 0;
    const foodBudget = localStorage.getItem('food-ideal') || 0;
    const healthBudget = localStorage.getItem('health-ideal') || 0;

    document.getElementById('rent-ideal-display').innerText = rentBudget;
    document.getElementById('food-ideal-display').innerText = foodBudget;
    document.getElementById('health-ideal-display').innerText = healthBudget;

    updateMoneyLeft('rent');
    updateMoneyLeft('food');
    updateMoneyLeft('health');
}

// Function to update money left for each category
function updateMoneyLeft(category) {
    const idealBudget = localStorage.getItem(`${category}-ideal`) || 0;
    const moneySpent = localStorage.getItem(`${category}-spent`) || 0;
    document.getElementById(`${category}-spent`).innerText = moneySpent;
    document.getElementById(`${category}-left`).innerText = idealBudget - moneySpent;
}

// Function to open a specific category and enter expenses
function openCategory(category) {
    document.getElementById('monthPage').classList.add('hidden');
    document.getElementById('categoryPage').classList.remove('hidden');
    document.getElementById('category-title').innerText = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Show the ideal budget for the category
    document.getElementById('spent-amount').setAttribute('data-category', category);
}

// Function to save the expense entered by the user
function saveExpense() {
    const category = document.getElementById('spent-amount').getAttribute('data-category');
    const spentAmount = document.getElementById('spent-amount').value;
    const description = document.getElementById('description').value;

    // Get current spent amount and update
    let currentSpent = parseFloat(localStorage.getItem(`${category}-spent`) || 0);
    currentSpent += parseFloat(spentAmount);
    localStorage.setItem(`${category}-spent`, currentSpent);

    // Create a new expense entry in the expenses section
    const expenseDetails = `${description}: $${spentAmount}`;
    const expenseDiv = document.createElement('div');
    expenseDiv.innerText = expenseDetails;

    // Add edit button for the expense
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.onclick = () => editExpense(category, expenseDiv, spentAmount);
    expenseDiv.appendChild(editButton);
    
    // Append to the respective category's expense list
    document.getElementById(`${category}-expenses`).appendChild(expenseDiv);
    
    // Reset form fields
    document.getElementById('spent-amount').value = '';
    document.getElementById('description').value = '';
    
    updateMoneyLeft(category);  // Update money left for the category
}

// Function to handle editing an expense
function editExpense(category, expenseDiv, oldSpentAmount) {
    const newAmount = prompt("Enter new amount spent:", oldSpentAmount);
    const newDescription = prompt("Enter new description:", expenseDiv.innerText.replace(/:.*$/, ''));

    if (newAmount !== null && newDescription !== null) {
        // Update local storage
        const oldSpent = parseFloat(localStorage.getItem(`${category}-spent`) || 0);
        const difference = parseFloat(newAmount) - parseFloat(oldSpentAmount);
        const updatedSpent = oldSpent + difference;

        localStorage.setItem(`${category}-spent`, updatedSpent);
        expenseDiv.innerText = `${newDescription}: $${newAmount}`;
        
        // Add edit button again after editing
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.onclick = () => editExpense(category, expenseDiv, newAmount);
        expenseDiv.appendChild(editButton);

        updateMoneyLeft(category);  // Update money left after editing
    }
}

// Function to go back to the dashboard
function goBackToDashboard() {
    document.getElementById('monthPage').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

// Function to go back to the home page
function goBackToHome() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('homepage').classList.remove('hidden');
}

// Function to go back to the month page
function goBackToMonthPage() {
    document.getElementById('categoryPage').classList.add('hidden');
    document.getElementById('monthPage').classList.remove('hidden');
}

// Placeholder functions for previous and current months
function showPreviousMonths() {
    alert("Previous month data is under development.");
}

function showCurrentMonth() {
    alert("Current month data is under development.");
}

// Load budgets and expenses on page load
window.onload = function() {
    if (localStorage.getItem('rent-ideal') || localStorage.getItem('food-ideal') || localStorage.getItem('health-ideal')) {
        displayBudgets();
        document.getElementById('category-cards').classList.remove('hidden');
    }
};
