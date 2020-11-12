import React from 'react';
import PropTypes from 'prop-types';

class GeneralInformation extends React.PureComponent {
  render() {
    const { speciesName, scientificName, description, birth, ownedSince } = this.props;

    return (
      <div>
        <h2>General Information</h2>
        <p>{`Species Name: ${speciesName}`}</p>
        <p>{`Scientific Name: ${scientificName}`}</p>
        <p>{`Description: ${description}`}</p>
        <p>{`Born: ${birth}`}</p>
        <p>{`Owned Since: ${ownedSince}`}</p>
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
};

export default GeneralInformation;
