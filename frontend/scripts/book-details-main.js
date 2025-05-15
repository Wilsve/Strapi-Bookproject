import { getTheme } from './theme.js';
import { displayBookDetails } from './book-details.js';
import { createLoginForm, createRegisterForm, loggedInUI, logout, updateUsername } from './auth.js';

// DOM loading
document.addEventListener('DOMContentLoaded', () => {
    getTheme();
    createLoginForm();
    createRegisterForm();
    loggedInUI();
    updateUsername();
    logout();
    displayBookDetails();
});