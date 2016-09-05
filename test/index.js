'use strict';

const Code = require('code');
const Lab = require('lab');


const internals = {};

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const it = lab.it;
const expect = Code.expect;


describe('foo', () => {
	it('bar', (done) => {
		console.log('baz');
		done();
	});
});