import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function test() {
    try {
        console.log('--- Starting Tests ---');

        // 1. Signup a member
        console.log('\n1. Signing up a member...');
        const memberData = {
            full_name: 'Test Member',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            phone: '1234567890'
        };
        const signupRes = await axios.post(`${API_URL}/auth/signup`, memberData);
        const memberId = signupRes.data.user.id;
        console.log('Member created:', memberId);

        // 2. Create a book
        console.log('\n2. Creating a book...');
        const bookData = {
            title: 'Test Book',
            author: 'Test Author',
            isbn: `ISBN${Date.now()}`,
            publication_year: 2023,
            total_copies: 5,
            available_copies: 5
        };
        const bookRes = await axios.post(`${API_URL}/books`, bookData);
        const bookId = bookRes.data.data.book_id;
        console.log('Book created:', bookId);

        // 3. Get all books
        console.log('\n3. Getting all books...');
        const booksRes = await axios.get(`${API_URL}/books`);
        console.log('Books count:', booksRes.data.data.length);

        // 4. Create a reservation
        console.log('\n4. Creating a reservation...');
        const reservationData = {
            member_id: memberId,
            book_id: bookId
        };
        const reservationRes = await axios.post(`${API_URL}/reservations`, reservationData);
        const reservationId = reservationRes.data.data.reservation_id;
        console.log('Reservation created:', reservationId);

        // 5. Get reservations
        console.log('\n5. Getting reservations...');
        const reservationsRes = await axios.get(`${API_URL}/reservations`);
        console.log('Reservations count:', reservationsRes.data.data.length);

        // 6. Cancel reservation
        console.log('\n6. Cancelling reservation...');
        await axios.put(`${API_URL}/reservations/${reservationId}/cancel`);
        console.log('Reservation cancelled');

        // 7. Delete book
        console.log('\n7. Deleting book...');
        await axios.delete(`${API_URL}/books/${bookId}`);
        console.log('Book deleted');

        console.log('\n--- Tests Completed Successfully ---');

    } catch (error) {
        console.error('\n!!! Test Failed !!!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

test();
