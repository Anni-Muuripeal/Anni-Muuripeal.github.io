import { fetchData } from './fetch.js';

document.addEventListener('DOMContentLoaded', () => {
    // Conditional execution for user data generation
    if (localStorage.getItem('jwtToken') && window.location.pathname.includes('profile.html')) {
        generateUserData();
    }

    // Login functionality
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const credentials = btoa(username + ':' + password); // Base64 encoding of credentials
            try {
                const response = await fetch('https://01.kood.tech/api/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + credentials,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const token = await response.json();
                    localStorage.setItem('jwtToken', token); // Assuming the token is the response
                    window.location.href = './profile.html'; // Redirect to profile page on success
                } else {
                    throw new Error('Login failed'); // Using a generic error message
                }
            } catch (error) {
                document.getElementById('errorMessage').textContent = error.message;
            }
        });
    }

    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('jwtToken'); // Clear the stored JWT token
            window.location.href = './login.html'; // Redirect to the login page
        });
    }
});

async function generateUserData() {
    try {
        const data = await fetchData();
        const userData = data.user;
        const userIdElement = document.getElementById('userId');
        const loginElement = document.getElementById('username');

        userIdElement.textContent = userData[0].id;
        loginElement.textContent = userData[0].login;
    } catch (error) {
        document.getElementById('errorMessage').textContent = 'Error generating user data';
    }
}
