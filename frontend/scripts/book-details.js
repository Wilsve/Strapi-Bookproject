import { fetchBookById} from "./api.js";
import { addRating } from "./api.js";
import {isLoggedIn} from "./auth.js";

export async function displayBookDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id');

        if (!bookId) {
            console.error('Book ID not found in URL');
            return;
        }
        const response = await fetchBookById(bookId);
        const book = response.data;
        
        renderBookDetails(book);
    } catch (error) {
        console.error('Error displaying book details:', error);
    }
    }
// Render book details
function renderBookDetails(book) {
    const detailsContainer = document.getElementById('book-details-container');

    if(!detailsContainer) {
        console.error('Details container not found');
        return;
    }

    const title = book.title;
    const pages = book.pages;
    const publicationDate = new Date (book.publicationDate).toLocaleDateString();

    let authorName = 'Unknown Author';
    if (book.author && book.author.authorName) {
        authorName = book.author.authorName;
    }
    let genreName = 'Unknown Genre';
    if (book.genre && book.genre.genreName) {
        genreName = book.genre.genreName;
    }
    let coverUrl = '/frontend/img/default-cover.jpg';
    if (book.cover && book.cover.url) {
        coverUrl = 'http://localhost:1337' + book.cover.url;
    }
    let description = 'No description available';
    if (book.description) {
        description = book.description;
    }
    let ratingText = 'No ratings yet';
if (book.ratings && book.ratings.length > 0) {
    const sum = book.ratings.reduce((total, r) => total + r.score, 0);
    const average = (sum / book.ratings.length).toFixed(1);
    ratingText = `Rating: ${average}/5 (${book.ratings.length} votes)`;
}

    detailsContainer.innerHTML = `
    <div class="book-details">
        <div class="book-details-header">
            <div class="book-details-info">
                <div class="title-container">
                <h1 class="book-details-title">${title}</h1>
                <p class="book-details-genre">${genreName}</p>
                </div>
                <p class="book-details-author"> by ${authorName}</p>
                <p class="book-details-pages">${pages} pages</p>
                <p class="book-details-date">${publicationDate}</p>
                <p class="book-details-rating">${ratingText}</p>
                <div class="rating-container"><input type="number" min="1" max="5" placeholder="Rate this book (1-5)"> 
                <button class="submit-rating">Submit rating</button></div>
            </div>
            <div class="book-details-image">
                <img src="${coverUrl}" alt="${title}" class="book-details-cover">
            </div>
        </div>
        <div class="book-details-description">
            <h3>About</h3>
            <p>${description}</p>
        </div>
        <div class="book-actions">
            <a href="/frontend/pages/index.html" class="return-btn">Back to Books</a>
        </div>
    </div>
`;  
    if (isLoggedIn()) {
        const ratingContainer = detailsContainer.querySelector('.rating-container');
        ratingContainer.style.display = 'block';
    }
    else {
        const ratingContainer = detailsContainer.querySelector('.rating-container');
        ratingContainer.style.display = 'none';
    }
    const ratingInput = detailsContainer.querySelector('.rating-container input[type="number"]');
    const submitButton = detailsContainer.querySelector('.submit-rating');
    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            const score = parseInt(ratingInput.value);
            if (isNaN(score) || score < 1 || score > 5) {
                alert('Please enter a valid rating between 1 and 5.');
                return;
            }
            try {
                await addRating(book.id, score);
                alert('Rating submitted successfully!');
            } catch (error) {
                console.error('Error adding rating:', error);
                alert('Failed to submit rating. Please try again.');
            }
        });

    }}
