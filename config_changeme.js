/**
 * Created by borzou on 4/1/17.
 */
const config = {
    defaultMongo: process.env.MONGO || 'mongodb://localhost:27017/ue-product-auth',
    swaggerDomain: process.env.SWAG_DOM || 'localhost:4030',
    userApiServer: process.env.USERAUTH || 'http://localhost:4000',
    authApiServer: process.env.DOMAIN || 'http://localhost:4010',
    replica: process.env.REPLICA || 'rs0',
    webhook: process.env.WEBHOOK || 'YOUR-SECRET-HERE',
    protocol: process.env.PROTOCOL || 'http',
    defaultLogoPath: process.env.DEFAULTLOGO || '/img/default.png',
    licenseApiServer: process.env.LICENSE || 'http://localhost:4020',
    defaultProduct: {
        name: 'United Effects Auth',
        slug: 'united_effects_auth',
        url: 'https://auth.unitedeffects.com',
        owner: 'admin',
        private: true,
        enable_first_user: true,
        private_code: process.env.DEFAULT_PROD_CODE || 'YOUR-PRIVATE-CODE-HERE', //Never display this anywhere and make sure you disable 'enable_first_user' later
        meta: {
            info: 'Auto created on startup'
        }
    }
};

config.defaultLogo = `${config.protocol}://${config.swaggerDomain}${config.defaultLogoPath}`;

module.exports = config;