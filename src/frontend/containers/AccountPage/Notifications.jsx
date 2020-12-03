import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import { Row, Col } from 'reactstrap';
import './styles.scss';
import { getTextsOn, getEmailsOn, changeEmailsOn, changeTextsOn } from '../../store/actions/account';

class Notifications extends React.PureComponent {
  constructor() {
    super();

    this.getTextsOn = this.getTextsOn.bind(this);
    this.changeTextsOn = this.changeTextsOn.bind(this);
    this.getEmailsOn = this.getEmailsOn.bind(this);
    this.changeEmailsOn = this.changeEmailsOn.bind(this);

    this.state = {
      textsOn: false,
      emailsOn: false,
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.getTextsOn();
    this.getEmailsOn();
  }

  componentDidUpdate(prevProps) {
    const { uid } = this.props;

    /* Changes text notifications status
        and email notifications status when uid changes. */
    if (uid !== prevProps.uid) {
      this.getTextsOn();
      this.getEmailsOn();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /* Calls the function to get current text notifications status and sets the state. */
  getTextsOn() {
    const { uid } = this.props;
    getTextsOn(
      (user) => {
        if (this.mounted) {
          this.setState({ textsOn: user.val() });
        }
      }, uid,
    );
  }

  /* Calls the function to get current email notifications status and sets the state. */
  getEmailsOn() {
    const { uid } = this.props;
    getEmailsOn(
      (user) => {
        if (this.mounted) {
          this.setState({ emailsOn: user.val() });
        }
      }, uid,
    );
  }

  changeTextsOn(textsEvent) {
    this.setState({ textsOn: textsEvent });
    const textsOn = textsEvent;
    changeTextsOn(textsOn);
    /* Changes the text notifications status in the state. */
    this.getTextsOn();
  }

  changeEmailsOn(emailsEvent) {
    this.setState({ emailsOn: emailsEvent });
    const emailsOn = emailsEvent;
    changeEmailsOn(emailsOn);
    /* Changes the email notifications status in the state. */
    this.getEmailsOn();
  }

  render() {
    const { emailsOn, textsOn } = this.state;
    return (
      <div>
        <Row className="align-items-center">
          <Col sm={3}><h5 className="text-right">Email Notifications</h5></Col>
          <Col sm={1} />
          <Col sm={8}>
            <label htmlFor="email-switch">
              <input type="hidden" id="email-switch" />
              <Switch
                onChange={this.changeEmailsOn}
                checked={emailsOn || false}
              />
            </label>
          </Col>
        </Row>
        <Row className="align-items-center mt-2">
          <Col sm={3}><h5 className="text-right">Text Notifications</h5></Col>
          <Col sm={1} />
          <Col sm={8}>
            <label htmlFor="text-switch">
              <input type="hidden" id="text-switch" />
              <Switch
                onChange={this.changeTextsOn}
                checked={textsOn || false}
              />
            </label>
          </Col>
        </Row>
      </div>
    );
  }
}

Notifications.propTypes = {
  uid: PropTypes.string.isRequired,
};

export default Notifications;
