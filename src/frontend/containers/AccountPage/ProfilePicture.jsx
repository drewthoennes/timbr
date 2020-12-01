import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import './styles.scss';
import { getProfilePicture, changeProfilePicture } from '../../store/actions/account';
import DefaultPicture from '../../assets/images/profile_picture.png';

class ProfilePicture extends React.PureComponent {
  constructor() {
    super();

    this.getCurrentProfilePicture = this.getCurrentProfilePicture.bind(this);
    this.changeProfilePicture = this.changeProfilePicture.bind(this);
    this.state = {
      profilePic: DefaultPicture,
      pictureFeedback: '',
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.getCurrentProfilePicture();
  }

  componentDidUpdate(prevProps) {
    const { uid } = this.props;
    /* Changes username, text notifications status,
    and email notifications status when uid changes. */
    if (uid !== prevProps.uid) {
      this.getCurrentProfilePicture();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /* Calls the function to get the url for the current profile picture and sets the state. */
  getCurrentProfilePicture() {
    // Comment out the following lines when not testing profile picture.
    getProfilePicture(
      (picture) => {
        if (picture && this.mounted) {
          this.setState({ profilePic: picture });
        }
      },
    );
  }

  // The following function changes the profile picture in the database.
  changeProfilePicture(file) {
    if (!file) {
      return;
    }
    const fileSize = file.size / (1024 * 1024); // gets the file size in MB
    if (fileSize > 1) {
      this.setState({
        pictureFeedback: 'File too large! Please upload a file of size less than 1 MB.',
      });
      return;
    }
    changeProfilePicture(file)
      .then(() => {
        this.getCurrentProfilePicture();
        if (this.mounted) {
          this.setState({
            pictureFeedback: 'Profile picture updated!',
          });
        }
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({
            pictureFeedback: error.message,
          });
        }
      });
  }

  render() {
    const { profilePic, pictureFeedback } = this.state;
    const styles = {
      width: '150px',
    };
    return (
      <div>
        <Row className="align-items-center mt-2">
          <Col sm={3}><h5 className="text-right">Profile Picture</h5></Col>
          <Col sm={1} />
          <Col sm={2}>
            <img style={styles} id="profile-picture" src={profilePic} alt="Profile" />
          </Col>
          <Col sm={6}>
            <label htmlFor="image-uploader">
              Change Profile Picture:
              <br />
              <input
                type="file"
                id="image-uploader"
                accept="image/jpg,image/jpeg,image/png"
                onChange={(event) => { this.changeProfilePicture(event.target.files[0]); }}
              />
            </label>
            <p id="picture-feedback">{pictureFeedback}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

ProfilePicture.propTypes = {
  uid: PropTypes.string.isRequired,
};

export default ProfilePicture;
