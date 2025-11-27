export default (sequelize, DataTypes) => {
  const Session = sequelize.define("Session", {
    session_id: {
      type: DataTypes.STRING(64),
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_type: {
      type: DataTypes.ENUM('member', 'librarian'),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: "sessions",
    timestamps: false
  });

  return Session;
};