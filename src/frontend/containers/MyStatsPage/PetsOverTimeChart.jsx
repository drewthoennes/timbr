import React from 'react';
import PropTypes from 'prop-types';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  ChartLabel,
  HorizontalGridLines,
  LineSeries,
} from 'react-vis';
import 'react-vis/dist/style.css';

const PetsOverTimeChart = ({ data, height }) => {
  const tickValues = [];
  const maxNumPlants = data.reduce((max, pt) => (pt.y > max ? pt.y : max), 0);
  for (let i = 0; i <= maxNumPlants; i++) {
    tickValues.push(i);
  }

  return (
    <div>
      <FlexibleXYPlot xType="ordinal" height={height}>
        <HorizontalGridLines tickTotal={maxNumPlants} />
        <XAxis />
        <YAxis tickValues={tickValues} tickFormat={(v) => parseInt(v, 10)} />
        <ChartLabel
          text="Week"
          className="alt-x-label"
          includeMargin={false}
          xPercent={0.5}
          yPercent={1.19}
          style={{ fontWeight: 'bold' }}
        />
        <ChartLabel
          text="Number of Plants"
          className="alt-y-label"
          includeMargin
          xPercent={0.01}
          yPercent={0.45}
          style={{ fontWeight: 'bold', transform: 'rotate(-90)' }}
        />
        <LineSeries
          color="#78C2AD"
          className="first-series"
          data={data}
        />
      </FlexibleXYPlot>
    </div>
  );
};

PetsOverTimeChart.propTypes = {
  data: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
};

export default PetsOverTimeChart;
