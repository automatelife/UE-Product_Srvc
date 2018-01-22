import express from 'express';
import product from '../services/product/controller/api';
import authApi from '../services/auth/controller/api';
import helper from '../services/helper';
import logApi from '../services/log/controller/api';
const pack = require('../package.json');

const router = express.Router();

/* GET api listing. */
router.get('/', (req, res, next) => {
    res.json( {
        err: null,
        message: {
            api: 'UE-Product_Srvc',
            version: pack.version,
            baseURL: '/api',
            copyright: 'Copyright (c) 2018 United Effects LLC'
        }
    });
});

//Public content
router.get('/public/products', product.getPublicProducts);
router.get('/public/product/:dns', product.getPublicProduct);

//register and authorization
router.get('/product', [authApi.isBearerAuthenticated, authApi.superAdminOnly], product.getProducts);
router.post('/product', [authApi.isBearerAuthenticated, authApi.superAdminOnly], product.postProduct);
router.get('/product/hooked/:slug', product.returnProductSlugHook);
router.get('/product/:slug', authApi.isBearerAuthenticated, product.returnProductSlug);
router.get('/product/:id', authApi.isBearerAuthenticated, product.returnProduct); //custom
router.patch('/product/:id', authApi.isBearerAuthenticated, product.findOneAndUpdate); //custom
router.delete('/product/:id', [authApi.isBearerAuthenticated, authApi.superAdminOnly], product.deleteProduct);
router.patch('/product/:id/firstuser/:option', [authApi.isBearerAuthenticated, authApi.superAdminOnly], product.changeFirstUserUpdate);

//logs - super only
router.get('/log/definitions', [authApi.isBearerAuthenticated, authApi.superAdminOnly], logApi.logDefinitions);
router.post('/log', [authApi.isBearerAuthenticated, authApi.superAdminOnly], logApi.newLog);
router.get('/logs', [authApi.isBearerAuthenticated, authApi.superAdminOnly], logApi.returnLogs);
router.post('/logs/range', [authApi.isBearerAuthenticated, authApi.superAdminOnly], logApi.returnRange);
router.get('/logs/:code', [authApi.isBearerAuthenticated, authApi.superAdminOnly], logApi.returnByCode);
router.get('/log/search', [authApi.isBearerAuthenticated, authApi.superAdminOnly], logApi.search);
router.get('/health', [authApi.isBearerAuthenticated, authApi.superAdminOnly], (req, res) => {
    res.json({err: null, data: {server: 'running', mongo: helper.mongoStatus()}});
});

export default router;