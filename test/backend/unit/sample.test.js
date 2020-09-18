const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

chai.use(chaiAsPromised);

describe('...', () => {
  afterEach(() => {
    sinon.restore();
  });
});
