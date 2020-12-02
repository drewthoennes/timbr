import sinon from 'sinon';
import {
  loginWithTimbr,
  loginWithGoogle,
  loginWithFacebook,
  logout,
} from '../../../src/frontend/store/actions/auth';

const mockCreateUserStub = sinon.stub();
const mockSignInUserStub = sinon.stub();
const mockSignInPopupStub = sinon.stub();
const mockSignOutStub = sinon.stub();
const mockCurrentUser = sinon.stub();
const mockDatabaseOnce = sinon.stub();
const mockDatabaseUpdate = sinon.stub();

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

  it('Logging in with Timbr should work as expected', async () => {
    mockCurrentUser.onCall(0).returns(123456789);
    mockCurrentUser.onCall(1).returns(true);
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
});
