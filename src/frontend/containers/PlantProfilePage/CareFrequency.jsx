import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
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
    const { pet, waterFreq, fertFreq, feedFreq, rotateFreq, carnivorous, dead } = this.props;

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
          onClick={hasFedToday ? () => {} : this.markFed}
        >
          { hasFedToday ? 'Fed' : 'Feed' }
        </Button>
      );
    }

    return (
      <div>
        <h2>Care Frequency</h2>

        <span>
          <div>
            <p>{`Water Frequency: Every ${waterFreq} days`}</p>
            <p>{`Fertilize Frequency: Every ${fertFreq} days`}</p>
            <p>{`Turn Frequency: Every ${rotateFreq} days`}</p>
            {feedFreqJSX}
          </div>

          {dead ? <div />
            : (
              <div id="care-buttons">
                <Button
                  type="button"
                  disabled={hasWateredToday}
                  onClick={hasWateredToday ? () => {} : this.markWatered}
                >
                  { hasWateredToday ? 'Watered' : 'Water' }
                </Button>

                <Button
                  type="button"
                  disabled={hasFertilizedToday}
                  onClick={hasFertilizedToday ? () => {} : this.markFertilized}
                >
                  { hasFertilizedToday ? 'Fertilized' : 'Fertilize' }
                </Button>

                <Button
                  type="button"
                  disabled={hasTurnedToday}
                  onClick={hasTurnedToday ? () => {} : this.markTurned}
                >
                  { hasTurnedToday ? 'Turned' : 'Turn' }
                </Button>

                {feedButtonJSX}
              </div>
            ) }
        </span>
      </div>
    );
  }
}

CareFrequency.defaultProps = {
  onChange: () => {},
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
  carnivorous: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

export default CareFrequency;
