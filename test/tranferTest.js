import chai from 'chai';
import chaiHttp from 'chai-http';

import transfer from '../services/product/controller/transfer';

chai.should();
chai.use(chaiHttp);

/* Test the /GET route */
describe('product transfer functionality', () => {
    /**
     * return 400 if missing id or slug
     * return output object if present
     * @param options
     * @returns {Promise}
     */

    it('it should return return 400 when missing slug', (done) => {
        const json = {
            id: 'testid'
        };
        transfer.createTransferCode(json)
            .then((result) => {
                result.should.equal('undefined');
                done();
            })
            .catch((error) => {
                error.code.should.equal(400);
                done();
            })
    });

    it('it should return return 404 when product does not exist', (done) => {
        const json = {
            slug: 'test'
        };
        transfer.createTransferCode(json)
            .then((result) => {
                result.should.equal('undefined');
                done();
            })
            .catch((error) => {
                error.code.should.equal(404);
                done();
            })
    });

    //happy path here after we mock data
});