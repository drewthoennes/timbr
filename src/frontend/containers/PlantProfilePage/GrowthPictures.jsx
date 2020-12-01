import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

class GrowthPictures extends React.PureComponent {
  render() {
    const { foreignPlant, pictures } = this.props;

    const cards = Object.entries(pictures)
      .sort(([i], [j]) => new Date(i) - new Date(j))
      .map(([index, picture]) => (
        <Card className="growth-pic-card" key={index}>
          <Card.Img className="card-img" variant="top" src={picture} />
          <Card.Body>
            <Card.Title className="text-center">{(new Date(index)).toISOString().split('T')[0]}</Card.Title>
          </Card.Body>
        </Card>
      ));

    const hintText = foreignPlant
      ? 'This user hasn\'t uploaded any growth pictures yet'
      : 'Click the edit button to add growth pictures';

    return (
      <div>
        <h2 className="text-center">Growth Pictures</h2>
        <div className="d-flex justify-content-center">
          {cards?.length ? cards : <p style={{ margin: '0px' }}>{hintText}</p>}
        </div>
      </div>
    );
  }
}

GrowthPictures.propTypes = {
  pictures: PropTypes.object.isRequired,
  foreignPlant: PropTypes.bool.isRequired,
};

export default GrowthPictures;
