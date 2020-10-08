import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import NewPlantProfilePage from '../../src/frontend/containers/NewPlantProfilePage';

const mockStore = configureStore([]);

describe('<NewPlantProfilePage />', () => {
  it('Should render', () => {
    const store = mockStore({});

    const subject = shallow(
      <Provider store={store}>
        <NewPlantProfilePage />
      </Provider>,
    );

    expect(subject.exists()).toBe(true);
  });
});
