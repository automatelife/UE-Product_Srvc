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
            copyright: 'Copyright (c) 2017 theBoEffect LLC'
        }
    });
});

//Public content
router.get('/public/products', product.getPublicProducts);

//register and authorization
router.get('/product', authApi.isBearerAuthenticated, product.getProducts);
router.post('/product', authApi.isBearerAuthenticated, product.postProduct);
router.get('/product/:slug', authApi.isBearerAuthenticated, product.returnProductSlug);
router.get('/product/hooked/:slug', product.returnProductSlugHook);
router.get('/product/:id', authApi.isBearerAuthenticated, product.returnProduct);
router.patch('/product/:id', authApi.isBearerAuthenticated, product.findOneAndUpdate);
router.delete('/product/:id', authApi.isBearerAuthenticated, product.deleteProduct);
router.patch('/product/:id/firstuser/:option', authApi.isBearerAuthenticated, product.changeFirstUserUpdate); //Super admin only

//logs
router.get('/log/definitions', authApi.isBearerAuthenticated, logApi.logDefinitions);
router.post('/log', authApi.isBearerAuthenticated, logApi.newLog);
router.get('/logs', authApi.isBearerAuthenticated, logApi.returnLogs);
router.post('/logs/range', authApi.isBearerAuthenticated, logApi.returnRange);
router.get('/logs/:code', authApi.isBearerAuthenticated, logApi.returnByCode);
router.get('/log/search', authApi.isBearerAuthenticated, logApi.search);
router.get('/health', authApi.isBearerAuthenticated, (req, res) => {
    res.json({err: null, data: {server: 'running', mongo: helper.mongoStatus()}});
});

export default router;