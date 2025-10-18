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
    loadFinancialRequests();
    
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
        // Load contact requests count
        const contactsResponse = await fetch(`${API_BASE_URL}/api/contacts?limit=1`);
        const financialResponse = await fetch(`${API_BASE_URL}/api/financial-requests?limit=1`);
        
        if (!contactsResponse.ok || !financialResponse.ok) {
            throw new Error('API error');
        }
        
        const contactsResult = await contactsResponse.json();
        const financialResult = await financialResponse.json();
        
        const contactCount = document.getElementById('contactCount');
        const financialCount = document.getElementById('financialCount');
        
        if (contactCount && contactsResult.success) {
            contactCount.textContent = contactsResult.total || 0;
        }
        if (financialCount && financialResult.success) {
            financialCount.textContent = financialResult.total || 0;
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
    }
}

async function loadFinancialRequests() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/financial-requests?limit=1000`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            financialRequests = result.financial_requests;
            console.log('Loaded financial requests:', financialRequests);
        }
    } catch (error) {
        console.error('Error loading financial requests:', error);
        // Fallback to sample data
        loadSampleFinancialData();
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
        }
    ];
    
    const contactCount = document.getElementById('contactCount');
    const financialCount = document.getElementById('financialCount');
    
    if (contactCount) contactCount.textContent = contactRequests.length;
    if (financialCount) financialCount.textContent = 0;
}

function loadSampleFinancialData() {
    financialRequests = [
        {
            id: 1,
            employment_status: "yes",
            employment_type: "employee",
            has_pay_slips: "yes",
            previous_funds_history: "no",
            service_interest: "tax-refunds",
            preferred_language: "english",
            full_name: "John Doe",
            phone_number: "+1234567890",
            email_address: "john@example.com",
            created_at: "2024-01-15T10:30:00",
            updated_at: "2024-01-15T10:30:00"
        }
    ];
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
    
    container.innerHTML = `
        <button class="back-button" onclick="hideTables()">← Back to Dashboard</button>
        <h2>Financial Service Requests (${financialRequests.length})</h2>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Employment</th>
                        <th>Service</th>
                        <th>Language</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${financialRequests.map(request => `
                        <tr>
                            <td>${request.id}</td>
                            <td>${request.full_name}</td>
                            <td>${request.phone_number}</td>
                            <td>${request.email_address}</td>
                            <td>${formatEmployment(request.employment_status, request.employment_type)}</td>
                            <td>${formatServiceType(request.service_interest)}</td>
                            <td>${formatLanguage(request.preferred_language)}</td>
                            <td>${formatDate(request.created_at)}</td>
                            <td>
                                <button class="btn-small" onclick="viewFinancialRequest(${request.id})">View</button>
                                <button class="btn-small btn-danger" onclick="deleteFinancialRequest(${request.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    container.style.display = 'block';
}

function formatEmployment(status, type) {
    const statusText = status === 'yes' ? 'Employed' : 'Not Employed';
    const typeMap = {
        'employee': 'Employee',
        'freelancer': 'Freelancer',
        'business-owner': 'Business Owner'
    };
    const typeText = typeMap[type] || type;
    return `${statusText} (${typeText})`;
}

function formatServiceType(service) {
    const serviceMap = {
        'tax-refunds': 'Tax Refunds',
        'pension-funds': 'Pension Funds',
        'lost-money': 'Lost Money',
        'consultation': 'Consultation'
    };
    return serviceMap[service] || service;
}

function formatLanguage(lang) {
    const langMap = {
        'english': 'English',
        'hebrew': 'Hebrew',
        'arabic': 'Arabic'
    };
    return langMap[lang] || lang;
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

function viewFinancialRequest(requestId) {
    const request = financialRequests.find(r => r.id === requestId);
    if (!request) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Financial Request Details</h2>
            <div class="request-details">
                <div class="detail-section">
                    <h3>Personal Information</h3>
                    <p><strong>ID:</strong> ${request.id}</p>
                    <p><strong>Full Name:</strong> ${request.full_name}</p>
                    <p><strong>Phone:</strong> ${request.phone_number}</p>
                    <p><strong>Email:</strong> ${request.email_address}</p>
                    <p><strong>Preferred Language:</strong> ${formatLanguage(request.preferred_language)}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Employment Details</h3>
                    <p><strong>Employment Status:</strong> ${request.employment_status === 'yes' ? 'Employed' : 'Not Employed'}</p>
                    <p><strong>Employment Type:</strong> ${formatServiceType(request.employment_type)}</p>
                    <p><strong>Has Pay Slips:</strong> ${formatYesNo(request.has_pay_slips)}</p>
                    <p><strong>Previous Funds History:</strong> ${formatYesNo(request.previous_funds_history)}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Service Request</h3>
                    <p><strong>Service Interest:</strong> ${formatServiceType(request.service_interest)}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Timestamps</h3>
                    <p><strong>Submitted:</strong> ${formatDate(request.created_at)}</p>
                    <p><strong>Last Updated:</strong> ${formatDate(request.updated_at)}</p>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                <button class="btn btn-danger" onclick="deleteFinancialRequest(${request.id})">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function formatYesNo(value) {
    const map = {
        'yes': 'Yes',
        'no': 'No',
        'not-sure': 'Not Sure',
        'no-but-can-get': 'No, but can get'
    };
    return map[value] || value;
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
                showContactRequests();
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

async function deleteFinancialRequest(requestId) {
    if (!confirm('Are you sure you want to delete this financial request?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/financial-requests/${requestId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Remove from local array
            financialRequests = financialRequests.filter(r => r.id !== requestId);
            
            // Refresh the display
            const container = document.getElementById('tablesContainer');
            if (container && container.style.display !== 'none') {
                showFinancialRequests();
            }
            
            // Update counts
            updateCounts();
            
            alert('Financial request deleted successfully!');
        } else {
            throw new Error('Failed to delete financial request');
        }
    } catch (error) {
        console.error('Error deleting financial request:', error);
        alert('Error deleting financial request. Please try again.');
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
        loadFinancialRequests();
    }
}, 30000);