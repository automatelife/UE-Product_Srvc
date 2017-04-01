/**
 * Created by borzou on 11/26/16.
 */

var config = {
    defaultMongo: (process.env.MONGO) ? process.env.MONGO : 'mongodb://localhost:27017/ue-product-auth',
    swaggerDomain: (process.env.SWAG_DOM) ? process.env.SWAG_DOM : 'localhost:4030',
    userApiServer: (process.env.USERAUTH) ? process.env.USERAUTH : 'http://localhost:4000',
    authApiServer: (process.env.DOMAIN) ? process.env.DOMAIN : 'http://localhost:4010'
};

module.exports = config;
