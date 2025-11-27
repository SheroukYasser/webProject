export default (sequelize, DataTypes) => {
  const Reservation = sequelize.define("Reservation", {
    reservation_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    member_id: {
      type: DataTypes.INTEGER,
      references: { model: "members", key: "member_id" }
    },
    book_id: {
      type: DataTypes.INTEGER,
      references: { model: "books", key: "book_id" }
    },
    reservation_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM("pending", "notified", "cancelled"), defaultValue: "pending" }
  }, {
    tableName: "reservations",
    timestamps: false
  });

  return Reservation;
};
