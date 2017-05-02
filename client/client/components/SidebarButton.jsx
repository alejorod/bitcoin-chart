import React from 'react';

export default function SidebarButton({icon, name}) {
  return (
    <button type="button">
      { icon }
      { name }
    </button>
  );
}
