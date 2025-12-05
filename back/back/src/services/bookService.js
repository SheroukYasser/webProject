import sequelize from '../config/db.js';
import { DataTypes, Op } from 'sequelize';
import bookModel from '../models/Books.js';

const Book = bookModel(sequelize, DataTypes);

class BookService {
  async createBook(bookData) {
    return await Book.create(bookData);
  }

  async getAllBooks(queryParams = {}) {
    const { search, title, author, category } = queryParams;
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } }
      ];
    }

    if (title) where.title = { [Op.like]: `%${title}%` };
    if (author) where.author = { [Op.like]: `%${author}%` };
    if (category) where.category = { [category.like]: `%${category}%` };

    return await Book.findAll({ where });
  }

  async getFilteredBooks(query = {}) {
    const { author, category, year } = query;
    const where = {};

    if (author) {
      where.author = { [Op.like]: `%${author}%` };
    }

    if (category) {
      where.category = { [Op.like]: `%${category}%` };
    }

    if (year) {
      where.publication_year = year;
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
