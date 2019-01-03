const jwt = require('jsonwebtoken');
const config = require('../../config');

const Models = require('../models/dbConnection.js');
const Role = Models.Role
const User = Models.User

// Auxiliary function for common validation
validateBody = (req) => {
  if(!req.body.username) {
    return {
        sucess: false,
        httpCode: 400,
        message: "User username field cannot be empty."
    };
  }
  if( !req.body.password) {
    return {
        sucess: false,
        httpCode: 400,
        message: "User password field cannot be empty."
    };
  }
  if(!req.body.role) {
    return {
        sucess: false,
        httpCode: 400,
        message: "User role field cannot be empty."
    };
  }
  return { success: true}
};

// Login user
exports.login = (req, res) => {
  // no auth on HTTP req ... no joy
  if(!req.body.username || !req.body.password) {
    return res.status(403).send({
        message: "Login failed."
    });
  }
  // authenticate user agains database
  User.findOne({
    where: { username: req.body.username }
  })
  .then(user => {
    if(!user) {
      // user not found, auth fails
      return res.status(403).send({
          message: "Login failed."
      });
    }
    if(user.password != req.body.password){
      // user password not matching, auth fails.
      return res.status(403).send({
          message: "Login failed."
      });
    }
    // User OK, retrieve authorization level role
    user.getRole()
    .then(role => {
      if(!role) {
        // role not found, auth fails
        return res.status(403).send({
            message: "Login failed3."
        });
      }
      // Taylor JWT token along with user and role.
      const token = jwt.sign(
        {
          username: req.body.username,
          role: role.name
        },
        config.jwt.secret,
        { expiresIn: '1h' }
      );
      res.status(200).send({
        success: true,
        message: 'Authentication successful!',
        role: role.name,
        token: token
      });
    // Can't get Role ... auth fails.
    }).catch(err => {
      return res.status(403).send({
          message: "Login Failed4."
      });
    });
  // Can't get User... auth fails.
  }).catch(err => {
    return res.status(403).send({
        message: "Login Failed5."
    });
  });
};

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  validation = validateBody(req);
  if (!validation.success) {
    return res.status(validation.httpCode).send({
        message: validation.message
    });
  }

  Role.findOne({
    where: { name: req.body.role }
  })
  .then(role => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      desc: req.body.desc || ""
    });
    // Save User in the database 1ST
    user.save()
    .then(data => {
      // Once saved OK, ask sequelize to associate objects
      user.setRole(role);
      res.status(201).send(data);
    }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the User."
      });
    });
  }).catch(err => {
    return res.status(500).send({
        message: err.message || "Some error occurred while retrieving role."
    });
  });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  User.findAll()
  .then(users => {
    res.status(200).send(users);
  }).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
    });
  });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  User.findByPk(req.params.userId)
  .then(user => {
      if(!user) {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });
      }
      res.status(200).send(user);
  }).catch(err => {
    return res.status(500).send({
        message: "Error retrieving user with id " + req.params.userId
    });
  });
};

// Update a role identified by the roleId in the request
exports.update = (req, res) => {
  // Validate request
  validation = validateBody(req);
  if (!validation.success) {
    return res.status(validation.httpCode).send({
        message: validation.message
    });
  }

  Role.find({
    where: { name: req.body.role }
  })
  .then(role => {
    if (!role){
      return res.status(500).send({
          message: "Role not found updating user with id " + req.params.userId
      });
    }
    // Find User and update it with the request body
    User.update(
      {
        username: req.body.username,
        password: req.body.password,
        desc: req.body.desc || ""
      },
      {
        where: {
          id: req.params.userId
        }
      }
    ).then(rowsData => {
      if (rowsData[0] == 0){
        return res.status(404).send({
            message: "User not found with id " + req.params.userId
        });
      } else {
        User.findByPk(req.params.userId)
        .then(user => {
          // Once saved OK, ask sequelize to associate objects
          user.setRole(role);
          res.status(202).send(user);
        });
      }
    });
  }).catch(err => {
    return res.status(500).send({
        message: "Error updating user with id " + req.params.userId
    });
  });
};

// Delete an User with the specified userId in the request
exports.delete = (req, res) => {
  User.destroy({
    where: { id: req.params.userId }
  })
  .then(rowsCount => {
    if (rowsCount == 0){
        return res.status(404).send({
            message: "User not found with id " + req.params.userId
        });
    } else {
        res.status(202).send({message: "User deleted successfully!"});
    }
  }).catch(err => {
      return res.status(500).send({
          message: "Error deleting user with id " + req.params.userId
      });
  });
};
