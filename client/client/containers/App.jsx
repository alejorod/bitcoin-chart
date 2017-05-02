import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Content';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Sidebar />
        <Dashboard />
      </div>
    );
  }
}
