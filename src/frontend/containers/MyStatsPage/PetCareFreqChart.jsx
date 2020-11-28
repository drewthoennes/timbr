import React from 'react';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  ChartLabel,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
} from 'react-vis';
import 'react-vis/dist/style.css';

export default ({ data, height, xLabel }) => {
  const labelData = data.map((d) => ({
    x: d.x,
    y: d.y
  }));

  return (
    <div>
      <FlexibleXYPlot xType="ordinal" height={height}>
        <HorizontalGridLines />
        <XAxis/>
        <YAxis/>
        <ChartLabel
          text={xLabel}
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
          xPercent={0.02}
          yPercent={0.45}
          style={{ fontWeight: 'bold', transform: 'rotate(-90)' }}
        />
        <VerticalBarSeries color="#78C2AD" className="vertical-bar-series-example" data={data} />
      </FlexibleXYPlot>
    </div>
  );
}
