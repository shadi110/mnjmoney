// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
        return;
    }
	
	const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Prevent zoom on double-tap for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
    });
    
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

// Global variables to store data and pagination
let contactRequests = [];
let financialRequests = [];
let currentContactPage = 1;
let currentFinancialPage = 1;
let contactSearchTerm = '';
let financialSearchTerm = '';
const rowsPerPage = 10;

// API base URL
const API_BASE_URL = 'https://mnjmoney-be.onrender.com';

async function updateCounts() {
    try {
        // Show loading state
        const contactCount = document.getElementById('contactCount');
        const financialCount = document.getElementById('financialCount');
        
        if (contactCount) {
            contactCount.innerHTML = '<div class="loading-dots">Loading</div>';
            contactCount.classList.add('loading');
        }
        if (financialCount) {
            financialCount.innerHTML = '<div class="loading-dots">Loading</div>';
            financialCount.classList.add('loading');
        }
        
        // Load contact requests count
        const contactsResponse = await fetch(`${API_BASE_URL}/api/contacts?limit=1`);
        const financialResponse = await fetch(`${API_BASE_URL}/api/financial-requests?limit=1`);
        
        if (!contactsResponse.ok || !financialResponse.ok) {
            throw new Error('API error');
        }
        
        const contactsResult = await contactsResponse.json();
        const financialResult = await financialResponse.json();
        
        // Update counts with actual data
        if (contactCount && contactsResult.success) {
            contactCount.textContent = contactsResult.total || 0;
            contactCount.classList.remove('loading');
        }
        if (financialCount && financialResult.success) {
            financialCount.textContent = financialResult.total || 0;
            financialCount.classList.remove('loading');
        }
        
    } catch (error) {
        console.error('Error updating counts:', error);
        
        // Show error state
        const contactCount = document.getElementById('contactCount');
        const financialCount = document.getElementById('financialCount');
        
        if (contactCount) {
            contactCount.textContent = '0';
            contactCount.classList.remove('loading');
        }
        if (financialCount) {
            financialCount.textContent = '0';
            financialCount.classList.remove('loading');
        }
    }
}
async function loadContactRequests(page = 1, search = '') {
    try {
        let url = `${API_BASE_URL}/api/contacts?limit=${rowsPerPage}&offset=${(page - 1) * rowsPerPage}`;
        
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            contactRequests = result.contacts;
            return {
                data: result.contacts,
                total: result.total || 0,
                hasNext: (page * rowsPerPage) < (result.total || 0)
            };
        }
    } catch (error) {
        console.error('Error loading contact requests:', error);
        return { data: [], total: 0, hasNext: false };
    }
}

async function loadFinancialRequests(page = 1, search = '') {
    try {
        let url = `${API_BASE_URL}/api/financial-requests?limit=${rowsPerPage}&offset=${(page - 1) * rowsPerPage}`;
        
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            financialRequests = result.financial_requests;
            return {
                data: result.financial_requests,
                total: result.total || 0,
                hasNext: (page * rowsPerPage) < (result.total || 0)
            };
        }
    } catch (error) {
        console.error('Error loading financial requests:', error);
        return { data: [], total: 0, hasNext: false };
    }
}


