import React from 'react';

export default function Stat({icon, value, name, highlight=false}) {

  let className = 'stat ';
  let valueIcon = '';

  if (highlight) {
    className += value < 0 ? 'low' : 'high';
    valueIcon = value < 0
      ? <i className="fa fa-minus"></i>
      : <i className="fa fa-plus"></i>;
    value = Math.abs(value);
  }

  return (
    <div className={ className }>
      <div className="stat-icon">{ icon }</div>
      <div className="stat-item">
        <div className="value">{ valueIcon } { value }</div>
        <div className="name">{ name }</div>
      </div>
    </div>
  );
}
