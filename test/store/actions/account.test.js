import proxyquire from 'proxyquire';

const account = proxyquire('../../../src/frontend/store/actions/account', {
  '../const': {

  },
  // '../../firebase/firebase': {
  //   firebase: {},
  // },
});
// import account from '../../../src/frontend/store/actions/account';

describe('Redux account actions should work', () => {
  it('Should render', () => {
    console.log(account);
    expect(true).toBe(true);
  });
});
