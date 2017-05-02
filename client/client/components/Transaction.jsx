import React from 'react';

export default function Transaction({ammount, rate, up=true}) {
  let className = 'transaction-profit ';
  className += up ? 'high' : 'low';

  return (
    <div className="transaction">
      <div className="transaction-ammount">
        <i className="fa fa-dollar"></i>
        { ammount }
      </div>
      <div className={ className }>
        <i className="fa fa-caret-down"></i>
        { rate } %
      </div>
    </div>
  );
}
