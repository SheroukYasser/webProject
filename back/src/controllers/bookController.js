import bookService from '../services/bookService.js';

class BookController {
    async createBook(req, res, next) {
        try {
            const book = await bookService.createBook(req.body);
            res.status(201).json({ success: true, data: book });
        } catch (error) {
            next(error);
        }
    }

    async getAllBooks(req, res, next) {
        try {
            const books = await bookService.getAllBooks(req.query);
            res.status(200).json({ success: true, data: books });
        } catch (error) {
            next(error);
        }
    }

    async getBookById(req, res, next) {
        try {
            const book = await bookService.getBookById(req.params.id);
            if (!book) {
                return res.status(404).json({ success: false, message: 'Book not found' });
            }
            res.status(200).json({ success: true, data: book });
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req, res, next) {
        try {
            const book = await bookService.updateBook(req.params.id, req.body);
            res.status(200).json({ success: true, data: book });
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req, res, next) {
        try {
            await bookService.deleteBook(req.params.id);
            res.status(200).json({ success: true, message: 'Book deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default new BookController();
