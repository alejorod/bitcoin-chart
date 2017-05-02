import React from 'react';
import { SidebarItem, SidebarButton, SidebarFooter, Stat, Transaction } from './../components';

export default class Sidebar extends React.Component {
  render() {
    let transactions = [
      {
        ammount: 6000,
        rate: 1.02,
        up: false
      },
      {
        ammount: 3258.37,
        rate: 0.22,
        up: true
      },
      {
        ammount: 2922,
        rate: 0.61,
        up: false
      },
      {
        ammount: 3258.37,
        rate: 0.22,
        up: true
      },
      {
        ammount: 2922,
        rate: 0.61,
        up: false
      }
    ];

    return (
      <div className="sidebar">
        <SidebarItem className="current-rate" title="CURRENT RATE">
          <Stat icon={<i className="fa fa-dollar"></i>} value="1,338.41" name="sell"/>
          <Stat icon={<i className="fa fa-dollar"></i>} value="1,338.41" name="buy"/>
        </SidebarItem>

        <SidebarItem className="account-summary" title="ACCOUNT SUMMARY">
          <Stat icon={<i className="fa fa-btc"></i>} value="4.4158" name="total bitcoin"/>
          <Stat icon={<i className="fa fa-dollar"></i>} value="5,890.29" name="total usd"/>
          <Stat icon={<i className="fa fa-dollar"></i>} value="6,000" name="invested"/>
          <Stat icon={<i className="fa fa-dollar"></i>} value={-50.23} name="income" highlight={true}/>
        </SidebarItem>

        <SidebarItem className="transactions" title="RECENT TRANSACTIONS">
          {transactions.map(t => {
            return (
              <Transaction ammount={t.ammount} rate={t.rate} up={t.up} />
            );
          })}

          <SidebarButton icon={<i className="fa fa-bars"></i>} name="transactions details"/>
          <SidebarButton icon={<i className="fa fa-plus"></i>} name="add transaction"/>
        </SidebarItem>

        <SidebarFooter fullName="Alejo Rodriguez" accountType="xapo" />
      </div>
    );
  }
}
