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
    timestamps: false,
       hooks: {
    async afterUpdate(book) {
        const previous = book.previous('available_copies');
        const now = book.available_copies;

        // Trigger only when stock increases (prev < now)
        if (now > previous) {
            const reservationService = (await import("../services/reservationService.js")).default;
            await reservationService.notifyNextReservations(book.book_id);
        }
    }
}
  }
);

  return Book;
};
