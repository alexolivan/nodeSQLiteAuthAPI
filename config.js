const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
 app: {
   port: 3000
 },
 db: {
   dbName: 'sqliteDB',
   dbUser: 'dbUser',
   dbPass: 'dbPass',
   path: 'data/db/storage.sqlite'
 },
 jwt: {
   secret: 'myJWTVerySecret'
 },
 defaultAdminCreds: {
   adminUserName: 'admin',
   adminUserPass: 'verySecret'
 }
};

const test = {
 app: {
   port: 3000
 },
 db: {
   dbName: 'sqliteDB',
   dbUser: 'dbUser',
   dbPass: 'dbPass',
   path: 'data/db/storage.sqlite'
 },
 jwt: {
   secret: 'myJWTVerySecret'
 },
 defaultAdminCreds: {
   adminUserName: 'admin',
   adminUserPass: 'verySecret'
 }
};

const config = {
 dev,
 test
};

module.exports = config[env];
