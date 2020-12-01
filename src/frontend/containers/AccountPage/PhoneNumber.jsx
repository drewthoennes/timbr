import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import './styles.scss';
import { getPhoneNumber, changePhoneNumber } from '../../store/actions/account';

class PhoneNumber extends React.PureComponent {
  constructor() {
    super();

    this.getCurrentPhoneNumber = this.getCurrentPhoneNumber.bind(this);
    this.changePhoneNumber = this.changePhoneNumber.bind(this);

    this.state = {
      phoneNumber: '',
      phoneError: '',
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.getCurrentPhoneNumber();
  }

  componentDidUpdate(prevProps) {
    const { uid } = this.props;

    /* Changes phone number when uid changes. */
    if (uid !== prevProps.uid) {
      this.getCurrentPhoneNumber();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getCurrentPhoneNumber() {
    // Get the phone number from the database, hard coded for now
    getPhoneNumber(
      (phoneNumber) => {
        if (this.mounted) {
          this.setState({
            phoneNumber: phoneNumber.val().substring(2),
          });
        }
      },
    );
  }

  changePhoneNumber() {
    // removes the leading zeroes
    const number = parseInt(document.getElementById('phone-number').value, 10);

    // Error handling for phone number
    if (number < 0 || number.toString().length !== 10) {
      this.setState({
        phoneError: 'Phone number invalid!',
      });
      return;
    }
    this.setState({
      phoneError: '',
    });
    changePhoneNumber(number);
    /* Changes the phone number in the state. */
    this.getCurrentPhoneNumber();
    document.getElementById('phone-number').value = '';
  }

  render() {
    const { phoneError, phoneNumber } = this.state;
    return (
      <Row className="align-items-center mt-3">
        <Col sm={3}><h5 className="text-right">Phone Number</h5></Col>
        <Col sm={1} />
        <Col sm={5}>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">+1</span>
            </div>
            <input
              type="tel"
              className="form-control"
              placeholder={phoneNumber}
              id="phone-number"
            />
          </div>
        </Col>
        <Col sm={3}>
          <button
            id="change-phone-number"
            type="button"
            className="btn btn-outline-primary"
            onClick={this.changePhoneNumber}
          >
            Change Phone Number
          </button>
          <p>{phoneError}</p>
        </Col>
      </Row>
    );
  }
}

PhoneNumber.propTypes = {
  uid: PropTypes.string.isRequired,
};

export default PhoneNumber;
