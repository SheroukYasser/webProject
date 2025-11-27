export default (sequelize, DataTypes) => {
  const Borrowing = sequelize.define("Borrowing", {
    borrowing_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    member_id: {
      type: DataTypes.INTEGER,
      references: { model: "members", key: "member_id" }
    },
    book_id: {
      type: DataTypes.INTEGER,
      references: { model: "books", key: "book_id" }
    },
    borrowed_at: DataTypes.DATEONLY,
    due_date: DataTypes.DATEONLY,
    returned_at: { type: DataTypes.DATEONLY, allowNull: true },
    fine_amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 }
  }, {
    tableName: "borrowings",
    timestamps: false
  });

  return Borrowing;
};
