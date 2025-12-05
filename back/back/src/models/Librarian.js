export default (sequelize, DataTypes) => {
  const Librarian = sequelize.define("Librarian", {
    librarian_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    full_name: DataTypes.STRING(150),
    email: { type: DataTypes.STRING(120), unique: true },
    password: DataTypes.STRING(255),
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "librarians",
    timestamps: false
  });

  return Librarian;
};
