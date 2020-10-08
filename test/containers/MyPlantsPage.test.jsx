import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import MyPlantsPage from '../../src/frontend/containers/MyPlantsPage';

const mockStore = configureStore([]);

describe('<MyPlantsPage />', () => {
  it('Should render', () => {
    const store = mockStore({});

    const subject = shallow(
      <Provider store={store}>
        <MyPlantsPage />
      </Provider>,
    );

    expect(subject.exists()).toBe(true);
  });
});
