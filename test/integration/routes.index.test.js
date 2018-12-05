process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/index');

describe('routes : index', () => {

    describe('GET /', () => {
        it('should return HTML', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql('text/html');
                    // res.body.status.should.equal('success');
                    // res.body.message.should.eql('hello, world!');
                    done();
                });
        });
    });

});
