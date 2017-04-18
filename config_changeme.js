/**
 * Created by borzou on 4/1/17.
 */
var config = {
    defaultMongo: (process.env.MONGO) ? process.env.MONGO : 'mongodb://localhost:27017/ue-product-auth',
    swaggerDomain: (process.env.SWAG_DOM) ? process.env.SWAG_DOM : 'localhost:4030',
    userApiServer: (process.env.USERAUTH) ? process.env.USERAUTH : 'http://localhost:4000',
    authApiServer: (process.env.DOMAIN) ? process.env.DOMAIN : 'http://localhost:4010',
    webhook: (process.env.WEBHOOK) ? process.env.WEBHOOK : 'YOUR-SECRET-HERE',
    defaultProduct: {
        name: 'United Effects Auth',
        slug: 'united_effects_auth',
        url: 'https://auth.unitedeffects.com',
        owner: 'admin',
        private: true,
        private_code: (process.env.DEFAULT_PROD_CODE) ? (process.env.DEFAULT_PROD_CODE) : 'YOUR-PRIVATE-CODE-HERE',
        meta: {
            info: 'Auto created on startup'
        }
    }
};

module.exports = config;
