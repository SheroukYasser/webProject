import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import BookModel from './Books.js';
import MemberModel from './Member.js';
import BorrowingModel from './Borrowing.js';
import FineModel from './Fine.js';

const Book = BookModel(sequelize, DataTypes);
const Member = MemberModel(sequelize, DataTypes);
const Borrowing = BorrowingModel(sequelize, DataTypes);
const Fine = FineModel(sequelize, DataTypes);

// Define Associations
Member.hasMany(Borrowing, { foreignKey: 'member_id' });
Borrowing.belongsTo(Member, { foreignKey: 'member_id' });

Book.hasMany(Borrowing, { foreignKey: 'book_id' });
Borrowing.belongsTo(Book, { foreignKey: 'book_id' });

Borrowing.hasOne(Fine, { foreignKey: 'borrowing_id' });
Fine.belongsTo(Borrowing, { foreignKey: 'borrowing_id' });

Member.hasMany(Fine, { foreignKey: 'member_id' });
Fine.belongsTo(Member, { foreignKey: 'member_id' });

export { sequelize, Member, Book, Borrowing, Fine };