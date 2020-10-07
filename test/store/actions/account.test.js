import sinon from 'sinon';
import accountActions from '../../../src/frontend/store/actions/account';

const mockCreateUserStub = sinon.stub();
const mockSignInUserStub = sinon.stub();
const mockSignInPopupStub = sinon.stub();
const mockSignOutStub = sinon.stub();
const mockDatabaseOnce = sinon.stub();
const mockDatabaseUpdate = sinon.stub();

jest.mock('../../../src/frontend/firebase/firebase', () => ({
  firebase: {
    auth: () => ({
      createUserWithEmailAndPassword: mockCreateUserStub,
      signInWithEmailAndPassword: mockSignInUserStub,
      signInWithPopup: mockSignInPopupStub,
      signOut: mockSignOutStub,
    }),
    database: () => ({
      ref: () => ({
        once: mockDatabaseOnce,
        update: mockDatabaseUpdate,
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

  it('Registering with Timbr should work as expected', () => {
    mockCreateUserStub.resolves();

    const funcPromise = expect(accountActions.registerWithTimbr({ email: 'test@purdue.edu', password: 'password' }))
      .resolves.toBe(undefined);
    const stubPromise = mockCreateUserStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Logging in with Timbr should work as expected', () => {
    mockSignInUserStub.resolves();

    const funcPromise = expect(accountActions.loginWithTimbr({ email: 'test@purdue.edu', password: 'password' }))
      .resolves.toBe(undefined);
    const stubPromise = mockSignInUserStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Logging in with Facebook should work as expected', () => {
    mockSignInPopupStub.resolves();

    const funcPromise = expect(accountActions.loginWithFacebook())
      .resolves.toBe(undefined);
    const stubPromise = mockSignInPopupStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Logging in with Google should work as expected', () => {
    mockSignInPopupStub.resolves();

    const funcPromise = expect(accountActions.loginWithGoogle())
      .resolves.toBe(undefined);
    const stubPromise = mockSignInPopupStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Logging out should work as expected', () => {
    mockSignOutStub.resolves();

    const funcPromise = expect(accountActions.logout())
      .resolves.toBe(undefined);
    const stubPromise = mockSignOutStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Changing username should work as expected', () => {
    const user = { exists: () => true };

    mockDatabaseOnce.resolves(user);
    mockDatabaseUpdate.resolves();

    const funcPromise = expect(accountActions.changeUsername('newUsername'))
      .resolves.toBe(undefined);
    // Call count should be zero because of store initialization
    const stubOncePromise = mockDatabaseOnce.callCount === 0 ? Promise.resolve() : Promise.reject();
    // Call count should be zero because of store initialization
    const stubUpdatePromise = mockDatabaseUpdate.callCount === 0
      ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubOncePromise, stubUpdatePromise]);
  });
});
