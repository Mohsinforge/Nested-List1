let expenseChart = null;

// Store expenses data
let expensesData = {
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: [],
        borderWidth: 2,
        borderColor: '#ffffff'
    }]
};

// Color mapping for categories
const categoryColors = {
    'Housing': '#ff5a78',
    'Food': '#4caf50',
    'Transportation': '#ffc107',
    'Bills': '#2196f3',
    'Miscellaneous': '#ff9800'
};

// Function to initialize the chart (only when first expense is added)
function initializeChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: expensesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += new Intl.NumberFormat('en-US', { 
                                    style: 'currency', 
                                    currency: 'USD' 
                                }).format(context.parsed);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// Function to add expense
function addExpense() {
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;

    // Validation
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
    }

    // Check if category already exists in the chart
    const categoryIndex = expensesData.labels.indexOf(category);

    if (categoryIndex === -1) {
        // New category - add it
        expensesData.labels.push(category);
        expensesData.datasets[0].data.push(amount);
        expensesData.datasets[0].backgroundColor.push(categoryColors[category]);
    } else {
        // Existing category - update the amount
        expensesData.datasets[0].data[categoryIndex] += amount;
    }

    // Initialize chart if it doesn't exist (first expense)
    if (!expenseChart) {
        initializeChart();
    } else {
        // Update existing chart
        expenseChart.update();
    }

    // Clear the amount input
    amountInput.value = '';
    
    // Optional: Show success message
    console.log(`Added $${amount} to ${category}`);
}

// Optional: Function to reset/clear all data
function resetTracker() {
    if (expenseChart) {
        expenseChart.destroy();
        expenseChart = null;
    }
    
    expensesData = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };
    
    console.log('Tracker reset - chart cleared');
}