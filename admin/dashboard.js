// Sample data - you'll replace this with real data from your storage
let contactRequests = [
    { id: 1, name: "John Doe", email: "john@example.com", message: "Interested in services", date: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", message: "Need more information", date: "2024-01-16" }
];

let financialRequests = [
    { id: 1, name: "Mike Johnson", email: "mike@example.com", service: "Loan", amount: "$50,000", date: "2024-01-15" },
    { id: 2, name: "Sarah Wilson", email: "sarah@example.com", service: "Investment", amount: "$100,000", date: "2024-01-16" }
];

function updateCounts() {
    document.getElementById('contactCount').textContent = contactRequests.length;
    document.getElementById('financialCount').textContent = financialRequests.length;
}

function showContactRequests() {
    const container = document.getElementById('tablesContainer');
    container.innerHTML = `
        <button class="back-button" onclick="hideTables()">← Back to Dashboard</button>
        <h2>Contact Us Requests</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${contactRequests.map(request => `
                    <tr>
                        <td>${request.id}</td>
                        <td>${request.name}</td>
                        <td>${request.email}</td>
                        <td>${request.message}</td>
                        <td>${request.date}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.style.display = 'block';
}

function showFinancialRequests() {
    const container = document.getElementById('tablesContainer');
    container.innerHTML = `
        <button class="back-button" onclick="hideTables()">← Back to Dashboard</button>
        <h2>Financial Requests</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${financialRequests.map(request => `
                    <tr>
                        <td>${request.id}</td>
                        <td>${request.name}</td>
                        <td>${request.email}</td>
                        <td>${request.service}</td>
                        <td>${request.amount}</td>
                        <td>${request.date}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.style.display = 'block';
}

function hideTables() {
    document.getElementById('tablesContainer').style.display = 'none';
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateCounts();
});