async function showContactRequests() {
    const container = document.getElementById('tablesContainer');
    if (!container) return;
    
    // Hide dashboard cards
    document.querySelector('.dashboard-grid').style.display = 'none';
    
    // Reset to first page when showing contacts
    currentContactPage = 1;
    contactSearchTerm = '';
    
    // Show loading state immediately
    container.innerHTML = `
        <button class="back-to-dashboard-btn" onclick="hideTables()">
            <i class="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        <div style="margin-bottom: 30px;"></div>
        <h2>Contact Us Requests <span style="color: #666;">(Loading...)</span></h2>
        
        <div class="table-controls">
            <div class="search-box">
                <span class="search-icon"><i class="fas fa-search"></i></span>
                <input type="text" id="contactSearch" placeholder="Search contacts..." disabled>
                <button class="search-button" disabled>Search</button>
            </div>
        </div>
        
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>ID Number</th>
                        <th>Area</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 40px;">
                            <div class="loading-spinner" style="width: 30px; height: 30px; margin: 0 auto 15px;"></div>
                            <p>Loading contact requests...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    container.style.display = 'block';
    container.style.background = 'white';
    
    try {
        // Load data
        const result = await loadContactRequests(currentContactPage);
        
        // Update with actual data
        container.innerHTML = `
            <button class="back-to-dashboard-btn" onclick="hideTables()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div style="margin-bottom: 30px;"></div>
            <h2>Contact Us Requests (${result.total})</h2>
            
            <div class="table-controls">
                <div class="search-box">
                    <span class="search-icon"><i class="fas fa-search"></i></span>
                    <input type="text" id="contactSearch" placeholder="Search contacts..." onkeyup="handleContactSearch(event)" value="${contactSearchTerm}">
                    <button class="search-button" onclick="handleContactSearch(event)">Search</button>
                </div>
            </div>
            
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>ID Number</th>
                            <th>Area</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.data.length > 0 ? result.data.map(request => `
                            <tr>
                                <td>${request.id}</td>
                                <td>${escapeHtml(request.name)}</td>
                                <td>${extractPhoneFromMessage(request.message) || 'N/A'}</td>
                                <td>${extractIdNumberFromMessage(request.message) || 'N/A'}</td>
                                <td>${extractAreaFromMessage(request.message) || 'N/A'}</td>
                                <td>${formatDate(request.created_at)}</td>
                                <td>
                                    <button class="btn-small" onclick="viewContact(${request.id})">View</button>
                                    <button class="btn-small btn-danger" onclick="deleteContact(${request.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="7" style="text-align: center; padding: 20px;">No contact requests found</td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
            
            ${result.total > 0 ? `
            <div class="pagination">
                <button onclick="changeContactPage(${currentContactPage - 1})" ${currentContactPage <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <span class="page-info">Page ${currentContactPage} of ${Math.ceil(result.total / rowsPerPage)}</span>
                <button onclick="changeContactPage(${currentContactPage + 1})" ${!result.hasNext ? 'disabled' : ''}>
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            ` : ''}
        `;
    } catch (error) {
        console.error('Error loading contact requests:', error);
        // Show error state
        container.innerHTML = `
            <button class="back-to-dashboard-btn" onclick="hideTables()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div style="margin-bottom: 30px;"></div>
            <h2>Contact Us Requests</h2>
            <div style="text-align: center; padding: 40px; color: #dc3545;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px;"></i>
                <p>Failed to load contact requests. Please try again.</p>
                <button class="btn" onclick="showContactRequests()">Retry</button>
            </div>
        `;
    }
}
async function showFinancialRequests() {
    const container = document.getElementById('tablesContainer');
    if (!container) return;
    
    // Hide dashboard cards
    document.querySelector('.dashboard-grid').style.display = 'none';
    
    // Show loading state immediately
    container.innerHTML = `
        <button class="back-to-dashboard-btn" onclick="hideTables()">
            <i class="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        <div style="margin-bottom: 30px;"></div>
        <h2>Financial Requests <span style="color: #666;">(Loading...)</span></h2>
        
        <div class="table-controls">
            <div class="search-box">
                <span class="search-icon"><i class="fas fa-search"></i></span>
                <input type="text" id="financialSearch" placeholder="Search financial requests..." disabled>
                <button class="search-button" disabled>Search</button>
            </div>
        </div>
        
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
                    <tr>
                        <td colspan="9" style="text-align: center; padding: 40px;">
                            <div class="loading-spinner" style="width: 30px; height: 30px; margin: 0 auto 15px;"></div>
                            <p>Loading financial requests...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    container.style.display = 'block';
    container.style.background = 'white';
    
    try {
        // Reset to first page when showing financial requests
        currentFinancialPage = 1;
        financialSearchTerm = '';
        
        const result = await loadFinancialRequests(currentFinancialPage);
        
        // Update with actual data
        container.innerHTML = `
            <button class="back-to-dashboard-btn" onclick="hideTables()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div style="margin-bottom: 30px;"></div>
            <h2>Financial Requests (${result.total})</h2>
            
            <div class="table-controls">
                <div class="search-box">
                    <span class="search-icon"><i class="fas fa-search"></i></span>
                    <input type="text" id="financialSearch" placeholder="Search financial requests..." onkeyup="handleFinancialSearch(event)" value="${financialSearchTerm}">
                    <button class="search-button" onclick="handleFinancialSearch(event)">Search</button>
                </div>
            </div>
            
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
                        ${result.data.length > 0 ? result.data.map(request => `
                            <tr>
                                <td>${request.id}</td>
                                <td>${escapeHtml(request.full_name)}</td>
                                <td>${escapeHtml(request.phone_number)}</td>
                                <td>${escapeHtml(request.email_address)}</td>
                                <td>${formatEmployment(request.employment_status, request.employment_type)}</td>
                                <td>${formatServiceType(request.service_interest)}</td>
                                <td>${formatLanguage(request.preferred_language)}</td>
                                <td>${formatDate(request.created_at)}</td>
                                <td>
                                    <button class="btn-small" onclick="viewFinancialRequest(${request.id})">View</button>
                                    <button class="btn-small btn-danger" onclick="deleteFinancialRequest(${request.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="9" style="text-align: center; padding: 20px;">No financial requests found</td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
            
            ${result.total > 0 ? `
            <div class="pagination">
                <button onclick="changeFinancialPage(${currentFinancialPage - 1})" ${currentFinancialPage <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <span class="page-info">Page ${currentFinancialPage} of ${Math.ceil(result.total / rowsPerPage)}</span>
                <button onclick="changeFinancialPage(${currentFinancialPage + 1})" ${!result.hasNext ? 'disabled' : ''}>
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            ` : ''}
        `;
    } catch (error) {
        console.error('Error loading financial requests:', error);
        // Show error state
        container.innerHTML = `
            <button class="back-to-dashboard-btn" onclick="hideTables()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div style="margin-bottom: 30px;"></div>
            <h2>Financial Requests</h2>
            <div style="text-align: center; padding: 40px; color: #dc3545;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px;"></i>
                <p>Failed to load financial requests. Please try again.</p>
                <button class="btn" onclick="showFinancialRequests()">Retry</button>
            </div>
        `;
    }
}
async function changeContactPage(page) {
    if (page < 1) return;
    
    currentContactPage = page;
    const result = await loadContactRequests(currentContactPage, contactSearchTerm);
    
    if (result.data.length === 0 && page > 1) {
        // If no data on this page, go back to previous page
        currentContactPage--;
        return;
    }
    
    const container = document.getElementById('tablesContainer');
    if (!container) return;
    
    const tableBody = container.querySelector('tbody');
    const pagination = container.querySelector('.pagination');
    const title = container.querySelector('h2');
    
    if (tableBody) {
        tableBody.innerHTML = result.data.length > 0 ? result.data.map(request => `
            <tr>
                <td>${request.id}</td>
                <td>${escapeHtml(request.name)}</td>
                <td>${extractPhoneFromMessage(request.message) || 'N/A'}</td>
                <td>${extractIdNumberFromMessage(request.message) || 'N/A'}</td>
                <td>${extractAreaFromMessage(request.message) || 'N/A'}</td>
                <td>${formatDate(request.created_at)}</td>
                <td>
                    <button class="btn-small" onclick="viewContact(${request.id})">View</button>
                    <button class="btn-small btn-danger" onclick="deleteContact(${request.id})">Delete</button>
                </td>
            </tr>
        `).join('') : `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px;">No contact requests found</td>
            </tr>
        `;
    }
    
    if (title) {
        title.textContent = `Contact Us Requests (${result.total})`;
    }
    
    if (pagination) {
        if (result.total > 0) {
            pagination.innerHTML = `
                <button onclick="changeContactPage(${currentContactPage - 1})" ${currentContactPage <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <span class="page-info">Page ${currentContactPage} of ${Math.ceil(result.total / rowsPerPage)}</span>
                <button onclick="changeContactPage(${currentContactPage + 1})" ${!result.hasNext ? 'disabled' : ''}>
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            `;
        } else {
            pagination.innerHTML = '';
        }
    }
}

async function changeFinancialPage(page) {
    if (page < 1) return;
    
    currentFinancialPage = page;
    const result = await loadFinancialRequests(currentFinancialPage, financialSearchTerm);
    
    if (result.data.length === 0 && page > 1) {
        // If no data on this page, go back to previous page
        currentFinancialPage--;
        return;
    }
    
    const container = document.getElementById('tablesContainer');
    if (!container) return;
    
    const tableBody = container.querySelector('tbody');
    const pagination = container.querySelector('.pagination');
    const title = container.querySelector('h2');
    
    if (tableBody) {
        tableBody.innerHTML = result.data.length > 0 ? result.data.map(request => `
            <tr>
                <td>${request.id}</td>
                <td>${escapeHtml(request.full_name)}</td>
                <td>${escapeHtml(request.phone_number)}</td>
                <td>${escapeHtml(request.email_address)}</td>
                <td>${formatEmployment(request.employment_status, request.employment_type)}</td>
                <td>${formatServiceType(request.service_interest)}</td>
                <td>${formatLanguage(request.preferred_language)}</td>
                <td>${formatDate(request.created_at)}</td>
                <td>
                    <button class="btn-small" onclick="viewFinancialRequest(${request.id})">View</button>
                    <button class="btn-small btn-danger" onclick="deleteFinancialRequest(${request.id})">Delete</button>
                </td>
            </tr>
        `).join('') : `
            <tr>
                <td colspan="9" style="text-align: center; padding: 20px;">No financial requests found</td>
            </tr>
        `;
    }
    
    if (title) {
        title.textContent = `Financial Service Requests (${result.total})`;
    }
    
    if (pagination) {
        if (result.total > 0) {
            pagination.innerHTML = `
                <button onclick="changeFinancialPage(${currentFinancialPage - 1})" ${currentFinancialPage <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <span class="page-info">Page ${currentFinancialPage} of ${Math.ceil(result.total / rowsPerPage)}</span>
                <button onclick="changeFinancialPage(${currentFinancialPage + 1})" ${!result.hasNext ? 'disabled' : ''}>
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            `;
        } else {
            pagination.innerHTML = '';
        }
    }
}

function handleContactSearch(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        contactSearchTerm = document.getElementById('contactSearch').value;
        currentContactPage = 1;
        changeContactPage(1);
    }
}

function handleFinancialSearch(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        financialSearchTerm = document.getElementById('financialSearch').value;
        currentFinancialPage = 1;
        changeFinancialPage(1);
    }
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function viewContact(contactId) {
    const contact = contactRequests.find(c => c.id === contactId);
    if (!contact) return;
    
    // Extract data from message
    const phone = extractPhoneFromMessage(contact.message) || 'Not provided';
    const idNumber = extractIdNumberFromMessage(contact.message) || 'Not provided';
    const area = extractAreaFromMessage(contact.message) || 'Not provided';
    const message = contact.message.replace(/Phone:\s*[^,]+,\s*ID:\s*[^,]+,\s*Area:\s*[^,]+,\s*Message:\s*/i, '').trim();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Contact Request Details</h2>
            
            <div class="request-details">
                <div class="detail-section">
                    <h3>Basic Information</h3>
                    <div class="detail-row">
                        <span class="detail-label">Request ID:</span>
                        <span class="detail-value">${contact.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${escapeHtml(contact.name)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">ID Number:</span>
                        <span class="detail-value">${idNumber}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Area:</span>
                        <span class="detail-value">${area}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Submitted:</span>
                        <span class="detail-value">${formatDate(contact.created_at)}</span>
                    </div>
                </div>
                
                ${message ? `
                <div class="detail-section">
                    <h3>Message</h3>
                    <div class="message-content">
                        ${escapeHtml(message)}
                    </div>
                </div>
                ` : ''}
                
             
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
                    <p><strong>Full Name:</strong> ${escapeHtml(request.full_name)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(request.phone_number)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(request.email_address)}</p>
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


// Enhanced search for mobile
function handleContactSearch(event) {
    if (event.key === 'Enter' || event.type === 'click' || event.type === 'touchend') {
        contactSearchTerm = document.getElementById('contactSearch').value;
        currentContactPage = 1;
        changeContactPage(1);
        
        // Hide mobile keyboard after search
        if (window.innerWidth <= 768) {
            document.getElementById('contactSearch').blur();
        }
    }
}

function handleFinancialSearch(event) {
    if (event.key === 'Enter' || event.type === 'click' || event.type === 'touchend') {
        financialSearchTerm = document.getElementById('financialSearch').value;
        currentFinancialPage = 1;
        changeFinancialPage(1);
        
        // Hide mobile keyboard after search
        if (window.innerWidth <= 768) {
            document.getElementById('financialSearch').blur();
        }
    }
}

// Mobile-optimized modal closing
function closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        if (modal.parentElement) {
            modal.parentElement.remove();
        }
    }, 300);
}

// Enhanced modal creation with mobile support
function createMobileFriendlyModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    
    modal.innerHTML = content;
    
    // Add touch event for backdrop closing
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    document.body.appendChild(modal);
    
    // Trigger animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    return modal;
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
            // Refresh the current page
            await changeContactPage(currentContactPage);
            
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

function extractPhoneFromMessage(message) {
    if (!message) return null;
    
    // Look for phone patterns in the message
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
    const matches = message.match(phoneRegex);
    
    if (matches && matches.length > 0) {
        // Return the first phone number found
        return matches[0].trim();
    }
    
    return null;
}

function extractIdNumberFromMessage(message) {
    if (!message) return null;
    
    // Look for ID number patterns (Israeli ID format - 9 digits)
    const idRegex = /ID:\s*(\d{9})|ID\s*Number:\s*(\d{9})|\b\d{9}\b/g;
    const matches = message.match(idRegex);
    
    if (matches && matches.length > 0) {
        // Extract just the numbers
        const numbers = matches[0].match(/\d{9}/);
        return numbers ? numbers[0] : matches[0].trim();
    }
    
    return null;
}

function extractAreaFromMessage(message) {
    if (!message) return null;
    
    // Look for Area patterns
    const areaRegex = /Area:\s*([^,\n]+)|Area\s*:\s*([^,\n]+)/i;
    const matches = message.match(areaRegex);
    
    if (matches && matches.length > 0) {
        // Return the area value (group 1 or 2)
        return matches[1] || matches[2] || matches[0].replace(/Area:\s*/i, '').trim();
    }
    
    return null;
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
            // Refresh the current page
            await changeFinancialPage(currentFinancialPage);
            
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
    // Show the dashboard cards again
    document.querySelector('.dashboard-grid').style.display = 'grid';
}

// Refresh data every 30 seconds
setInterval(() => {
    if (document.getElementById('tablesContainer')?.style.display !== 'none') {
        updateCounts();
    }
}, 30000);
