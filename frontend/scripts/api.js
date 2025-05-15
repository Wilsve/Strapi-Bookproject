// Base URL
const BASE_URL = 'http://localhost:1337/api';

// Fetch all books from API
export async function fetchBooks(){
    try {
        const response = await axios.get(`${BASE_URL}/books?populate=*`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
 };
 // Fetch a single book by ID
 export async function fetchBookById(documentId) {
    try {
        const response = await axios.get(`${BASE_URL}/books/${documentId}?pLevel=3`);
        return response.data;

    } catch (error) {
        console.error('Error fetching book by ID:', error);
        throw error;
    }
}
// Fetch  authors
export async function fetchAuthors() {
    try {
        const response = await axios.get(`${BASE_URL}/authors?populate=*`);
        return response.data;
    } catch (error) {
        console.error('Error fetching authors:', error);
        throw error;
    }
}
//Fetch userprofile
export async function fetchUserProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/users/me?populate=savedBooks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
        
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};
// Save book to user profile
export async function saveBookToProfile(bookId) {
    try {
        const token = localStorage.getItem('token');
        const user = await fetchUserProfile();
        const currentSavedBooks = user.savedBooks?.map(book => book.id) || [];

        if (!currentSavedBooks.includes(bookId)) {
            const updatedSavedBooks = [...currentSavedBooks, bookId];
            await axios.put(`${BASE_URL}/users/${user.id}`, {
                savedBooks: updatedSavedBooks
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return true;
        } 
        return false;
    }
    catch (error) {
        console.error('Error saving book to profile:', error);
        throw error;
    }
};
// Remove book from user profile
export async function removeBookFromProfile(bookId) {
    try {
        const token = localStorage.getItem('token');
        const user = await fetchUserProfile(); 

        const currentSavedBooks = user.savedBooks?.map(book => book.id) || [];
        const updatedSavedBooks = currentSavedBooks.filter(id => id !== bookId);
        
        const response = await axios.put(`${BASE_URL}/users/${user.id}`, {
            savedBooks: updatedSavedBooks
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return true;
    }
    catch (error) {
        console.error('Error removing book from profile:', error);
        throw error;
    }
}
// Fetch Active Theme
export async function fetchActiveTheme() {
    try {
        const response = await axios.get(`${BASE_URL}/active-theme?pLevel=3`);
        return response.data.data.selectedTheme;
    } catch (error) {
        console.error('Error fetching active theme:', error);
        throw error;
    }   
};
//Add rating
export async function addRating(bookId, score) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to add a rating.');
      }
      
      // Get user profile with validation
      const userProfile = await fetchUserProfile();
      if (!userProfile || !userProfile.id) {
        throw new Error('Could not retrieve user profile or user ID');
      }
      const userId = userProfile.id;

      // POST request to add rating
      const response = await axios.post(`${BASE_URL}/ratings`, {
        data: {
          score: score,
          book: bookId,
          users_permissions_user: userId
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }
// Fech user ratings
export async function fetchUserRatings() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please log in to view your ratings.');
        }
        
        const userProfile = await fetchUserProfile();
        if (!userProfile || !userProfile.id) {
            throw new Error('Could not retrieve user profile.');
        }
        
        const userId = userProfile.id;
        // Filter only logged in user
        const response = await axios.get(`${BASE_URL}/ratings?pLevel=3`, {
            params: {
                'filters[users_permissions_user][id]': userId
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user ratings:', error);
        throw error;
    }
}



