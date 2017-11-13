import Transfer from '../model/transfer';

function uid (len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

export default {
    createTransferCode(options) {
        return new Promise((resolve, reject) => {
            const transfer = new Transfer({
                user_id: options.id,
                product: options.slug,
                code: uid(256)
            });
            return transfer.save()
                .then(result => resolve(result))
                .catch(error => reject(error));
        })
    },
    takeOwnership(options) {
        //todo
    }
}