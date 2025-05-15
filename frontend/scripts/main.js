import { getTheme } from './theme.js';
import { createLoginForm, createRegisterForm, loggedInUI, logout, updateUsername } from './auth.js';
import { displayAllBooks } from './books.js';
import { displaySavedBooks, displayUserRatings } from './library.js';

// DOM loading
document.addEventListener('DOMContentLoaded', () => {
    getTheme();
    createLoginForm();
    createRegisterForm();
    loggedInUI();
    updateUsername();
    logout();
    displaySavedBooks();
    displayUserRatings();
    
    const booksContainer = document.getElementById('books-container');
    if (booksContainer) {
        displayAllBooks();
    }
});