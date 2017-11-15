import express from 'express';
import product from '../services/product/controller/api';
import authApi from '../services/auth/controller/api';
import helper from '../services/helper';
import logApi from '../services/log/controller/api';
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res, next) => {
    res.json( {
        err: null,
        message: {
            api: 'UE-Product_Srvc',
            version: '1.0.0',
            baseURL: '/api',
            copyright: 'Copyright (c) 2017 theBoEffect LLC'
        }
    });
});

//register and authorization
router.get('/product', authApi.isBearerAuthenticated, product.getProducts);
router.post('/product', authApi.isBearerAuthenticated, product.postProduct);
router.get('/product/:slug', authApi.isBearerAuthenticated, product.returnProductSlug);
router.get('/product/hooked/:slug', product.returnProductSlugHook);
router.get('/product/:id', authApi.isBearerAuthenticated, product.returnProduct);
router.patch('/product/:id', authApi.isBearerAuthenticated, product.findOneAndUpdate);
router.delete('/product/:id', authApi.isBearerAuthenticated, product.deleteProduct);

//transfers - move this to userauth
router.post('/product/:slug/transfer', authApi.isBearerAuthenticated, product.createTransferCode); // super admin and owner only
router.post('/product/:slug/transfer/:code', authApi.isBearerAuthenticated, product.takeOwnership); //any registered user


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