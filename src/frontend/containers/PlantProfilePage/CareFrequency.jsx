import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Container, Row, Col } from 'reactstrap';
import { addDate } from '../../store/actions/pets';

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
    const { pet, waterFreq, fertFreq, feedFreq, rotateFreq, carnivorous, dead, nextCycleDates,
      waterStreak, fertStreak, turnStreak, feedStreak } = this.props;

    const today = getToday();
    const hasWateredToday = !!pet?.watered?.history?.[today];
    const hasFertilizedToday = !!pet?.fertilized?.history?.[today];
    const hasTurnedToday = !!pet?.turned?.history?.[today];
    const hasFedToday = !!pet?.fed?.history?.[today];

    let feedButtonJSX;
    if (carnivorous) {
      feedButtonJSX = (
        <div>
          {feedStreak === 0 || feedStreak === '0' ? (<p>Feed Streak: {0}</p>) : (<p> Feed Streak: {feedStreak + 1}</p>) }

          <Button
            type="button"
            disabled={hasFedToday}
            onClick={hasFedToday ? () => {} : this.markFed}
          >
            { hasFedToday ? 'Fed' : 'Feed' }
          </Button>
        </div>
      );
    }

    const isCarnivorous = () => {
      if (carnivorous) {
        return (
          <div>
            <Container className="mt-3">
              <Row className="align-items-center mt-2">
                <Col sm={3}>
                  {dead
                    ? (<h6 className="text-center">{`Required water every ${waterFreq} days`}</h6>)
                    : (
                      <div id="care-buttons">
                        <h6 className="text-center">Water in</h6>
                        <h4 className="text-center">{nextCycleDates[0]} days</h4>
                        {waterStreak === 0 || waterStreak === '0' ? (<p>Water Streak: {0}</p>) : (<p> Water Streak: {waterStreak + 1}</p>) }
                        <Button
                          type="button"
                          disabled={hasWateredToday}
                          onClick={hasWateredToday ? () => { } : this.markWatered}
                        >
                          {hasWateredToday ? 'Watered' : 'Water'}
                        </Button>
                        <p className="text-center"><i>{`Cycle lasts ${waterFreq} days`}</i></p>
                      </div>
                    )}
                </Col>
                <Col sm={3}>
                  {dead
                    ? (<h6 className="text-center">{`Required fertilization every ${fertFreq} days`}</h6>)
                    : (
                      <div id="care-buttons">
                        <h6 className="text-center">Fertilize in</h6>
                        <h4 className="text-center">{nextCycleDates[1]} days</h4>
                        {fertStreak === 0 || fertStreak === '0' ? (<p>Fert Streak: {0}</p>) : (<p> Fert Streak: {fertStreak + 1}</p>) }

                        <Button
                          type="button"
                          disabled={hasFertilizedToday}
                          onClick={hasFertilizedToday ? () => { } : this.markFertilized}
                        >
                          {hasFertilizedToday ? 'Fertilized' : 'Fertilize'}
                        </Button>
                        <p className="text-center"><i>{`Cycle lasts ${fertFreq} days`}</i></p>
                      </div>
                    )}
                </Col>
                <Col sm={3}>
                  {dead
                    ? (<h6 className="text-center">{`Required rotation every ${rotateFreq} days`}</h6>)
                    : (
                      <div id="care-buttons">
                        <h6 className="text-center">Rotate in</h6>
                        <h4 className="text-center">{nextCycleDates[2]} days</h4>
                        {turnStreak === 0 || turnStreak === '0' ? (<p>Turn Streak: {0}</p>) : (<p> Turn Streak: {turnStreak + 1}</p>) }

                        <Button
                          type="button"
                          disabled={hasTurnedToday}
                          onClick={hasTurnedToday ? () => { } : this.markTurned}
                        >
                          {hasTurnedToday ? 'Turned' : 'Turn'}
                        </Button>
                        <p className="text-center"><i>{`Cycle lasts ${rotateFreq} days`}</i></p>
                      </div>
                    )}
                </Col>
                <Col sm={3}>
                  {dead
                    ? (<h6 className="text-center">{`Required water every ${feedFreq} days`}</h6>)
                    : (
                      <div id="care-buttons">
                        <h6 className="text-center">Feed in</h6>
                        <h4 className="text-center">{nextCycleDates[3]} days</h4>
                        {feedButtonJSX}
                        <p className="text-center"><i>{`Cycle lasts ${waterFreq} days`}</i></p>
                      </div>
                    )}
                </Col>
              </Row>
            </Container>
          </div>
        );
      }
      return (
        <div>
          <Container className="mt-3">
            <Row className="align-items-center mt-2">
              <Col sm={4}>
                {dead
                  ? (<h6 className="text-center">{`Required water every ${waterFreq} days`}</h6>)
                  : (
                    <div id="care-buttons">
                      <h6 className="text-center">Water in</h6>
                      <h4 className="text-center">{nextCycleDates[0]} days</h4>
                      {waterStreak === 0 || waterStreak === '0' ? (<p>Water Streak: {0}</p>) : (<p> Water Streak: {waterStreak + 1}</p>) }
                      <Button
                        type="button"
                        disabled={hasWateredToday}
                        onClick={hasWateredToday ? () => { } : this.markWatered}
                      >
                        {hasWateredToday ? 'Watered' : 'Water'}
                      </Button>
                      <p className="text-center"><i>{`Cycle lasts ${waterFreq} days`}</i></p>
                    </div>
                  )}
              </Col>
              <Col sm={4}>
                {dead
                  ? (<h6 className="text-center">{`Required fertilization every ${fertFreq} days`}</h6>)
                  : (
                    <div id="care-buttons">
                      <h6 className="text-center">Fertilize in</h6>
                      <h4 className="text-center">{nextCycleDates[1]} days</h4>
                      {fertStreak === 0 || fertStreak === '0' ? (<p>Fert Streak: {0}</p>) : (<p> Fert Streak: {fertStreak + 1}</p>) }
                      <Button
                        type="button"
                        disabled={hasFertilizedToday}
                        onClick={hasFertilizedToday ? () => { } : this.markFertilized}
                      >
                        {hasFertilizedToday ? 'Fertilized' : 'Fertilize'}
                      </Button>
                      <p className="text-center"><i>{`Cycle lasts ${fertFreq} days`}</i></p>
                    </div>
                  )}
              </Col>
              <Col sm={4}>
                {dead
                  ? (<h6 className="text-center">{`Required rotation every ${rotateFreq} days`}</h6>)
                  : (
                    <div id="care-buttons">
                      <h6 className="text-center">Rotate in</h6>
                      <h4 className="text-center">{nextCycleDates[2]} days</h4>
                      {turnStreak === 0 || turnStreak === '0' ? (<p>Turn Streak: {0}</p>) : (<p> Turn Streak: {turnStreak + 1}</p>) }
                      <Button
                        type="button"
                        disabled={hasTurnedToday}
                        onClick={hasTurnedToday ? () => { } : this.markTurned}
                      >
                        {hasTurnedToday ? 'Turned' : 'Turn'}
                      </Button>
                      <p className="text-center"><i>{`Cycle lasts ${rotateFreq} days`}</i></p>
                    </div>
                  )}
              </Col>
            </Row>
          </Container>
        </div>
      );
    };

    return (
      <div>
        <h2 className="text-center">Plant Care</h2>
        {isCarnivorous()}
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
  waterStreak: PropTypes.number.isRequired,
  fertStreak: PropTypes.number.isRequired,
  turnStreak: PropTypes.number.isRequired,
  feedStreak: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

export default CareFrequency;
