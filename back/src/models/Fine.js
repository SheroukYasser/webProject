export default (sequelize, DataTypes) => {
  const Fine = sequelize.define("Fine", {
    fine_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    borrowing_id: {
      type: DataTypes.INTEGER,
      references: { model: "borrowings", key: "borrowing_id" }
    },
    member_id: {
      type: DataTypes.INTEGER,
      references: { model: "members", key: "member_id" }
    },
    amount: DataTypes.DECIMAL(10,2),
    paid: { type: DataTypes.ENUM("yes", "no"), defaultValue: "no" },
    generated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "fines",
    timestamps: false
  });

  return Fine;
};
