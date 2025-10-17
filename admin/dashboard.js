// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
        return;
    }
    
    // User is authenticated, initialize dashboard
    initializeDashboard();
});

function logout() {
    // Clear authentication
    sessionStorage.removeItem('adminAuthenticated');
    // Redirect to login page
    window.location.href = 'index.html';
}

function initializeDashboard() {
    updateCounts();
    
    // Add logout button to header if it doesn't exist
    const header = document.querySelector('header');
    if (header && !header.querySelector('.logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.className = 'logout-btn';
        logoutBtn.onclick = logout;
        header.appendChild(logoutBtn);
    }
}

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
    const contactCount = document.getElementById('contactCount');
    const financialCount = document.getElementById('financialCount');
    
    if (contactCount) {
        contactCount.textContent = contactRequests.length;
    }
    if (financialCount) {
        financialCount.textContent = financialRequests.length;
    }
}

function showContactRequests() {
    const container = document.getElementById('tablesContainer');
    if (!container) return;
    
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
    if (!container) return;
    
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
    const container = document.getElementById('tablesContainer');
    if (container) {
        container.style.display = 'none';
    }
}