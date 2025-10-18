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
    loadContactRequests();
    
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

// Global variables to store data
let contactRequests = [];
let financialRequests = [];

// API base URL
const API_BASE_URL = 'https://mnjmoney-be.onrender.com';

async function updateCounts() {
    try {
        // Load contact requests from API
        const response = await fetch(`${API_BASE_URL}/api/contacts?limit=1000`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            contactRequests = result.contacts;
            const contactCount = document.getElementById('contactCount');
            const financialCount = document.getElementById('financialCount');
            
            if (contactCount) {
                contactCount.textContent = contactRequests.length;
            }
            if (financialCount) {
                financialCount.textContent = contactRequests.length; // Using same count for demo
            }
        }
    } catch (error) {
        console.error('Error updating counts:', error);
        // Fallback to sample data if API fails
        loadSampleData();
    }
}

async function loadContactRequests() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/contacts?limit=1000`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            contactRequests = result.contacts;
        }
    } catch (error) {
        console.error('Error loading contact requests:', error);
        // Fallback to sample data
        loadSampleData();
    }
}

function loadSampleData() {
    // Sample data as fallback
    contactRequests = [
        { 
            id: 1, 
            name: "John Doe", 
            email: "john@example.com", 
            message: "Interested in tax refund services", 
            created_at: "2024-01-15T10:30:00" 
        },
        { 
            id: 2, 
            name: "Jane Smith", 
            email: "jane@example.com", 
            message: "Need help with pension fund withdrawal", 
            created_at: "2024-01-16T14:20:00" 
        }
    ];
    
    const contactCount = document.getElementById('contactCount');
    const financialCount = document.getElementById('financialCount');
    
    if (contactCount) contactCount.textContent = contactRequests.length;
    if (financialCount) financialCount.textContent = contactRequests.length;
}

function showContactRequests() {
    const container = document.getElementById('tablesContainer');
    if (!container) return;
    
    container.innerHTML = `
        <button class="back-button" onclick="hideTables()">← Back to Dashboard</button>
        <h2>Contact Us Requests (${contactRequests.length})</h2>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${contactRequests.map(request => `
                        <tr>
                            <td>${request.id}</td>
                            <td>${request.name}</td>
                            <td>${request.email}</td>
                            <td class="message-cell">${request.message}</td>
                            <td>${formatDate(request.created_at)}</td>
                            <td>
                                <button class="btn-small" onclick="viewContact(${request.id})">View</button>
                                <button class="btn-small btn-danger" onclick="deleteContact(${request.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    container.style.display = 'block';
}

function showFinancialRequests() {
    const container = document.getElementById('tablesContainer');
    if (!container) return;
    
    // For now, using contact requests as financial requests
    // You can modify this when you have separate financial requests
    container.innerHTML = `
        <button class="back-button" onclick="hideTables()">← Back to Dashboard</button>
        <h2>Financial Service Requests (${contactRequests.length})</h2>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Service Type</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${contactRequests.map(request => `
                        <tr>
                            <td>${request.id}</td>
                            <td>${request.name}</td>
                            <td>${request.email}</td>
                            <td>${detectServiceType(request.message)}</td>
                            <td class="message-cell">${request.message}</td>
                            <td>${formatDate(request.created_at)}</td>
                            <td>
                                <button class="btn-small" onclick="viewContact(${request.id})">View</button>
                                <button class="btn-small btn-danger" onclick="deleteContact(${request.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    container.style.display = 'block';
}

function detectServiceType(message) {
    const msg = message.toLowerCase();
    if (msg.includes('tax') || msg.includes('refund')) return 'Tax Refund';
    if (msg.includes('pension') || msg.includes('fund')) return 'Pension Fund';
    if (msg.includes('lost') || msg.includes('money')) return 'Lost Money';
    if (msg.includes('consult') || msg.includes('advice')) return 'Consultation';
    return 'General Inquiry';
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch (e) {
        return dateString;
    }
}

function viewContact(contactId) {
    const contact = contactRequests.find(c => c.id === contactId);
    if (!contact) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Contact Details</h2>
            <div class="contact-details">
                <p><strong>ID:</strong> ${contact.id}</p>
                <p><strong>Name:</strong> ${contact.name}</p>
                <p><strong>Email:</strong> ${contact.email}</p>
                <p><strong>Date:</strong> ${formatDate(contact.created_at)}</p>
                <p><strong>Message:</strong></p>
                <div class="message-content">${contact.message}</div>
            </div>
            <div class="modal-actions">
                <button class="btn" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                <button class="btn btn-danger" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function deleteContact(contactId) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/contacts/${contactId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Remove from local array
            contactRequests = contactRequests.filter(c => c.id !== contactId);
            
            // Refresh the display
            const container = document.getElementById('tablesContainer');
            if (container && container.style.display !== 'none') {
                showContactRequests(); // Refresh the current view
            }
            
            // Update counts
            updateCounts();
            
            alert('Contact deleted successfully!');
        } else {
            throw new Error('Failed to delete contact');
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact. Please try again.');
    }
}

function hideTables() {
    const container = document.getElementById('tablesContainer');
    if (container) {
        container.style.display = 'none';
    }
}

// Refresh data every 30 seconds
setInterval(() => {
    if (document.getElementById('tablesContainer')?.style.display !== 'none') {
        updateCounts();
        loadContactRequests();
    }
}, 30000);