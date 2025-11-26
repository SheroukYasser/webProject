export default (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    book_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: DataTypes.STRING(200),
    author: DataTypes.STRING(150),
    isbn: { type: DataTypes.STRING(50), unique: true },
    publication_year: DataTypes.INTEGER,
    total_copies: DataTypes.INTEGER,
    available_copies: DataTypes.INTEGER,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "books",
    timestamps: false
  });

  return Book;
};
