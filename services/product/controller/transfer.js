// this all probably belongs in user auth

import moment from 'moment';
import Transfer from '../model/transfer';
import PromiseB from 'bluebird';
const product = PromiseB.promisifyAll(require('./product').default);
import send from '../../callback';

function uid (len) {
    let buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (let i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    /**
     * return 400 if missing id or slug
     * product that doesn't exist returns 400
     * return output object if present
     * @param options
     * @returns {Promise}
     */
    createTransferCode(options) {
        return new Promise((resolve, reject) => {
            if (!options.slug) reject(send.fail400('Missing Product Slug'));
            const transferCode = uid(256);
            product.returnProductSlugAsync(options.slug, null)
                .then((prod) => {
                    if (!prod) return reject(send.fail404('This product does not exist'));
                    if (prod.data.owner !== options.user || options.role !== 1) reject(send.fail401());
                    const transfer = new Transfer({
                        product: options.slug,
                        code: transferCode,
                        original: prod.data.owner
                    });
                    return transfer.save();
                })
                .then((result) => {
                    const created = moment(result.created).clone();
                    const output = {
                        transferId: result._id,
                        product: result.product,
                        code: transferCode,
                        created: result.created,
                        expires: created.add('12', 'hours').format('LLLL')
                    };
                    resolve(send.success(output))
                })
                .catch((error) => {
                    if (error.code) return reject(error);
                    return reject(send.failErr(error))
                });
        })
    },
    takeOwnership(options) {
        //todo this probably doesn't belong here.. should move this to userauth
        //make the change locally
        //userauth swap product admin endpoint --> uses event system
    }
}