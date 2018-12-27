module.exports = (dbConnection, sequelize) => {
  return dbConnection.define('User', {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: sequelize.STRING,
      allowNull: false,
      unique: false
    },
    desc: {
      type: sequelize.STRING
    }
  });
};
