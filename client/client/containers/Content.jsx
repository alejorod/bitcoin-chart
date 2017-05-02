import React from 'react';
import { LineChart } from './../components';

let baseData = [
  {
    sell: 1040,
    buy: 1048
  },
  {
    sell: 1046,
    buy: 1050
  },
  {
    sell: 1051,
    buy: 1053
  },
  {
    sell: 1043,
    buy: 1047
  },
  {
    sell: 1049,
    buy: 1054
  },
  {
    sell: 1057,
    buy: 1060
  }
].reverse();

let dailyData = [];
for (var i = 0; i < 4; i++) {
  dailyData = dailyData.concat(baseData.reverse());
}

export default function Dashboard() {
  return (
    <div className="content">
      <LineChart
        name="day"
        location="top"
        colors={{
          sell: '#bdf1c7',
          buy: '#7ec9e8'
        }}
        xRange={[0, 23]}
        data={dailyData} />

      <div className="bottom">
        <LineChart
          name="month"
          location="left"
          colors={{
            sell: '#bdf1c7',
            buy: '#7ec9e8'
          }}
          xRange={[0, 30]}
          data={dailyData} />
        <LineChart
          name="year"
          location="right"
          colors={{
            sell: '#bdf1c7',
            buy: '#7ec9e8'
          }}
          xRange={[0, 11]}
          data={dailyData} />
      </div>
    </div>
  );
}
