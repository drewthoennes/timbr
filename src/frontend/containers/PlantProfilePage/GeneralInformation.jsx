import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import map from '../../store/map';

class GeneralInformation extends React.PureComponent {
  render() {
    const {
      own, pets, speciesName, scientificName, description,
      birth, ownedSince, dead, death, plantLocation,
      name, parent, petChildren,
      store: { account: { username: ownUsername } },
      match: { params: { username, id } },
    } = this.props;

    let childrenNames;
    if (petChildren.length) {
      childrenNames = petChildren
        .map((child) => pets[child].name)
        .sort((a, b) => (a < b ? -1 : 1));

      if (childrenNames.length === 1) [childrenNames] = childrenNames;
      else if (childrenNames.length === 2) childrenNames = childrenNames.join(' and ');
      else {
        childrenNames[childrenNames.length - 1] = `and ${childrenNames[childrenNames.length - 1]}`;
        childrenNames = childrenNames.join(', ');
      }
    }

    return (
      <div>
        <Container className="mt-4">
          <Row className="align-items-center mt-2">
            <Col>
              <h4 className="text-center">{birth}</h4>
              <h5 className="text-center"><span role="img" aria-label="cake">🎂</span></h5>
            </Col>
            <Col>
              <h4 className="text-center">{ownedSince}</h4>
              <h5 className="text-center"><span role="img" aria-label="heart">💞</span></h5>
            </Col>
            { !!dead && (
              <Col>
                <h4 className="text-center">{death}</h4>
                <h5 className="text-center"><span role="img" aria-label="skull">💀</span></h5>
              </Col>
            )}
            {!!plantLocation && (
              <Col>
                <h4 className="text-center">{plantLocation}</h4>
                <h5 className="text-center"><span role="img" aria-label="plantLocation">📍</span></h5>
              </Col>
            )}
          </Row>
        </Container>
        <h5 className="mb-2 mt-3 text-center">{speciesName}, <i>{scientificName}</i></h5>
        <h6 className="text-center">{description}</h6>
        <br />
        { parent && <h6 className="text-center">{name} is an offshoot of {pets[parent].name}.</h6> }
        { petChildren.length > 0 && (
        <h6 className="text-center">
          {name} has {petChildren.length} offshoot
          {petChildren.length === 1 ? '' : 's'}: {childrenNames}.
        </h6>
        ) }
        { (parent || petChildren.length > 0) && (
          <p className="text-center">
            <Link to={`/${own ? ownUsername : username}/genealogy/${id}`}>See family tree</Link>
          </p>
        )}
      </div>
    );
  }
}

GeneralInformation.propTypes = {
  own: PropTypes.bool.isRequired,
  pets: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  speciesName: PropTypes.string.isRequired,
  scientificName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  birth: PropTypes.string.isRequired,
  ownedSince: PropTypes.string.isRequired,
  dead: PropTypes.bool,
  death: PropTypes.string,
  parent: PropTypes.string,
  petChildren: PropTypes.array,
  plantLocation: PropTypes.string.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      username: PropTypes.string,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(GeneralInformation));
