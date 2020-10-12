import sinon from 'sinon';
import {
  registerWithTimbr,
  loginWithTimbr,
  loginWithGoogle,
  loginWithFacebook,
  logout,
  changeUsername,
} from '../../../src/frontend/store/actions/account';

const mockCreateUserStub = sinon.stub();
const mockSignInUserStub = sinon.stub();
const mockSignInPopupStub = sinon.stub();
const mockSignOutStub = sinon.stub();
const mockCurrentUser = sinon.stub();
const mockDatabaseOnce = sinon.stub();
const mockDatabaseUpdate = sinon.stub();
const mockWindowAlert = sinon.stub(window, 'alert');

jest.mock('../../../src/frontend/firebase/firebase', () => ({
  firebase: {
    auth: () => ({
      createUserWithEmailAndPassword: mockCreateUserStub,
      signInWithEmailAndPassword: mockSignInUserStub,
      signInWithPopup: mockSignInPopupStub,
      signOut: mockSignOutStub,
      currentUser: new Proxy({}, { get: mockCurrentUser }),
    }),
    database: () => ({
      ref: () => ({
        once: mockDatabaseOnce,
        update: mockDatabaseUpdate,
        orderByChild: () => ({
          equalTo: () => ({
            once: mockDatabaseOnce,
          }),
        }),
      }),
    }),
  },
  facebookAuthProvider: () => {},
  googleAuthProvider: () => {},
}));

describe('Redux account actions should work', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('Registering with Timbr should work as expected', async () => {
    mockCreateUserStub.resolves();

    const funcPromise = await expect(registerWithTimbr({ email: 'test@purdue.edu', password: 'password' }))
      .resolves.toBe(undefined);
    const stubPromise = mockCreateUserStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Logging in with Timbr should work as expected', async () => {
    mockSignInUserStub.resolves();

    const funcPromise = await expect(loginWithTimbr({ email: 'test@purdue.edu', password: 'password' }))
      .resolves.toBe(undefined);
    const stubPromise = mockSignInUserStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Logging in with Facebook should work as expected', async () => {
    mockSignInPopupStub.resolves();

    const funcPromise = await expect(loginWithFacebook())
      .resolves.toBe(undefined);
    const stubPromise = mockSignInPopupStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Logging in with Google should work as expected', async () => {
    mockSignInPopupStub.resolves();

    const funcPromise = await expect(loginWithGoogle())
      .resolves.toBe(undefined);
    const stubPromise = mockSignInPopupStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Logging out should work as expected', async () => {
    mockSignOutStub.resolves();

    const funcPromise = await expect(logout())
      .resolves;
    const stubPromise = mockSignOutStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Changing username that is already taken should show a window alert', async () => {
    const user = { val: () => true };

    mockDatabaseOnce.resolves(user);
    mockDatabaseUpdate.resolves();

    const funcPromise = await expect(changeUsername('newUsername'))
      .rejects;
    const stubOncePromise = mockDatabaseOnce.callCount === 1 ? Promise.resolve() : Promise.reject();
    const stubWindowAlert = mockWindowAlert.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubOncePromise, stubWindowAlert]);
  });

  it('Changing username for a user that doesn\'t exist should fail', async () => {
    const user = { val: () => false, exists: () => false };

    mockDatabaseOnce.resolves(user);
    mockDatabaseUpdate.resolves();
    mockCurrentUser.returns(1234567890);

    const funcPromise = await expect(changeUsername('newUsername'))
      .rejects;
    const stubOncePromise = mockDatabaseOnce.callCount === 2 ? Promise.resolve() : Promise.reject();
    const stubWindowAlert = mockWindowAlert.callCount === 0 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubOncePromise, stubWindowAlert]);
  });

  it('Changing username should work as expected', async () => {
    const user = { val: () => false, exists: () => true };

    mockDatabaseOnce.resolves(user);
    mockDatabaseUpdate.resolves();
    mockCurrentUser.returns(1234567890);

    await changeUsername('newUsername');
    const stubOncePromise = mockDatabaseOnce.callCount === 2 ? Promise.resolve() : Promise.reject();
    const stubWindowAlert = mockWindowAlert.callCount === 0 ? Promise.resolve() : Promise.reject();
    const stubUpdate = mockDatabaseUpdate.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([stubOncePromise, stubWindowAlert, stubUpdate]);
  });
});
