import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { addDate } from '../../store/actions/pets';
import { Container, Row, Col } from 'reactstrap';

const getToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 10);
};

class CareFrequency extends React.PureComponent {
  constructor() {
    super();
    this.markWatered = this.markWatered.bind(this);
    this.markFertilized = this.markFertilized.bind(this);
    this.markTurned = this.markTurned.bind(this);
    this.markFed = this.markFed.bind(this);
  }

  markWatered() {
    const { id, onChange } = this.props;
    addDate(id, 'watered', getToday()).then(onChange);
  }

  markFertilized() {
    const { id, onChange } = this.props;
    addDate(id, 'fertilized', getToday()).then(onChange);
  }

  markTurned() {
    const { id, onChange } = this.props;
    addDate(id, 'turned', getToday()).then(onChange);
  }

  markFed() {
    const { id, onChange } = this.props;
    addDate(id, 'fed', getToday()).then(onChange);
  }

  render() {
    const { pet, waterFreq, fertFreq, feedFreq, rotateFreq, carnivorous, dead, nextCycleDates } = this.props;

    const today = getToday();
    const hasWateredToday = !!pet?.watered?.history?.[today];
    const hasFertilizedToday = !!pet?.fertilized?.history?.[today];
    const hasTurnedToday = !!pet?.turned?.history?.[today];
    const hasFedToday = !!pet?.fed?.history?.[today];

    let feedFreqJSX;
    let feedButtonJSX;
    if (carnivorous) {
      feedFreqJSX = <p>{`Feed Frequency: Every ${feedFreq} days`}</p>;
      feedButtonJSX = (
        <Button
          type="button"
          disabled={hasFedToday}
          onClick={hasFedToday ? () => { } : this.markFed}
        >
          { hasFedToday ? 'Fed' : 'Feed'}
        </Button>
      );
    }

    return (
      <div>
        <Container className="mt-3">
          <Row className="align-items-center mt-2">
            <Col sm={4}>
              {dead ? <div />
                : (
                  <div id="care-buttons">
                    <Button
                      type="button"
                      disabled={hasWateredToday}
                      onClick={hasWateredToday ? () => { } : this.markWatered}
                    >
                      {hasWateredToday ? 'Watered' : 'Water'}
                    </Button>
                    {feedButtonJSX}
                  </div>
                )}
                {dead ? 
                (<h6 className="text-center">{`Required water every ${waterFreq} days`}</h6>) 
                : (
                  <h6 className="text-center">{`every ${waterFreq} days`}</h6>
                )}
              
            </Col>
            <Col sm={4}>
              {dead ? <div />
                : (
                  <div id="care-buttons">
                    <Button
                      type="button"
                      disabled={hasFertilizedToday}
                      onClick={hasFertilizedToday ? () => { } : this.markFertilized}
                    >
                      {hasFertilizedToday ? 'Fertilized' : 'Fertilize'}
                    </Button>
                    {feedButtonJSX}
                  </div>
                )}
              {dead ? 
                (<h6 className="text-center">{`Required fertilization every ${fertFreq} days`}</h6>) 
                : (
                  <h6 className="text-center">{`every ${fertFreq} days`}</h6>
                )}
            </Col>
            <Col sm={4}>
              {dead ? <div />
                : (
                  <div id="care-buttons">
                    <Button
                      type="button"
                      disabled={hasTurnedToday}
                      onClick={hasTurnedToday ? () => { } : this.markTurned}
                    >
                      {hasTurnedToday ? 'Turned' : 'Turn'}
                    </Button>
                    {feedButtonJSX}
                  </div>
                )}
              {dead ? 
                (<h6 className="text-center">{`Required rotation every ${rotateFreq} days`}</h6>) 
                : (
                  <h6 className="text-center">{`every ${rotateFreq} days`}</h6>
                )}
            </Col>
          </Row>
        </Container>
        <p>{`Days remaining to next water cycle: ${nextCycleDates[0]} days`}</p>
            <p>{`Days remaining to next fertilize cycle: ${nextCycleDates[1]} days`}</p>
            <p>{`Days remaining to next rotate cycle: ${nextCycleDates[2]} days`}</p>
            {carnivorous ? (<p>{`Days remaining to next feed cycle: ${nextCycleDates[3]} days`}</p>) : '' }
      </div>
    );
  }
}

CareFrequency.defaultProps = {
  onChange: () => { },
};

CareFrequency.propTypes = {
  id: PropTypes.string.isRequired,
  pet: PropTypes.shape({
    watered: PropTypes.shape({
      history: PropTypes.object,
    }).isRequired,
    fertilized: PropTypes.shape({
      history: PropTypes.object,
    }).isRequired,
    turned: PropTypes.shape({
      history: PropTypes.object,
    }).isRequired,
    fed: PropTypes.shape({
      history: PropTypes.object,
    }).isRequired,
  }).isRequired,
  waterFreq: PropTypes.number.isRequired,
  dead: PropTypes.number.isRequired,
  fertFreq: PropTypes.number.isRequired,
  feedFreq: PropTypes.any.isRequired,
  rotateFreq: PropTypes.number.isRequired,
  carnivorous: PropTypes.bool.isRequired,
  nextCycleDates: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};

export default CareFrequency;
