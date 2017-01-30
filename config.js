/**
 * Created by borzou on 11/26/16.
 */
var config = {
    defaultMongo: (process.env.MONGO) ? process.env.MONGO : 'mongodb://localhost:27017/ue-product-auth',
    swaggerDomain: (process.env.SWAG_DOM) ? process.env.SWAG_DOM : 'localhost:4030',
    gatewayDomain: (process.env.GATEWAY) ? process.env.GATEWAY : 'localhost:5000',
    userApiServer: 'http://localhost:4000', //this will be deleted when API is running
    authApiServer: 'http://localhost:4010' //currently pointing to the service but will point to the api when ready
};

module.exports = config;