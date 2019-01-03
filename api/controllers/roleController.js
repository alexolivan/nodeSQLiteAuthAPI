const Models = require('../models/dbConnection.js');
const Role = Models.Role

// Auxiliary function for common validation
validateBody = (req, res) => {
  if(!req.body.name) {
    return {
        sucess: false,
        httpCode: 400,
        message: "Role name field cannot be empty."
    };
  }
  return { success: true}
};

// Create and Save a new Role
exports.create = (req, res) => {

  // Validate request
  validation = validateBody(req);
  if (!validation.success) {
    return res.status(validation.httpCode).send({
        message: validation.message
    });
  }

  // Create a Role
  const role = new Role({
    name: req.body.name,
    desc: req.body.desc || ""
  });

  // Save Role in the database
  role.save()
  .then(data => {
    res.status(201).send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Role."
    });
  });
};

// Retrieve and return all roles from the database.
exports.findAll = (req, res) => {
  Role.findAll()
  .then(roles => {
    res.status(200).send(roles);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving roles."
    });
  });
};

// Find a single role with a roleId
exports.findOne = (req, res) => {
  Role.findByPk(req.params.roleId)
  .then(role => {
    if(!role) {
      return res.status(404).send({
        message: "Role not found with id " + req.params.roleId
      });
    }
    res.status(200).send(role);
  }).catch(err => {
    return res.status(500).send({
      message: "Error retrieving role with id " + req.params.roleId
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

  // Find role and update it with the request body
  Role.update(
    {
      name: req.body.name,
      desc: req.body.desc || ""
    },
    {
      where: {
        id: req.params.roleId
      }
    }
  ).then(rowsData => {
    if (rowsData[0] == 0){
      return res.status(404).send({
        message: "Role not found with id " + req.params.roleId
      });
    } else {
      Role.findByPk(req.params.roleId)
      .then(role => {
        res.status(202).send(role);
      });
    }
  }).catch(err => {
    return res.status(500).send({
      message: "Error updating role with id " + req.params.roleId
    });
  });
};

// Delete a role with the specified roleId in the request
exports.delete = (req, res) => {
  Role.destroy({
    where: { id: req.params.roleId }
  })
  .then(rowsCount => {
    if (rowsCount == 0){
      return res.status(404).send({
        message: "Role not found with id " + req.params.roleId
      });
    } else {
      res.status(202).send({message: "Role deleted successfully!"});
    }
  }).catch(err => {
    return res.status(500).send({
        message: "Error deleting role with id " + req.params.roleId
    });
  });
};
