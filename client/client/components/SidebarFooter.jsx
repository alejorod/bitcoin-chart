import React from 'react';

export default function SidebarFooter({fullName, accountType}) {
  return (
    <div className="profile">
      <div className="profile-icon">
        <i className="fa fa-user"></i>
      </div>
      <div className="profile-name">{ fullName } - { accountType }</div>
    </div>
  );
}
