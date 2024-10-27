document.addEventListener('DOMContentLoaded', async function () {
    const amountInput = document.getElementById('amount-input');
    const descriptionInput = document.getElementById('description-input');
    const categorySelect = document.getElementById('category-select');
    const addBtn = document.getElementById('add-btn');
    const expensesTableBody = document.getElementById('expense-table-body');
    const totalAmountCell = document.getElementById('total-amount');
    let totalAmount = 0;

    async function fetchExpenses() {
        try {
            const response = await axios.get('http://localhost:3000/expenses');
            const expenses = response.data;
            totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            totalAmountCell.textContent = totalAmount.toFixed(2);
            expenses.forEach(addExpenseToTable);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

    async function addExpense(event) {
        event.preventDefault();
        const amount = parseFloat(amountInput.value);
        const description = descriptionInput.value.trim();
        const category = categorySelect.value;

        if (!amount || !description || !category) return alert('Please fill out all fields');

        try {
            const response = await axios.post('http://localhost:3000/expenses', { amount, description, category });
            const expense = response.data;
            totalAmount += amount;
            totalAmountCell.textContent = totalAmount.toFixed(2);
            addExpenseToTable(expense);
            clearForm();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    }

    function addExpenseToTable(expense) {
        const row = expensesTableBody.insertRow();
        row.insertCell().textContent = expense.amount;
        row.insertCell().textContent = expense.description;
        row.insertCell().textContent = expense.category;

        const actionsCell = row.insertCell();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteExpense(expense.id, row);
        actionsCell.appendChild(deleteBtn);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editExpense(expense);
        actionsCell.appendChild(editBtn);
    }

    async function deleteExpense(id, row) {
        try {
            await axios.delete(`http://localhost:3000/expenses/${id}`);
            row.remove();
            const expense = expenses.find(exp => exp.id === id);
            totalAmount -= expense.amount;
            updateTotalAmount();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }

    addBtn.addEventListener('click', addExpense);
    fetchExpenses();
});

function clearForm() {
    amountInput.value = '';
    descriptionInput.value = '';
    categorySelect.value = '';
}