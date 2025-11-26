export default (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    category_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    category_name: { type: DataTypes.STRING(120), unique: true }
  }, {
    tableName: "categories",
    timestamps: false
  });

  return Category;
};
