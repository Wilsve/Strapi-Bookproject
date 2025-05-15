import { fetchBooks, fetchAuthors, fetchUserProfile, removeBookFromProfile, fetchUserRatings } from "./api.js";
import { isLoggedIn } from "./auth.js";
import { createBookElement } from "./books.js";

let savedBooksData = [];
let userRatingsData = [];

// Sort books
function sortBooksByTitle(a, b) {
    return a.title.localeCompare(b.title);
}
function sortBooksByAuthor(a, b) {
    const authorA = a.fullAuthor ? a.fullAuthor.authorName : (a.author ? a.author.authorName : '');
    const authorB = b.fullAuthor ? b.fullAuthor.authorName : (b.author ? b.author.authorName : '');
    return authorA.localeCompare(authorB);
}
// Sort ratings
function sortRatingsByTitle(a, b) {
    return a.book.title.localeCompare(b.book.title);
}
function sortRatingsByAuthor(a, b) {
    return a.book.author.authorName.localeCompare(b.book.author.authorName);
}
function sortRatingsByScore(a, b) {
    return b.score - a.score;
}
// Display saved books for logged in user
export async function displaySavedBooks() {
    try {
        if (!isLoggedIn()) {
            const booksContainer = document.getElementById('saved-books-container');
            booksContainer.innerHTML = '<p>Please log in to view your saved books.</p>';
            return;
        }

        // Get user profile
        const userProfile = await fetchUserProfile();
        
        // Get all books and authors
        const bookResponse = await fetchBooks();
        const books = bookResponse.data;
        
        const authorResponse = await fetchAuthors();
        const authors = authorResponse.data;

        const authorsMap = {};
        authors.forEach(author => {
            authorsMap[author.id] = author;
        });

        const booksContainer = document.getElementById('saved-books-container');
        booksContainer.innerHTML = '';

        //Check if user has saved books
        if (!userProfile.savedBooks || userProfile.savedBooks.length === 0) {
            booksContainer.innerHTML = '<p>You have no saved books in your library.</p>';
            return;
        }

        const savedBookIds = userProfile.savedBooks.map(book => book.id);
        const savedBooks = books.filter(book => savedBookIds.includes(book.id));
        if (savedBooks.length === 0) {
            booksContainer.innerHTML = '<p>You have no saved books in your library.</p>';
            return;
        }
        
        // Save saved books in arr
        savedBooksData = savedBooks.map(book => {
            if (book.author && book.author.id) {
                const authorId = book.author.id;
                if (authorsMap[authorId]) {
                    book.fullAuthor = authorsMap[authorId];
                }
            }
            return book;
        });
        bookSorting();
        renderSavedBooks(savedBooksData);

    } catch (error) {
        console.error('Error displaying saved books:', error);
    }
}
// Render saved books
function renderSavedBooks(books) {
    const booksContainer = document.getElementById('saved-books-container');
    booksContainer.innerHTML = '';
    
    books.forEach(book => {
        const bookElement = createBookElement(book);
        const saveButton = bookElement.querySelector('.save-button');
        if (saveButton) {
            saveButton.textContent = 'Remove';
            saveButton.classList.add('remove-button');
            saveButton.outerHTML = saveButton.outerHTML;
            const newSaveButton = bookElement.querySelector('.save-button');
            
            newSaveButton.addEventListener('click', async () => {
                try {
                    await removeBookFromProfile(book.id);
                    bookElement.remove();
                    savedBooksData = savedBooksData.filter(b => b.id !== book.id);
                    
                    if (savedBooksData.length === 0) {
                        booksContainer.innerHTML = '<p>You have no saved books in your library.</p>';
                    }
                } catch (error) {
                    console.error('Error removing book:', error);
                }
            });
        }
        
        booksContainer.appendChild(bookElement);
    });
}
// Book sorting
function bookSorting() {
    const sortSelect = document.getElementById('sort-books');

    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        let sortedBooks = [...savedBooksData];
        
        if (sortValue === 'title') {
            sortedBooks.sort(sortBooksByTitle);
        } else if (sortValue === 'author') {
            sortedBooks.sort(sortBooksByAuthor);
        }
        
        renderSavedBooks(sortedBooks);
    });
}
// Display user ratings
export async function displayUserRatings() {
    try {
        if (!isLoggedIn()) {
            const container = document.getElementById('ratings-container');
            if (container) {
                container.innerHTML = '<p>Please log in to view your ratings</p>';
            }
            return;
        }
        // Fetch user ratings
        const ratingsData = await fetchUserRatings();
        if (ratingsData.data.length === 0) {
            const container = document.getElementById('ratings-container');
            container.innerHTML = '<p>No books rated yet.</p>';
            return;
        }
        userRatingsData = ratingsData.data;

        ratingSorting();
        renderRatings(userRatingsData);

    } catch (error) {
        console.error('Error displaying user ratings:', error);
    }
}
// Render user ratings
function renderRatings(ratings) {
    const container = document.getElementById('ratings-container');
    if (!container) return;
    
    let booksHtml = '';
    
    ratings.forEach(rating => {
        if (rating.book) {
            booksHtml += `<li><h3>${rating.book.title} - ${rating.score}/5</h3>
            <p>${rating.book.author.authorName}</p></li>`;
        }
    });
    
    if (booksHtml === '') {
        container.innerHTML = '<p>No books rated yet.</p>';
    } else {
        container.innerHTML = booksHtml;
    }
}
// Sort ratings
function ratingSorting() {
    const sortSelect = document.getElementById('sort-ratings');
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        let sortedRatings = [...userRatingsData];
        
        if (sortValue === 'title') {
            sortedRatings.sort(sortRatingsByTitle);
        } else if (sortValue === 'author') {
            sortedRatings.sort(sortRatingsByAuthor);
        } else if (sortValue === 'rating') {
            sortedRatings.sort(sortRatingsByScore);
        }
        
        renderRatings(sortedRatings);
    });
}