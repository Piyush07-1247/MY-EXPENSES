// Function to navigate from homepage to monthPage
function enterWebsite() {
    document.getElementById('homepage').classList.add('hidden');
    document.getElementById('monthPage').classList.remove('hidden');
}

// Function to go back to the homepage
function goBackToHomepage() {
    document.getElementById('monthPage').classList.add('hidden');
    document.getElementById('homepage').classList.remove('hidden');
}

// Function to open current month expenses
function openCurrentMonth() {
    document.getElementById('monthPage').classList.add('hidden');
    document.getElementById('categoryPage').classList.remove('hidden');
    document.getElementById('category-title').innerText = "This Month";
    displayCurrentMonthData();
}

// Function to open previous month data
function openPreviousMonth() {
    document.getElementById('monthPage').classList.add('hidden');
    document.getElementById('categoryPage').classList.remove('hidden');
    document.getElementById('category-title').innerText = "Previous Month Data";
    displayPreviousMonthData();
}

// Function to open a new month for input
function openNewMonth() {
    const idealBudget = prompt("Enter your ideal budget for this month:");
    if (idealBudget !== null) {
        const currentMonthKey = getCurrentMonthKey();
        localStorage.setItem(`${currentMonthKey}-rent-ideal`, idealBudget);
        localStorage.setItem(`${currentMonthKey}-food-ideal`, idealBudget);
        localStorage.setItem(`${currentMonthKey}-health-ideal`, idealBudget);
        alert('Budgets saved! Now you can enter your expenses.');
        openCurrentMonth();
    }
}

// Function to get the key for the current month (YYYY-MM)
function getCurrentMonthKey() {
    const currentDate = new Date();
    return currentDate.toISOString().slice(0, 7); // Format YYYY-MM
}

// Function to get the key for the previous month
function getPreviousMonthKey() {
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    return previousMonth.toISOString().slice(0, 7); // Format YYYY-MM
}

// Function to display current month data
function displayCurrentMonthData() {
    const currentMonthKey = getCurrentMonthKey();
    displayBudgetAndSpent('rent', currentMonthKey);
    displayBudgetAndSpent('food', currentMonthKey);
    displayBudgetAndSpent('health', currentMonthKey);
}

// Function to display previous month data
function displayPreviousMonthData() {
    const previousMonthKey = getPreviousMonthKey();
    displayBudgetAndSpent('rent', previousMonthKey);
    displayBudgetAndSpent('food', previousMonthKey);
    displayBudgetAndSpent('health', previousMonthKey);
}

// Function to display budgets and spent values for a specific month
function displayBudgetAndSpent(category, monthKey) {
    const idealBudget = localStorage.getItem(`${monthKey}-${category}-ideal`) || 0;
    const moneySpent = localStorage.getItem(`${monthKey}-${category}-spent`) || 0;

    document.getElementById(`${category}-ideal-display`).innerText = idealBudget;
    document.getElementById(`${category}-spent`).innerText = moneySpent;
    document.getElementById(`${category}-left`).innerText = idealBudget - moneySpent;
}

// Function to open expense entry page
function openExpenseEntry(category) {
    document.getElementById('categoryPage').classList.add('hidden');
    document.getElementById('expenseEntryPage').classList.remove('hidden');
    loadExpenses(category);
}

// Function to load existing expenses for the current month
function loadExpenses(category) {
    const expensesDiv = document.getElementById('expenses');
    expensesDiv.innerHTML = ''; // Clear existing expenses
    const currentMonthKey = getCurrentMonthKey();
    const expenses = JSON.parse(localStorage.getItem(`${currentMonthKey}-${category}-expenses`) || '[]');
    expenses.forEach(expense => {
        expensesDiv.innerHTML += `<p>${expense.description}: $${expense.amount} <button onclick="editExpense('${category}', ${expense.amount}, '${expense.description}')">Edit</button></p>`;
    });
}

// Function to save an expense for the current month
function saveExpense() {
    const category = document.getElementById('category-title').innerText.toLowerCase();
    const spentAmount = document.getElementById('spent-amount').value;
    const description = document.getElementById('description').value;

    if (!spentAmount || !description) {
        alert('Please enter both amount and description.');
        return;
    }

    const currentMonthKey = getCurrentMonthKey();
    const currentSpent = parseFloat(localStorage.getItem(`${currentMonthKey}-${category}-spent`) || 0);
    const newSpent = currentSpent + parseFloat(spentAmount);
    localStorage.setItem(`${currentMonthKey}-${category}-spent`, newSpent);

    // Save expense entry
    const expenses = JSON.parse(localStorage.getItem(`${currentMonthKey}-${category}-expenses`) || '[]');
    expenses.push({ amount: spentAmount, description: description });
    localStorage.setItem(`${currentMonthKey}-${category}-expenses`, JSON.stringify(expenses));

    // Reset input fields
    document.getElementById('spent-amount').value = '';
    document.getElementById('description').value = '';

    // Refresh expenses display
    loadExpenses(category);
    displayBudgetAndSpent(category, currentMonthKey);
}

// Function to edit an expense for the current month
function editExpense(category, amount, description) {
    const newAmount = prompt('Edit amount:', amount);
    const newDescription = prompt('Edit description:', description);

    if (newAmount && newDescription) {
        const currentMonthKey = getCurrentMonthKey();
        const expenses = JSON.parse(localStorage.getItem(`${currentMonthKey}-${category}-expenses`) || '[]');
        const updatedExpenses = expenses.map(expense => {
            if (expense.amount == amount && expense.description == description) {
                return { amount: newAmount, description: newDescription };
            }
            return expense;
        });
        localStorage.setItem(`${currentMonthKey}-${category}-expenses`, JSON.stringify(updatedExpenses));
        
        // Update spent amount
        const totalSpent = updatedExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
        localStorage.setItem(`${currentMonthKey}-${category}-spent`, totalSpent);
        
        // Refresh expenses display
        loadExpenses(category);
        displayBudgetAndSpent(category, currentMonthKey);
    }
}

// Function to go back to the category page
function goBackToCategory() {
    document.getElementById('expenseEntryPage').classList.add('hidden');
    document.getElementById('categoryPage').classList.remove('hidden');
}

// Function to go back to the month page
function goBackToMonthPage() {
    document.getElementById('categoryPage').classList.add('hidden');
    document.getElementById('monthPage').classList.remove('hidden');
}
