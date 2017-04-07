/**
 * Created by borzou on 4/6/17.
 */

var config = require('./config');

var events = {
    productUpdates: function(body, prod) {
        return [{
            product_id: prod._id,
            product_slug: prod.slug,
            request: {
                method: 'PATCH',
                uri: config.userApiServer + '/api/user/products/hooked/' + prod.slug + '?code=' + config.webhook,
                json: {
                    product_name: body.name,
                    product_slug: body.slug,
                    active: body.active
                }
            }
        }, {
            product_id: prod.id,
            product_slug: prod.slug,
            request: {
                method: 'PATCH',
                uri: config.licenseApiServer + '/api/licenses/product/' + prod.slug + '?code=' + config.webhook,
                json: {
                    product_name: body.name,
                    product_slug: body.slug,
                    product_active: body.active
                }
            }
        }]
    },
    productUpdatesCount: function(){
        return this.productUpdates.length;
    }
};

module.exports = events;
