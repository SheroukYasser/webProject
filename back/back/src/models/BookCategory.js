export default (sequelize, DataTypes) => {
  const BookCategory = sequelize.define("BookCategory", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    book_id: {
      type: DataTypes.INTEGER,
      references: { model: "books", key: "book_id" },
      onDelete: "CASCADE"
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: { model: "categories", key: "category_id" },
      onDelete: "CASCADE"
    }
  }, {
    tableName: "books_categories",
    timestamps: false
  });

  return BookCategory;
};
