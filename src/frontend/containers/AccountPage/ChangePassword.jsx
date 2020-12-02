import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import './styles.scss';
import { getProviderId } from '../../store/actions/auth';
import constants from '../../store/const';

class ChangePassword extends React.PureComponent {
  constructor() {
    super();
    this.canChangePassword = this.canChangePassword.bind(this);

    this.state = {
      canChangePassword: false,
    };
  }

  componentDidMount() {
    // this function will set the canChangePassword and providerId in the state
    this.canChangePassword();
  }

  canChangePassword() {
    switch (getProviderId()) {
      case constants.EMAIL_PROVIDER_ID:
        this.setState({ canChangePassword: true });
        break;
      case constants.GOOGLE_PROVIDER_ID:
      case constants.FACEBOOK_PROVIDER_ID:
      default:
        this.setState({ canChangePassword: false });
    }
  }

  render() {
    const { history } = this.props;
    const { canChangePassword } = this.state;
    return (
      <div>
        <Row style={{ visibility: canChangePassword ? 'visible' : 'hidden' }} className="align-items-center mt-3">
          <Col sm={3}><h5 className="text-right">Password</h5></Col>
          <Col sm={1} />
          <Col sm={8}>
            <button
              id="change-password"
              type="button"
              className="btn btn-outline-primary"
              onClick={() => history.push('/change-password')}
            >
              Change Password
            </button>
          </Col>
        </Row>
      </div>
    );
  }
}

ChangePassword.propTypes = {
  history: PropTypes.string.isRequired,
};

export default ChangePassword;
