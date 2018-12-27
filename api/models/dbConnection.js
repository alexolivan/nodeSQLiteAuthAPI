const sequelize = require('sequelize');
const config = require('../../config');

const RoleModel = require('./Role.js');
const UserModel = require('./User.js');

const dbConnection = new sequelize(config.db.Name, config.db.dbUser, config.db.dbPass, {
  dialect: 'sqlite',
  storage: config.db.path
});

dbConnection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully...');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Role = RoleModel(dbConnection, sequelize);
const User = UserModel(dbConnection, sequelize);
Role.hasMany(User);
User.belongsTo(Role);

dbConnection.sync()
.then(() => {
  console.log('...database initialized!');
});

module.exports = {User, Role};
