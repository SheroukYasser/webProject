import sequelize from '../config/db.js';
import { DataTypes, Op } from 'sequelize';
import bookModel from '../models/Books.js';

const Book = bookModel(sequelize, DataTypes);

class BookService {
  async createBook(bookData) {
    return await Book.create(bookData);
  }

  async getAllBooks(query = {}) {
    const { title } = query;
    const where = {};

    if (title) {
      where.title = { [Op.like]: `%${title}%` };
    }

    return await Book.findAll({ where });
  }

  async getBookById(id) {
    return await Book.findByPk(id);
  }

  async updateBook(id, bookData) {
    const book = await Book.findByPk(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return await book.update(bookData);
  }

  async deleteBook(id) {
    const book = await Book.findByPk(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return await book.destroy();
  }
}

export default new BookService();
