import sinon from 'sinon';
import { createNewPet } from '../../../src/frontend/store/actions/pets';

const mockPush = sinon.stub();

jest.mock('../../../src/frontend/firebase/firebase', () => ({
  firebase: {
    auth: () => ({
      currentUser: { uid: 100 },
    }),
    database: () => ({
      ref: () => ({
        push: mockPush,
      }),
    }),
  },
  facebookAuthProvider: () => {},
  googleAuthProvider: () => {},
}));

const pet = {
  name: 'Test',
  type: 10000,
  ownedSince: Date.now(),
  birth: Date.now() - 100000,
  death: '',
};

describe('Redux account actions should work', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('Creating a new pet should work as expected', () => {
    mockPush.resolves();

    const funcPromise = expect(createNewPet(pet))
      .resolves.toBe(undefined);
    const stubCallCountPromise = mockPush.callCount === 1 ? Promise.resolve() : Promise.reject();

    return Promise.all([funcPromise, stubCallCountPromise]);
  });
});
