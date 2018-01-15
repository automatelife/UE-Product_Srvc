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
    profileLogo: process.env.PROFILELOGO || 'https://ue-platform-content.s3.amazonaws.com/UEAuth_icon_500px.png',
    primaryLogo: process.env.PRIMARYLOGO || 'https://ue-platform-content.s3.amazonaws.com/color_logo_transparent%401800px.png',
    defaultProduct: {
        name: 'United Effects Auth',
        slug: 'united_effects_auth',
        url: 'https://app.uauth.io',
        dnsRef: 'app',
        creator: 'admin',
        private: true,
        enable_first_user: true,
        license_lock: true,
        private_code: process.env.DEFAULT_PROD_CODE || 'YOUR-PRIVATE-CODE-HERE', //Never display this anywhere and make sure you disable 'enable_first_user' later
        meta: {
            info: 'Auto created on startup'
        }
    }
};

module.exports = config;