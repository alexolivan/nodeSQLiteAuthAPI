const config = require('./config');
//const sequelize = require('./dbConnection');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// create express app
const app = express();

// Handle CORS
app.use(cors())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

require('./api/routes/roleRoutes.js')(app);
require('./api/routes/userRoutes.js')(app);

// listen for requests
app.listen(config.app.port, () => {
    console.log("Server is listening on port " + config.app.port);
});
