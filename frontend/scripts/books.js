import { fetchBooks, fetchAuthors, saveBookToProfile } from "./api.js";
import { isLoggedIn } from "./auth.js";

// Display all books
export async function displayAllBooks() {
    try {
        const bookResponse = await fetchBooks();
        const books = bookResponse.data;
        
       
        const authorResponse = await fetchAuthors();
        const authors = authorResponse.data;
        

        const authorsMap = {};
        authors.forEach(author => {
            authorsMap[author.id] = author;
        });

        const booksContainer = document.getElementById('books-container');
        booksContainer.innerHTML = '';

        if (books.length === 0) {
            booksContainer.innerHTML = '<p>No books available.</p>';
            return;
        }
        
        books.forEach(book => {
        
           if (book.author && book.author.id) {
               const authorId = book.author.id;
               if (authorsMap[authorId]) {
                   book.fullAuthor = authorsMap[authorId];
               }
           }
           
           const bookElement = createBookElement(book);
           booksContainer.appendChild(bookElement);
        });
    } catch (error) {
        console.error('Error displaying books:', error);
    }
}
// Create book element
export function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.className = 'book-card';
    bookElement.dataset.id = book.id;

    const title = book.title;

    let authorName = 'Unknown Author';
    if (book.author && book.author.authorName) {
        authorName = book.author.authorName;
    }

    let genreName = 'Unknown Genre';
    if (book.genre && book.genre.genreName) {
        genreName = book.genre.genreName;
    }

    let coverUrl = '/frontend/img/default-cover.jpg';
    if (book.cover.url) {
        coverUrl = 'http://localhost:1337' + book.cover.url;
    }
    
    let authorImgUrl = '/frontend/img/default-cover.jpg';
    if (book.fullAuthor.authorImg.url) {
        authorImgUrl = 'http://localhost:1337' + book.fullAuthor.authorImg.url;
    }

    let ratingText = 'No ratings yet';
if (book.ratings && book.ratings.length > 0) {
    const sum = book.ratings.reduce((total, r) => total + r.score, 0);
    const average = (sum / book.ratings.length).toFixed(1);
    ratingText = `Rating: ${average}/5 (${book.ratings.length} votes)`;
}


    bookElement.innerHTML = `
        <div class="clickable-area">
        <div class="book-cover">
            <img src="${coverUrl}" alt="${title}" class="book-cover-img">
        </div>
        <div class="book-info">
            <h3 class="book-title">${title}</h3>
            <p class="book-genre">${genreName}</p>
            <p class="book-author">${authorName} <img src="${authorImgUrl}" alt="${authorName}" class="book-author-img"></p>
            <p class="book-rating">${ratingText}</p>
        </div>
        </div>
    `;

    if (isLoggedIn()) {
        bookElement.innerHTML += `
                <button class="save-button">Add to Library</button>
        `;
    }
    
    const clickableArea = bookElement.querySelector('.clickable-area');

    clickableArea.addEventListener('click', () => {
        window.location.href = `/frontend/pages/book-details.html?id=${book.documentId}`;
    });

    const saveButton = bookElement.querySelector('.save-button');
if (saveButton) {
    saveButton.addEventListener('click', async (e) => {
        try {
            await saveBookToProfile(book.id);
            saveButton.textContent = 'Added to Library';
        } catch (error) {
            console.error('Error saving book:', error);
        }
    });
}  
    return bookElement;

}

