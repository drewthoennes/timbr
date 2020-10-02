import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import PetsPage from '../../src/frontend/containers/PetsPage';

const mockStore = configureStore([]);

describe('<AccountSettings/>', () => {
  it('Should render', () => {
    const store = mockStore({});

    const subject = shallow(
      <Provider store={store}>
        <PetsPage />
      </Provider>,
    );

    expect(subject.exists()).toBe(true);
  });
});
