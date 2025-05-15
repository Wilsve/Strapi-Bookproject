import { fetchUserProfile } from "./api.js";

// Base URL
const BASE_URL = 'http://localhost:1337/api';

// Login
export async function login(identifier, password) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/local`, {
            identifier,
            password
        });
        localStorage.setItem('token', response.data.jwt);
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};
// Login Form 
export async function createLoginForm(event) {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                await login(email, password);
                window.location.href = '/frontend/pages/index.html';
            } catch (error) {
                console.error('Login failed:', error);
                alert('Login failed. Please check username or password.');
            }
        });
    }
}
// Register
export async function register(username, email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/local/register`, {
            username,
            email,
            password
        });
        localStorage.setItem('token', response.data.jwt);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};
// Register Form
export async function createRegisterForm(event) {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                await register(username, email, password);
                window.location.href = '/frontend/pages/index.html';
            } catch (error) {
                console.error('Registration failed:', error);
                alert('Registration failed. Please check your credentials.');
            }
        });
    }
}
// Logout
export function logout() {
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {

        localStorage.removeItem('token');
        window.location.href = '/frontend/pages/index.html';   
        });
    }
    
};
// Check if logged in
export function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}
// Logged in UI 
export function loggedInUI() {
    const loggedIn = isLoggedIn();
    const logoutButton = document.querySelector('.logout-button');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const libraryLink = document.querySelector('.library-link');

    if (loggedIn) {
        logoutButton.style.display = 'block';
        libraryLink.style.display = 'block';
        loginLink.style.display = 'none';
        registerLink.style.display = 'none'; 
    }
    else {
        logoutButton.style.display = 'none';
        libraryLink.style.display = 'none';
    }
    
}
// Update username in UI
export function updateUsername() {
    if (isLoggedIn()) {
        const usernameElement = document.querySelector('.username');
        if (usernameElement) {
            fetchUserProfile()
                .then(user => {
                    usernameElement.innerHTML =`<i class="fa-solid fa-user"></i> ${user.username}`;
                })
                .catch(error => {
                    console.error('Error fetching username:', error);
                });
        }
    }
}
// Get JWT token
export function getToken() {
    return localStorage.getItem('token');
}
