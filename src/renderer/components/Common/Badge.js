import React from 'react';

export function Badge({ children, className = '' }) {
  return <span className={className}>{children}</span>;
}
