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

  Role.findOrCreate({
    where: { name: 'user' },
    defaults: { desc: 'User ROLE' }
  })
  .spread((role, userRoleCreated) => {

    Role.findOrCreate({
      where: { name: 'admin' },
      defaults: { desc: 'Admin ROLE' }
    })
    .spread((role, adminRoleCreated) => {

      User.findOrCreate({
        where: { username: config.defaultAdminCreds.adminUserName },
        defaults: {
          password: config.defaultAdminCreds.adminUserPass,
          desc: 'Default Administrative user'
        }
      })
      .spread((user, userCreated) => {
        user.setRole(role);
        if (userCreated){
          console.log('initialized Admin User.')
        }
      });

      if (adminRoleCreated){
        console.log('initialized Admin ROLE')
      }
    });

    if (userRoleCreated){
      console.log('initialized User ROLE.')
    }
  });  
});

module.exports = {User, Role};
