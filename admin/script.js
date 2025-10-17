// Configuration - Change these credentials!
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123" // Change this!
};

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Store login state
        sessionStorage.setItem('adminAuthenticated', 'true');
        // Redirect to dashboard
        window.location.href = './dashboard.html';
    } else {
        errorMessage.style.display = 'block';
        document.getElementById('password').value = '';
    }
});

// Clear error when user starts typing
document.getElementById('username').addEventListener('input', function() {
    document.getElementById('errorMessage').style.display = 'none';
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('errorMessage').style.display = 'none';
});