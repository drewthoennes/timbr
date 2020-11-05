import sinon from 'sinon';
import {
  changeUsername,
  registerWithTimbr,
  changePhoneNumber,
  changeTextsOn,
  changeEmailsOn,
} from '../../../src/frontend/store/actions/account';
import { validateStubCallCount } from '../../utils';

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

  it('Changing username that is already taken should show a window alert', async () => {
    const user = { val: () => true };

    mockDatabaseOnce.resolves(user);
    mockDatabaseUpdate.resolves();

    const funcPromise = await expect(changeUsername('newUsername'))
      .rejects;
    const stubOncePromise = validateStubCallCount(mockDatabaseOnce, 1);
    const stubWindowAlert = validateStubCallCount(mockWindowAlert, 1);

    return Promise.all([funcPromise, stubOncePromise, stubWindowAlert]);
  });

  it('Changing username for a user that doesn\'t exist should fail', async () => {
    const user = { val: () => false, exists: () => false };

    mockDatabaseOnce.resolves(user);
    mockDatabaseUpdate.resolves();
    mockCurrentUser.returns(1234567890);

    const funcPromise = await expect(changeUsername('newUsername'))
      .rejects;
    const stubOncePromise = validateStubCallCount(mockDatabaseOnce, 2);
    const stubWindowAlert = validateStubCallCount(mockWindowAlert, 0);

    return Promise.all([funcPromise, stubOncePromise, stubWindowAlert]);
  });

  it('Changing username should work as expected', async () => {
    const user = { val: () => false, exists: () => true };

    mockDatabaseOnce.resolves(user);
    mockDatabaseUpdate.resolves();
    mockCurrentUser.returns(1234567890);

    await changeUsername('newUsername');
    const stubOncePromise = validateStubCallCount(mockDatabaseOnce, 2);
    const stubWindowAlert = validateStubCallCount(mockWindowAlert, 0);
    const stubUpdate = validateStubCallCount(mockDatabaseUpdate, 1);

    return Promise.all([stubOncePromise, stubWindowAlert, stubUpdate]);
  });

  it('Registering with Timbr should work as expected', async () => {
    mockCreateUserStub.resolves();

    const funcPromise = await expect(registerWithTimbr({ email: 'test@purdue.edu', password: 'password' }))
      .resolves.toBe(undefined);
    const stubPromise = mockCreateUserStub.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Changing a user\'s phone number should reject if the current user isn\'t logged in', async () => {
    const phoneNumber = '7658675309';
    mockCurrentUser.returns(undefined);

    const funcPromise = await expect(changePhoneNumber(phoneNumber)).rejects;

    return funcPromise;
  });

  it('Changing a user\'s phone number should reject if it has already been used', async () => {
    const phoneNumber = '7658675309';
    const user = { val: () => true };

    mockCurrentUser.returns(1234567890);
    mockDatabaseOnce.resolves(user);

    const funcPromise = await expect(changePhoneNumber(phoneNumber)).rejects;
    const stubPromise = validateStubCallCount(mockDatabaseOnce, 1);

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Changing a user\'s phone number should reject if the current user doesn\'t have a profile', async () => {
    const phoneNumber = '7658675309';
    const user = { val: () => false, exists: () => false };

    mockCurrentUser.returns(1234567890);
    mockDatabaseOnce.resolves(user);

    const funcPromise = await expect(changePhoneNumber(phoneNumber)).rejects;
    const stubPromise = validateStubCallCount(mockDatabaseOnce, 2);

    return Promise.all([funcPromise, stubPromise]);
  });

  it('Changing a user\'s phone number should work as expected', async () => {
    const phoneNumber = '7658675309';
    const user = { val: () => false, exists: () => true };

    mockCurrentUser.returns(1234567890);
    mockDatabaseOnce.resolves(user);

    const funcPromise = await expect(changePhoneNumber(phoneNumber)).rejects;
    const onceStubPromise = validateStubCallCount(mockDatabaseOnce, 2);
    const updateStubPromise = validateStubCallCount(mockDatabaseUpdate, 1)
      && mockDatabaseUpdate.calledWith({ phoneNumber: `+1${phoneNumber}` });

    return Promise.all([funcPromise, onceStubPromise, updateStubPromise]);
  });

  it('Changing a user\'s texts to on should reject if the current user isn\'t logged in', async () => {
    mockCurrentUser.returns(undefined);

    const funcPromise = await expect(changeTextsOn(true)).rejects;

    return funcPromise;
  });

  it('Changing a user\'s texts to on should work as expected', async () => {
    const user = { exists: () => true };

    mockCurrentUser.returns(1234567890);
    mockDatabaseOnce.resolves(user);

    const funcPromise = await expect(changeTextsOn(true)).rejects;
    const updateStubPromise = validateStubCallCount(mockDatabaseUpdate, 1);

    return Promise.all([funcPromise, updateStubPromise]);
  });

  it('Changing a user\'s emails to on should reject if the current user isn\'t logged in', async () => {
    mockCurrentUser.returns(undefined);

    const funcPromise = await expect(changeEmailsOn(true)).rejects;

    return funcPromise;
  });

  it('Changing a user\'s emails to on should work as expected', async () => {
    const user = { exists: () => true };

    mockCurrentUser.returns(1234567890);
    mockDatabaseOnce.resolves(user);

    const funcPromise = await expect(changeEmailsOn(true)).rejects;
    const updateStubPromise = validateStubCallCount(mockDatabaseUpdate, 1);

    return Promise.all([funcPromise, updateStubPromise]);
  });
});
