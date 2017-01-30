/**
 * Created by borzou on 11/26/16.
 */
//rename this file to config.js and change the values to suit your needs

var config = {
    defaultMongo: (process.env.MONGO) ? process.env.MONGO : 'mongodb://localhost:27017/ue-product-auth',
    swaggerDomain: (process.env.SWAG_DOM) ? process.env.SWAG_DOM : 'localhost:4030',
    gatewayDomain: (process.env.GATEWAY) ? process.env.GATEWAY : 'localhost:5000',
    userApiServer: 'http://localhost:4000', //todo wip: this will be deleted when gateway is available
    authApiServer: 'http://localhost:4010' //todo wip: this will be deleted when gateway is available
};

module.exports = config;
