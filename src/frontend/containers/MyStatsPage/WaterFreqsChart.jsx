import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  ChartLabel,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
} from 'react-vis';
import 'react-vis/dist/style.css';

export default ({ data }) => {
  const width = 800;
  const height = 300;
  const labelData = data.map((d) => ({
    x: d.x,
    y: d.y
  }));

  return (
    <div>
      <XYPlot xType="ordinal" width={width} height={height}>
        <HorizontalGridLines />
        <XAxis/>
        <YAxis/>
        <ChartLabel
          text="Watering Frequency"
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
        <VerticalBarSeries color="#78C2AD" className="vertical-bar-series-example" data={data} />
      </XYPlot>
    </div>
  );
}
