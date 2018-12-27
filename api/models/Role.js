module.exports = (dbConnection, sequelize) => {
  return dbConnection.define('Role', {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true
    },
    desc: {
      type: sequelize.STRING
    }
  });
};
