import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import PlantProfilePage from '../../src/frontend/containers/PlantProfilePage';

const mockStore = configureStore([]);

describe('<PlantProfilePage />', () => {
  it('Should render', () => {
    const store = mockStore({});

    const subject = shallow(
      <Provider store={store}>
        <PlantProfilePage />
      </Provider>,
    );

    expect(subject.exists()).toBe(true);
  });
});
