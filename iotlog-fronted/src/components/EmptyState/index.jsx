import React from 'react';
import TextSpan from '../Text/TextSpan';

export default function EmptyState({
  title = 'No Data',
  subtitle = 'No data available',
  iconName = <span style={{ fontSize: 32 }}>📁</span>,
  button = null,
  className = ""
}) {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      userSelect: 'none'
    }}
      className={className}
    >
      <div style={{ marginBottom: '1rem' }}>{iconName}</div>
      <TextSpan apparence="s1">{title}</TextSpan>
      <TextSpan apparence="s3" hint>{subtitle}</TextSpan>
      {button}
    </div>
  );
};

