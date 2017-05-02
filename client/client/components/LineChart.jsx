import React from 'react';
import Chart from './../utils/charts';

export default class LineChart extends React.Component {
  componentDidMount() {
    this.chart = new Chart({
      el: `${this.props.name}-chart`,
      data: this.props.data,
      xRange: this.props.xRange,
      colors: this.props.colors
    });

    this.chart.draw();
  }

  render() {
    let labels = Object.keys(this.props.colors);

    return (
      <div className={`chart ${this.props.location}`} id={`${this.props.name}-chart`}>
        <div className="title">
          <span className="name">{ this.props.name }</span>
        </div>
        <div className="legends">
          {labels.map(l => {
            return (<span className={ l }>{ l }</span>);
          })}
        </div>
      </div>
    );
  }
}
