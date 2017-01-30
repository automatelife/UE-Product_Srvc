var express = require('express');
var product = require('../services/product/controller/api');
var authApi = require('../services/auth/controller/api');
var helper = require('../services/helper');
var config = require('../config');
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
router.post('/product', authApi.isBearerAdmin, product.getProducts);
router.get('/product', authApi.isBearerAdmin, product.postProduct);

//auth check
router.get('/checkauth', authApi.isBearerAuthenticated, authApi.validate); //could remove this later

//healthcheck
router.get('/health', function(req, res){
    res.json({err: null, data: {server: 'running', mongo: helper.mongoStatus()}});
});



module.exports = router;