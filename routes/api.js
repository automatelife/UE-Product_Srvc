var express = require('express');
var product = require('../services/product/controller/api');
var authApi = require('../services/auth/controller/api');
var helper = require('../services/helper');
var config = require('../config');
var logApi = require('../services/log/controller/api');
var router = express.Router();

/* GET api listing. */
router.get('/', function(req, res, next) {
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


//logs
router.get('/log/definitions', authApi.isBearerAuthenticated, logApi.logDefinitions);
router.post('/log', authApi.isBearerAuthenticated, logApi.newLog);
router.get('/logs', authApi.isBearerAuthenticated, logApi.returnLogs);
router.post('/logs/range', authApi.isBearerAuthenticated, logApi.returnRange);
router.get('/logs/:code', authApi.isBearerAuthenticated, logApi.returnByCode);
router.get('/log/search', authApi.isBearerAuthenticated, logApi.search);
router.get('/health', authApi.isBearerAuthenticated, function(req, res){
    res.json({err: null, data: {server: 'running', mongo: helper.mongoStatus()}});
});



module.exports = router;