export default (sequelize, DataTypes) => {
  const Member = sequelize.define("Member", {
    member_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    full_name: { type: DataTypes.STRING(150) },
    email: { type: DataTypes.STRING(120), unique: true },
    password: { type: DataTypes.STRING(255) },
    phone: { type: DataTypes.STRING(20) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "members",
    timestamps: false
  });

  return Member;
};
