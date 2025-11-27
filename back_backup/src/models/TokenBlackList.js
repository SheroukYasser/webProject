export default (sequelize, DataTypes) => {
  const TokenBlacklist = sequelize.define("TokenBlacklist", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    blacklisted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "token_blacklist",
    timestamps: false
  });

  return TokenBlacklist;
};