import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import BookModel from './Books.js';
import MemberModel from './Member.js';
import BorrowingModel from './Borrowing.js';
import FineModel from './Fine.js';
import ReservationModel from './Reservation.js';
import LibrarianModel from './Librarian.js';
import CategoryModel from './Category.js';
import BookCategoryModel from './BookCategory.js';


const Book = BookModel(sequelize, DataTypes);
const Member = MemberModel(sequelize, DataTypes);
const Borrowing = BorrowingModel(sequelize, DataTypes);
const Fine = FineModel(sequelize, DataTypes);
const Reservation = ReservationModel(sequelize, DataTypes);
const Librarian = LibrarianModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const BookCategory = BookCategoryModel(sequelize, DataTypes);


// Define Associations
Member.hasMany(Borrowing, { foreignKey: 'member_id' });
Borrowing.belongsTo(Member, { foreignKey: 'member_id' });

Book.hasMany(Borrowing, { foreignKey: 'book_id' });
Borrowing.belongsTo(Book, { foreignKey: 'book_id' });

Borrowing.hasOne(Fine, { foreignKey: 'borrowing_id' });
Fine.belongsTo(Borrowing, { foreignKey: 'borrowing_id' });

Member.hasMany(Fine, { foreignKey: 'member_id' });
Fine.belongsTo(Member, { foreignKey: 'member_id' });

Member.hasMany(Reservation, { foreignKey: 'member_id' });
Reservation.belongsTo(Member, { foreignKey: 'member_id' });

Book.belongsToMany(Category, {
  through: BookCategory,
  foreignKey: "book_id",
  otherKey: "category_id"
});

Category.belongsToMany(Book, {
  through: BookCategory,
  foreignKey: "category_id",
  otherKey: "book_id"
});


export { sequelize, Member, Book, Borrowing, Fine ,Reservation,Librarian,Category,BookCategory};