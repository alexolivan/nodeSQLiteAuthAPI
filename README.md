A very basic 'base' project to test, practice, familiarize and proof-of-concept
of a SQLite3/Sequelize/NodeJS/Express RESTful API featuring authentication and
authorization.

The model is simple as the two basic Classes, User and Role, which serve, both
as example and as Authentication (User) / Authorization (Role) basis.

- Authentication and authorization are performed as a chain of
  middleware filtering processes in router.
- Authentication is based in JWT using jsonwebtoken.
- Models / Persistence is based on Sequelize.
- An open login endpoint provides the JWT generation mechanism.
  User and password credentials are validated against DB.
  User and Role are stored as part of token.
- Middleware athentication validates and decodes token getting
- Middleware authorization compares token role with required Role.
- Routers do chain-use authentication and authorization middleware.

CONFIG (not for prod... just for test/demo purposes only!):
- Configuration stored in config.js based in process NODE_ENV env var
- NODE_ENV set in package.json start script

CREDS (... demo/test purposes!)
- A pair of roles admin and user are created when initializing DB.
- An admin role user is created when initializing DB. Username and password
  are defined in config.js file.
