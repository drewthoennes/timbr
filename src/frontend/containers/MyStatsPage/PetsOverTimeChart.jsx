import React from 'react';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  ChartLabel,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
} from 'react-vis';
import 'react-vis/dist/style.css';

export default ({ data, height }) => {
  let tickValues = [];
  let maxNumPlants = data.reduce((max, pt) => pt.y > max ? pt.y : max, 0);
  for (let i = 0; i <= maxNumPlants; i++) {
    tickValues.push(i);
  }

  return (
    <div>
      <FlexibleXYPlot xType="ordinal" height={height}>
        <HorizontalGridLines tickTotal={maxNumPlants} />
        <XAxis/>
        <YAxis tickValues={tickValues} tickFormat={v => parseInt(v)} />
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
          includeMargin={true}
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
}
