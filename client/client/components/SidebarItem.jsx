import React from 'react';

export default function SidebarItem({className, title, children}) {
  return (
    <div className={ className }>
      <h3>{ title }</h3>
      { children }
    </div>
  );
}
