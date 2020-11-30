import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

class GeneralInformation extends React.PureComponent {
  render() {
    const { speciesName, scientificName, description, birth, ownedSince, dead, death,
      location } = this.props;

    const locationProvided = () => {
      if (location == '' && !dead) {
        return (
          <div>
            <Container className="mt-4">
              <Row className="align-items-center mt-2">
                <Col sm={6}>
                  <h4 className="text-center">{`${birth}`}</h4>
                  <h5 className="text-center">{`🎂`}</h5>
                </Col>
                <Col sm={6}>
                  <h4 className="text-center">{`${ownedSince}`}</h4>
                  <h5 className="text-center">{`💞`}</h5>
                </Col>
              </Row>
            </Container>
          </div>
        );
      }
      return (
        <div>
          <Container className="mt-4">
            <Row className="align-items-center mt-2">
              <Col sm={4}>
                <h4 className="text-center">{`${birth}`}</h4>
                <h5 className="text-center">{`🎂`}</h5>
              </Col>
              <Col sm={4}>
                <h4 className="text-center">{`${ownedSince}`}</h4>
                <h5 className="text-center">{`💞`}</h5>
              </Col>
              <Col sm={4}>
                {dead === 1 ? (<h4 className="text-center">{death}</h4>) : <h4 className="text-center">{`${location}`}</h4>}
                {dead === 1 ? (<h5 className="text-center">{`💀`}</h5>) : <h5 className="text-center">{`📍`}</h5>}
              </Col>
            </Row>
          </Container>
        </div>
      );
    };

    return (
      <div>
        {locationProvided()}
        <h5 className="mb-2 mt-3 text-center">{`${speciesName}`}, <i>{`${scientificName}`}</i></h5>
        <h6 className="text-center">{`${description}`}</h6>
      </div>
    );
  }
}

GeneralInformation.propTypes = {
  speciesName: PropTypes.string.isRequired,
  scientificName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  birth: PropTypes.string.isRequired,
  ownedSince: PropTypes.string.isRequired,
  dead: PropTypes.number.isRequired,
  death: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

export default GeneralInformation;
